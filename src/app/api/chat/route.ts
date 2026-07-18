import { NextResponse } from "next/server";
import { buildSystemPrompt } from "@/lib/server/agent-prompt";
import { logChatExchange } from "@/lib/server/chat-log";

const XAI_API = "https://api.x.ai/v1/chat/completions";
const OPENAI_EMBEDDINGS_API = "https://api.openai.com/v1/embeddings";
const EMBEDDING_MODEL = "text-embedding-3-small";
const CHAT_MODEL = process.env.XAI_MODEL || "grok-3-mini";
const MAX_MESSAGES = 20;
const MAX_USER_CHARS = 2000;

const CHAT_BUSY_MESSAGE =
  "Hög belastning just nu – vänta en stund och försök igen.";
const CHAT_UNAVAILABLE_MESSAGE =
  "Jag kunde inte svara just nu. Prova igen om en stund, eller maila hello@4days.ai så hjälper vi dig personligen.";

type ChatMessage = { role: "user" | "assistant"; content: string };

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return { url: url.replace(/\/$/, ""), key };
}

async function generateQueryEmbedding(query: string, openaiKey: string) {
  const res = await fetch(OPENAI_EMBEDDINGS_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${openaiKey}`,
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      input: query,
      dimensions: 1536,
    }),
  });

  if (!res.ok) {
    console.error("OpenAI embedding error", res.status, await res.text());
    return null;
  }

  const data = await res.json();
  return data?.data?.[0]?.embedding ?? null;
}

async function retrieveRelevantChunks(query: string, openaiKey?: string) {
  const supabase = getSupabaseConfig();
  if (!supabase || !openaiKey) return [];

  try {
    const embedding = await generateQueryEmbedding(query, openaiKey);
    if (!embedding) return [];

    const res = await fetch(
      `${supabase.url}/rest/v1/rpc/match_document_chunks`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabase.key,
          Authorization: `Bearer ${supabase.key}`,
        },
        body: JSON.stringify({
          query_embedding: embedding,
          match_count: 8,
          match_threshold: 0.3,
        }),
      }
    );

    if (!res.ok) {
      console.error("Supabase RAG error", res.status, await res.text());
      return [];
    }

    return res.json();
  } catch (err) {
    console.error(
      "Supabase RAG unreachable:",
      err instanceof Error ? err.message : err
    );
    return [];
  }
}

function buildRagContext(
  chunks: Array<{
    document_filename?: string;
    chunk_index?: number;
    content?: string;
  }>
) {
  if (!Array.isArray(chunks) || chunks.length === 0) return "";
  return chunks
    .map(
      (c, i) =>
        `[Källa ${i + 1}: ${c.document_filename || "dokument"}, chunk ${c.chunk_index}]\n${c.content}`
    )
    .join("\n\n---\n\n");
}

function normalizeMessages(messages: unknown): ChatMessage[] {
  if (!Array.isArray(messages)) return [];
  return messages
    .filter(
      (m): m is ChatMessage =>
        !!m &&
        typeof m === "object" &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string"
    )
    .map((m) => ({
      role: m.role,
      content: m.content.trim().slice(0, MAX_USER_CHARS),
    }))
    .filter((m) => m.content.length > 0)
    .slice(-MAX_MESSAGES);
}

async function chatWithGrok(
  systemPrompt: string,
  messages: ChatMessage[],
  xaiKey: string
) {
  const res = await fetch(XAI_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${xaiKey}`,
    },
    body: JSON.stringify({
      model: CHAT_MODEL,
      temperature: 0.6,
      messages: [{ role: "system", content: systemPrompt }, ...messages],
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.error?.message || data?.error || `xAI svarade ${res.status}`;
    throw new Error(msg);
  }

  const reply = data?.choices?.[0]?.message?.content;
  if (!reply) throw new Error("Tomt svar från xAI");
  return reply.trim();
}

function formatChatError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  if (message.includes("rate limit") || message.includes("429")) {
    return CHAT_BUSY_MESSAGE;
  }
  return CHAT_UNAVAILABLE_MESSAGE;
}

export async function POST(request: Request) {
  const xaiKey = process.env.XAI_API_KEY;
  if (!xaiKey) {
    console.error("XAI_API_KEY saknas");
    return NextResponse.json(
      { error: CHAT_UNAVAILABLE_MESSAGE },
      { status: 503 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Ogiltigt JSON-format." },
      { status: 400 }
    );
  }

  const messages = normalizeMessages(body.messages);
  if (messages.length === 0) {
    return NextResponse.json(
      { error: "Skicka minst ett meddelande." },
      { status: 400 }
    );
  }

  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUser) {
    return NextResponse.json(
      { error: "Ingen användarfråga hittades." },
      { status: 400 }
    );
  }

  try {
    const openaiKey = process.env.OPENAI_API_KEY;
    const chunks = await retrieveRelevantChunks(lastUser.content, openaiKey);
    const ragContext = buildRagContext(chunks);
    const systemPrompt = buildSystemPrompt(ragContext);
    const reply = await chatWithGrok(systemPrompt, messages, xaiKey);

    const sources = Array.isArray(chunks)
      ? chunks.slice(0, 4).map(
          (c: {
            document_filename?: string;
            chunk_index?: number;
            similarity?: number;
          }) => ({
            document: c.document_filename,
            chunk: c.chunk_index,
            similarity: c.similarity,
          })
        )
      : [];

    const visitorSessionId =
      typeof body.visitorSessionId === "string"
        ? body.visitorSessionId.trim().slice(0, 64)
        : "";

    await logChatExchange({
      visitorSessionId,
      pageUrl:
        typeof body.pageUrl === "string" ? body.pageUrl.slice(0, 500) : "",
      userAgent: request.headers.get("user-agent") || "",
      userContent: lastUser.content,
      assistantContent: reply,
      sources,
    });

    return NextResponse.json({ reply, sources });
  } catch (err) {
    console.error("Chat error", err);
    return NextResponse.json(
      { error: formatChatError(err) },
      { status: 502 }
    );
  }
}
