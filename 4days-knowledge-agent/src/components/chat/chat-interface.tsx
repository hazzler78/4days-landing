"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Send, Trash2, Bot, User, Loader2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { SourceReference } from "@/types/database";
import { toast } from "sonner";

type ChatMetadata = {
  sources?: SourceReference[];
  sessionId?: string;
};

function getMessageText(message: UIMessage): string {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");
}

export function ChatInterface() {
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string | undefined>();
  const [sourcesMap, setSourcesMap] = useState<Record<string, SourceReference[]>>({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const sessionIdRef = useRef(sessionId);
  sessionIdRef.current = sessionId;

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: () => ({ sessionId: sessionIdRef.current }),
        fetch: async (input, init) => {
          const response = await fetch(input, init);
          const sid = response.headers.get("X-Session-Id");
          if (sid) setSessionId(sid);

          const sourcesHeader = response.headers.get("X-Sources");
          if (sourcesHeader) {
            try {
              const sources = JSON.parse(sourcesHeader) as SourceReference[];
              setSourcesMap((prev) => ({ ...prev, pending: sources }));
            } catch {
              // ignore
            }
          }
          return response;
        },
      }),
    []
  );

  const { messages, sendMessage, status, setMessages, error } = useChat({
    transport,
    onError: (err) => {
      toast.error(err.message || "Kunde inte generera svar");
    },
    onFinish: ({ message }) => {
      const metadata = message.metadata as ChatMetadata | undefined;
      const sources = metadata?.sources ?? sourcesMap.pending;
      if (sources?.length) {
        setSourcesMap((prev) => {
          const { pending, ...rest } = prev;
          void pending;
          return { ...rest, [message.id]: sources };
        });
      }
      if (metadata?.sessionId) {
        setSessionId(metadata.sessionId);
      }
    },
  });

  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  async function handleClearChat() {
    if (!confirm("Rensa chatthistorik?")) return;
    try {
      await fetch("/api/chat/sessions", { method: "DELETE" });
      setMessages([]);
      setSourcesMap({});
      setSessionId(undefined);
      toast.success("Chat rensad");
    } catch {
      toast.error("Kunde inte rensa chat");
    }
  }

  const handleSend = useCallback(() => {
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input.trim() });
    setInput("");
  }, [input, isLoading, sendMessage]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div>
          <h1 className="font-semibold text-lg">Fråga agenten</h1>
          <p className="text-sm text-muted-foreground">
            Ställ frågor om dina uppladdade dokument
          </p>
          {error && (
            <p className="text-sm text-destructive mt-1">{error.message}</p>
          )}
        </div>
        {messages.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleClearChat}>
            <Trash2 className="mr-2 h-4 w-4" />
            Rensa chat
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 px-4">
        <div className="max-w-3xl mx-auto py-6 space-y-6">
          {messages.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-primary/5">
                <Bot className="h-8 w-8 text-brand-accent" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Välkommen till Knowledge Agent</h2>
                <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                  Ladda upp dokument i sidopanelen och ställ sedan frågor om innehållet.
                  Agenten svarar baserat på din kunskapsbas.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 pt-4">
                {[
                  "Sammanfatta huvudpunkterna",
                  "Vad säger dokumenten om...?",
                  "Lista viktiga begrepp",
                ].map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => setInput(suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message) => {
              const text = getMessageText(message);
              const sources =
                sourcesMap[message.id] ??
                ((message.metadata as ChatMetadata | undefined)?.sources);

              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === "assistant" && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-primary">
                      <Bot className="h-4 w-4 text-brand-accent" />
                    </div>
                  )}

                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                      message.role === "user"
                        ? "bg-brand-primary text-white"
                        : "bg-muted"
                    )}
                  >
                    <p className="whitespace-pre-wrap">{text}</p>

                    {sources && sources.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-border/50 space-y-2">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <BookOpen className="h-3 w-3" />
                          Källor
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {sources.map((s, i) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="text-xs font-normal cursor-default"
                              title={s.content}
                            >
                              {s.documentFilename} · chunk {s.chunkIndex}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {message.role === "user" && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-accent/20">
                      <User className="h-4 w-4 text-brand-primary" />
                    </div>
                  )}
                </div>
              );
            })
          )}

          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-primary">
                <Bot className="h-4 w-4 text-brand-accent" />
              </div>
              <div className="bg-muted rounded-2xl px-4 py-3">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className="border-t border-border p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="max-w-3xl mx-auto flex gap-2"
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Skriv din fråga här..."
            className="min-h-[52px] max-h-32 resize-none"
            disabled={isLoading}
            rows={1}
          />
          <Button
            type="submit"
            size="icon"
            className="h-[52px] w-[52px] shrink-0 bg-brand-accent text-brand-primary hover:bg-brand-accent/90"
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
