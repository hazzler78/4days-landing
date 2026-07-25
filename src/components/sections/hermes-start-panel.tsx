"use client";

import { useEffect, useMemo, useState } from "react";
import { Apple, Monitor, Sparkles, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { hermesGuideMeta } from "@/content/hermes-guide";
import { cn } from "@/lib/utils";

type Os = "mac" | "windows" | "other";

function detectOs(): Os {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent || "";
  if (/Windows/i.test(ua)) return "windows";
  if (/Mac OS X|Macintosh/i.test(ua)) return "mac";
  return "other";
}

export function HermesStartPanel({ className }: { className?: string }) {
  const [os, setOs] = useState<Os>("other");

  useEffect(() => {
    setOs(detectOs());
  }, []);

  const primary = useMemo(() => {
    if (os === "windows") {
      return {
        label: "Starta här – Windows",
        href: hermesGuideMeta.install.desktop,
        hint: hermesGuideMeta.install.winHint,
        icon: Monitor,
      };
    }
    if (os === "mac") {
      return {
        label: "Starta här – Mac",
        href: hermesGuideMeta.install.desktop,
        hint: hermesGuideMeta.install.macHint,
        icon: Apple,
      };
    }
    return {
      label: "Starta här – ladda ner Hermes",
      href: hermesGuideMeta.install.hub,
      hint: "Välj Mac eller Windows på nästa sida. Linux: CLI-install finns i docs.",
      icon: Sparkles,
    };
  }, [os]);

  const Icon = primary.icon;

  return (
    <div
      className={cn(
        "rounded-2xl border border-accent/25 bg-white/95 p-6 shadow-[var(--shadow-premium)] sm:p-8",
        className
      )}
    >
      <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold text-brand">
        <Sparkles className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
        Super-enkelt · Grok/xAI default
      </div>

      <h2 className="mt-4 text-2xl font-bold tracking-tight text-brand sm:text-3xl">
        Klicka. Installera. Kör.
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
        Ingen 40-sidors kurs. Du får Hermes Desktop, loggar in med{" "}
        <strong>Grok/xAI</strong> (free funkar) eller ert{" "}
        <strong>teamkonto</strong>, och landar rakt i setup av första agenten.
      </p>

      <ol className="mt-5 space-y-2 text-sm text-slate-700">
        <li className="flex gap-2">
          <span className="font-bold text-accent">1.</span>
          Starta installern (Mac/Windows)
        </li>
        <li className="flex gap-2">
          <span className="font-bold text-accent">2.</span>
          Logga in – Grok/xAI default, eller befintligt teamkonto
        </li>
        <li className="flex gap-2">
          <span className="font-bold text-accent">3.</span>
          Följ AI-guiden i appen → första agent samma dag
        </li>
      </ol>

      <div className="mt-6 flex flex-col gap-3">
        <Button asChild size="lg" className="h-14 text-base">
          <a
            href={primary.href}
            target="_blank"
            rel="noopener noreferrer"
            data-os={os}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
            {primary.label}
          </a>
        </Button>
        <p className="text-xs leading-relaxed text-slate-500">{primary.hint}</p>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <Button asChild variant="outline" size="sm">
          <a
            href={hermesGuideMeta.install.desktop}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Apple className="h-4 w-4" aria-hidden="true" />
            Mac
          </a>
        </Button>
        <Button asChild variant="outline" size="sm">
          <a
            href={hermesGuideMeta.install.desktop}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Monitor className="h-4 w-4" aria-hidden="true" />
            Windows
          </a>
        </Button>
      </div>

      <details className="mt-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
        <summary className="cursor-pointer font-medium text-slate-800">
          Avancerat: terminal (Linux / power users)
        </summary>
        <p className="mt-2 flex items-start gap-2">
          <Terminal className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <code className="break-all rounded bg-white px-1.5 py-0.5 text-[11px]">
            {hermesGuideMeta.install.cli}
          </code>
        </p>
      </details>

      <p className="mt-5 border-t border-slate-100 pt-4 text-xs text-slate-500">
        Efter install: öppna den korta setup-guiden på den här sidan – eller
        mejla hello@4days.ai om något strular.{" "}
        <span className="text-slate-700">
          En dag mer frihet. Med AI.
        </span>
      </p>
    </div>
  );
}
