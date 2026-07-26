"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { siteConfig, getBookingUrl } from "@/lib/site";

type Track = "build" | "future";

const COOKIE_KEY = "4days_journey_track";

const VALUES = [
  {
    title: "Människan först",
    text: "AI ersätter inte er – den tar det repetitiva så ni får tid till kreativitet, kunder och liv.",
  },
  {
    title: "Tillsammans med AI",
    text: "AI som formerar sig runt er – på plats när ni behöver den. Trygg samverkan, mindre tvivel, mer nytta.",
  },
  {
    title: "Utmaningen",
    text: "Fem dagar i veckan? Vi utmanar er till fyra – med bibehållen eller högre output. Tar ni bettet?",
  },
  {
    title: "En dag mer frihet. Med AI.",
    text: "Det är därför 4days.ai finns. Inte teknik för teknikens skull – mer tid till det som betyder något.",
  },
];

function readTrack(): Track {
  if (typeof window === "undefined") return "build";
  try {
    const v = window.localStorage.getItem(COOKIE_KEY);
    if (v === "future" || v === "build") return v;
  } catch {
    /* ignore */
  }
  return "build";
}

function writeTrack(track: Track) {
  try {
    window.localStorage.setItem(COOKIE_KEY, track);
  } catch {
    /* ignore */
  }
}

export function JourneyScrollSection() {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [track, setTrack] = useState<Track>("build");
  const [ready, setReady] = useState(false);
  const [activeCard, setActiveCard] = useState(0);

  useEffect(() => {
    setTrack(readTrack());
  }, []);

  // After first visit, prefer future city next time
  useEffect(() => {
    if (track === "build") {
      const t = window.setTimeout(() => writeTrack("future"), 45_000);
      return () => window.clearTimeout(t);
    }
  }, [track]);

  // Cycle value cards while video plays
  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => {
      setActiveCard((i) => (i + 1) % VALUES.length);
    }, 5000);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  // Full story montage (~40s): bygge → människor+AI → färdig framtid
  const src =
    track === "future"
      ? "/videos/journey/future/story.mp4"
      : "/videos/journey/main.mp4";
  const poster =
    track === "future"
      ? "/videos/journey/posters/01-future.jpg"
      : "/videos/journey/posters/nano-assemble.jpg";

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduceMotion) return;
    setReady(false);
    video.load();
    const onReady = () => {
      setReady(true);
      void video.play().catch(() => {
        /* autoplay blocked — user can still scroll */
      });
    };
    video.addEventListener("loadeddata", onReady);
    return () => video.removeEventListener("loadeddata", onReady);
  }, [src, reduceMotion]);

  const toggleTrack = () => {
    const next: Track = track === "build" ? "future" : "build";
    setTrack(next);
    writeTrack(next);
  };

  return (
    <section
      id="resa"
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-brand-dark"
      aria-label="4days.ai — vision och värderingar"
    >
      <div className="absolute inset-0">
        {reduceMotion ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={poster} alt="" className="h-full w-full object-cover" />
        ) : (
          <video
            ref={videoRef}
            key={src}
            className={cn(
              "h-full w-full object-cover transition-opacity duration-700",
              ready ? "opacity-100" : "opacity-0"
            )}
            src={src}
            poster={poster}
            muted
            playsInline
            autoPlay
            loop
            preload="auto"
            controls={false}
            aria-hidden="true"
            tabIndex={-1}
          />
        )}
        <div
          className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/50 to-brand-dark/30"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-brand-dark/80 via-brand-dark/25 to-transparent"
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-10 pt-28 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            {track === "build"
              ? "AI som materialiseras när ni behöver den"
              : "När AI formerar sig runt människan"}
          </div>
          <button
            type="button"
            onClick={toggleTrack}
            className="rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-xs font-medium text-white backdrop-blur hover:bg-black/55"
          >
            {track === "build" ? "Kort framtidsslinga →" : "← Hela resan"}
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((item, i) => {
            const isLast = i === VALUES.length - 1;
            const active = i === activeCard;
            return (
              <button
                key={item.title}
                type="button"
                onClick={() => setActiveCard(i)}
                className={cn(
                  "rounded-2xl border p-4 text-left backdrop-blur-md transition-all duration-300",
                  isLast
                    ? "border-accent/40 bg-accent/15 sm:col-span-2 lg:col-span-1"
                    : "border-white/10 bg-black/35",
                  active
                    ? "ring-2 ring-accent/60 scale-[1.02]"
                    : "opacity-85 hover:opacity-100"
                )}
              >
                <p
                  className={cn(
                    "text-sm font-bold leading-snug sm:text-base",
                    isLast
                      ? "bg-gradient-to-r from-accent to-cyan bg-clip-text text-transparent"
                      : "text-white"
                  )}
                >
                  {item.title}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-slate-200 sm:text-sm">
                  {item.text}
                </p>
              </button>
            );
          })}
        </div>

        <p className="mt-6 text-center text-lg font-semibold tracking-tight text-white sm:text-xl">
          En dag mer frihet.{" "}
          <span className="bg-gradient-to-r from-accent to-cyan bg-clip-text text-transparent">
            Med AI.
          </span>
        </p>

        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg">
            <Link href="#guide">
              Få guiden gratis
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <a
              href={getBookingUrl()}
              target="_blank"
              rel="noopener noreferrer"
            >
              Boka 30 min intro
            </a>
          </Button>
          <a
            href="#start"
            className="inline-flex items-center gap-1 text-xs text-slate-300 hover:text-white"
          >
            <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
            Scrolla vidare
          </a>
        </div>
      </div>
    </section>
  );
}
