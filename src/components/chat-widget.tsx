"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const STORAGE_KEY = "4days_chat_messages_v1";
const VISITOR_SESSION_KEY = "4days_chat_visitor_id";
const STARTERS = [
  "Hur fungerar 4-dagarsvecka hos er?",
  "Vad kostar AI Kickstart?",
  "Jag vill boka ett möte",
];

function getVisitorSessionId() {
  try {
    const existing = sessionStorage.getItem(VISITOR_SESSION_KEY);
    if (existing) return existing;
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `v_${Date.now()}`;
    sessionStorage.setItem(VISITOR_SESSION_KEY, id);
    return id;
  } catch {
    return `v_${Date.now()}`;
  }
}

function loadMessages(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (m) =>
        m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string"
    );
  } catch {
    return [];
  }
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = loadMessages();
    if (stored.length) setMessages(stored);
    else {
      setMessages([
        {
          role: "assistant",
          content:
            "Hej! 👋 Jag är 4days.ai Agent. Fråga mig om 4-dagarsvecka, AI-automatisering eller boka ett möte direkt här i chatten.",
        },
      ]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-40)));
    } catch {
      /* ignore */
    }
  }, [messages]);

  useEffect(() => {
    if (!open) return;
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, open, loading]);

  const canSend = useMemo(
    () => input.trim().length > 0 && !loading,
    [input, loading]
  );

  async function sendMessage(text: string) {
    const content = text.trim();
    if (!content || loading) return;

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content },
    ];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.filter((m) => m.role === "user" || m.role === "assistant"),
          visitorSessionId: getVisitorSessionId(),
          pageUrl: window.location.href,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Kunde inte skicka meddelandet.");
      }
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || "Tack! Hur kan jag hjälpa dig vidare?" },
      ]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Något gick fel. Försök igen om en stund."
      );
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void sendMessage(input);
  }

  return (
    <div className="fixed bottom-5 right-5 z-[80]">
      {open && (
        <div
          className="mb-3 flex h-[min(640px,calc(100vh-7rem))] w-[min(420px,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-2xl border border-accent/30 bg-white shadow-2xl"
          role="dialog"
          aria-label="4days.ai Agent chat"
        >
          <div className="flex items-center justify-between gap-3 bg-brand px-4 py-3 text-white">
            <div>
              <p className="text-sm font-semibold">4days.ai Agent</p>
              <p className="text-xs text-slate-300">{siteConfig.slogan}</p>
            </div>
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/10"
              aria-label="Stäng chat"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div
            ref={listRef}
            className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4"
          >
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={cn(
                  "max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
                  message.role === "user"
                    ? "ml-auto rounded-br-sm bg-accent text-brand-dark"
                    : "mr-auto rounded-bl-sm border border-slate-200 bg-white text-slate-700"
                )}
              >
                {message.content}
              </div>
            ))}
            {loading && (
              <div className="mr-auto rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500">
                Skriver...
              </div>
            )}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                {error}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 px-4 pb-2">
            {STARTERS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-brand hover:bg-accent/20"
                onClick={() => void sendMessage(prompt)}
                disabled={loading}
              >
                {prompt}
              </button>
            ))}
          </div>

          <form
            onSubmit={onSubmit}
            className="flex gap-2 border-t border-slate-200 bg-white p-3"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={1}
              placeholder="Skriv din fråga..."
              className="max-h-28 min-h-11 flex-1 resize-none rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
              aria-label="Chattmeddelande"
            />
            <button
              type="submit"
              disabled={!canSend}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-brand-dark disabled:opacity-50"
              aria-label="Skicka"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
          <p className="bg-white px-3 pb-3 text-center text-[11px] text-slate-500">
            AI-assistent ·{" "}
            <a href={siteConfig.calendlyUrl} target="_blank" rel="noopener noreferrer" className="underline">
              Boka möte
            </a>
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-3 text-sm font-bold text-brand-dark shadow-lg shadow-accent/30 transition hover:-translate-y-0.5"
        aria-expanded={open}
        aria-label={open ? "Stäng chat" : "Öppna chat"}
      >
        <MessageCircle className="h-4 w-4" />
        Fråga 4days.ai
      </button>
    </div>
  );
}
