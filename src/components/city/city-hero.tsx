"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowRight, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollCity } from "@/components/city/scroll-city";
import { siteConfig, getBookingUrl } from "@/lib/site";
import { readVisitMode, type VisitMode } from "@/lib/visit-tracker";

const CityAtmosphere = dynamic(
  () =>
    import("@/components/city/city-atmosphere").then((m) => m.CityAtmosphere),
  { ssr: false }
);

export function CityHero() {
  const reduceMotion = useReducedMotion();
  const [mode, setMode] = useState<VisitMode>("first");
  const [hydrated, setHydrated] = useState(false);
  const [showAtmosphere, setShowAtmosphere] = useState(false);

  useEffect(() => {
    setMode(readVisitMode());
    setHydrated(true);

    const enable = () => setShowAtmosphere(true);
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(enable, { timeout: 1800 });
      return () => window.cancelIdleCallback(id);
    }
    const t = window.setTimeout(enable, 600);
    return () => window.clearTimeout(t);
  }, []);

  const isReturning = hydrated && mode === "returning";

  return (
    <section
      id="start"
      className="relative"
      aria-label={
        isReturning
          ? "Framtidsstaden — när AI och människor arbetar tillsammans"
          : "Staden byggs medan du scrollar — AI och människor sida vid sida"
      }
    >
      <ScrollCity mode={hydrated ? mode : "first"} scrollLength="220%">
        {showAtmosphere && !reduceMotion ? (
          <div className="pointer-events-none absolute inset-0 z-[1]">
            <CityAtmosphere mode={mode} />
          </div>
        ) : null}

        <div className="pointer-events-none absolute inset-0 z-10 flex items-end sm:items-center">
          <div className="pointer-events-auto mx-auto w-full max-w-6xl px-4 pb-16 pt-28 sm:px-6 sm:pb-24 lg:px-8">
            <p className="font-display text-sm font-medium tracking-[0.18em] text-accent uppercase">
              {siteConfig.brand}
            </p>

            <h1 className="font-display mt-5 max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              En dag mer frihet.{" "}
              <span className="text-accent">Med AI.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
              {isReturning
                ? "När det repetitiva är automatiserat får människor tid över — och staden lever."
                : "Scrolla och se hur AI och människor bygger nästa arbetsvecka tillsammans."}
            </p>

            <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <Button asChild size="xl">
                <a
                  href={getBookingUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <CalendarDays className="h-5 w-5" aria-hidden="true" />
                  Boka 30 min kartläggning
                </a>
              </Button>
              <Button asChild size="xl" variant="secondary">
                <a href="#guide">
                  Ladda ner guide
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </a>
              </Button>
            </div>

            <p className="mt-8 text-xs tracking-wide text-slate-400 sm:text-sm">
              {isReturning
                ? "Välkommen tillbaka — staden är färdigbyggd."
                : "Scrolla för att bygga staden"}
            </p>
          </div>
        </div>
      </ScrollCity>
    </section>
  );
}
