"use client";

import { useState } from "react";
import { Check, Copy, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  /** Path to the Markdown version of the page, e.g. "/faq.md". */
  mdPath: string;
  tone?: "light" | "dark";
  className?: string;
};

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();
  document.execCommand("copy");
  document.body.removeChild(area);
}

/** Small "Kopiera för AI" / "Visa som Markdown" actions, like docs.x.ai. */
export function PageAiActions({ mdPath, tone = "light", className }: Props) {
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");

  const onCopy = async () => {
    try {
      const res = await fetch(mdPath, { cache: "no-store" });
      if (!res.ok) throw new Error(String(res.status));
      await copyText(await res.text());
      setState("copied");
    } catch {
      setState("error");
    }
    window.setTimeout(() => setState("idle"), 2000);
  };

  const base =
    "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
  const look =
    tone === "dark"
      ? "border-white/20 bg-white/5 text-slate-300 hover:border-white/40 hover:text-white"
      : "border-slate-200 bg-white text-slate-600 hover:border-accent/50 hover:text-brand";

  return (
    <div
      className={cn("flex flex-wrap items-center gap-2", className)}
      data-page-ai-actions=""
    >
      <button
        type="button"
        onClick={onCopy}
        className={cn(base, look)}
        aria-live="polite"
        data-action="copy-for-ai"
      >
        {state === "copied" ? (
          <Check className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
        ) : (
          <Copy className="h-3.5 w-3.5" aria-hidden="true" />
        )}
        {state === "copied"
          ? "Kopierat"
          : state === "error"
            ? "Kunde inte kopiera"
            : "Kopiera för AI"}
      </button>
      <a
        href={mdPath}
        target="_blank"
        rel="noopener"
        className={cn(base, look)}
        data-action="view-markdown"
      >
        <FileText className="h-3.5 w-3.5" aria-hidden="true" />
        Visa som Markdown
      </a>
    </div>
  );
}
