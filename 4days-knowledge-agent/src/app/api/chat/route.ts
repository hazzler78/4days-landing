import { createClient } from "@/lib/supabase/server";
import { streamText, convertToModelMessages, type UIMessage } from "ai";
import {
  retrieveRelevantChunks,
  buildRagContext,
  chunksToSources,
  SYSTEM_PROMPT,
} from "@/lib/ai/rag";
import {
  getChatModel,
  getChatProviderLabel,
  formatChatError,
} from "@/lib/ai/chat-model";

export const maxDuration = 60;

function getTextFromMessage(message: UIMessage): string {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response("Ej autentiserad", { status: 401 });
  }

  const { messages, sessionId } = (await request.json()) as {
    messages: UIMessage[];
    sessionId?: string;
  };

  if (!messages?.length) {
    return new Response("Inga meddelanden", { status: 400 });
  }

  const lastUserMessage = [...messages]
    .reverse()
    .find((m) => m.role === "user");

  if (!lastUserMessage) {
    return new Response("Ingen användarfråga", { status: 400 });
  }

  const queryText = getTextFromMessage(lastUserMessage);
  const chunks = await retrieveRelevantChunks(supabase, queryText);
  const context = buildRagContext(chunks);
  const sources = chunksToSources(chunks);

  let activeSessionId = sessionId;

  if (!activeSessionId) {
    const { data: session } = await supabase
      .from("chat_sessions")
      .insert({
        user_id: user.id,
        title: queryText.slice(0, 80),
      })
      .select()
      .single();
    activeSessionId = session?.id;
  }

  if (activeSessionId) {
    await supabase.from("chat_messages").insert({
      session_id: activeSessionId,
      role: "user",
      content: queryText,
    });
  }

  const result = streamText({
    model: getChatModel(),
    system: `${SYSTEM_PROMPT}\n\nKONTEXT FRÅN KUNSKAPSBASEN:\n${context}`,
    messages: await convertToModelMessages(messages),
    onFinish: async ({ text }) => {
      if (activeSessionId) {
        await supabase.from("chat_messages").insert({
          session_id: activeSessionId,
          role: "assistant",
          content: text,
          sources,
        });
      }
    },
    onError: ({ error }) => {
      console.error(`[chat] ${getChatProviderLabel()} error:`, error);
    },
  });

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    headers: {
      "X-Session-Id": activeSessionId ?? "",
      "X-Sources": JSON.stringify(sources),
      "X-Chat-Provider": process.env.CHAT_PROVIDER ?? "xai",
    },
    messageMetadata: () => ({
      sources,
      sessionId: activeSessionId,
    }),
    onError: (error) => formatChatError(error),
  });
}
