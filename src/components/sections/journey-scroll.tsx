"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Track = "build" | "future";

type Segment = {
  id: string;
  title: string;
  subtitle: string;
  build: string;
  future: string;
  posterBuild: string;
  posterFuture: string;
};

const COOKIE_KEY = "4days_journey_track";
const SEGMENTS: Segment[] = [
  {
    id: "aerial",
    title: "En ny stad tar form",
    subtitle: "En byggnadsplats under uppbyggnad — AI och robotar bygger det som saknas.",
    build: "/videos/journey/build/01-aerial.mp4",
    future: "/videos/journey/future/01-aerial.mp4",
    posterBuild: "/videos/journey/posters/01-build.jpg",
    posterFuture: "/videos/journey/posters/01-future.jpg",
  },
  {
    id: "waterfront",
    title: "Genom bygget",
    subtitle: "Flyg mellan ofärdiga torn, kranar och robotar som sätter staden på plats.",
    build: "/videos/journey/build/02-waterfront.mp4",
    future: "/videos/journey/future/02-waterfront.mp4",
    posterBuild: "/videos/journey/posters/01-build.jpg",
    posterFuture: "/videos/journey/posters/01-future.jpg",
  },
  {
    id: "street",
    title: "Gatorna formas",
    subtitle: "Ännu inte klart — men riktningen är tydlig: smartare, snabbare, bättre.",
    build: "/videos/journey/build/04-street.mp4",
    future: "/videos/journey/future/04-street.mp4",
    posterBuild: "/videos/journey/posters/01-build.jpg",
    posterFuture: "/videos/journey/posters/01-future.jpg",
  },
  {
    id: "fpv",
    title: "Staden är klar",
    subtitle: "Samma plats. Färdigbyggd. Så fort kan AI hjälpa oss bygga framtiden.",
    build: "/videos/journey/build/05-fpv.mp4",
    future: "/videos/journey/future/05-fpv.mp4",
    posterBuild: "/videos/journey/posters/05-build.jpg",
    posterFuture: "/videos/journey/posters/05-future.jpg",
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
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [track, setTrack] = useState<Track>("build");
  const [segIndex, setSegIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const [progressLabel, setProgressLabel] = useState(0);

  useEffect(() => {
    setTrack(readTrack());
  }, []);

  const segment = SEGMENTS[segIndex] ?? SEGMENTS[0];
  const src = track === "future" ? segment.future : segment.build;
  const poster = track === "future" ? segment.posterFuture : segment.posterBuild;

  const heights = useMemo(() => SEGMENTS.map(() => 160), []);

  const onScroll = useCallback(() => {
    const el = containerRef.current;
    const video = videoRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const total = el.offsetHeight - window.innerHeight;
    if (total <= 0) return;

    const scrolled = Math.min(Math.max(-rect.top, 0), total);
    const global = scrolled / total; // 0..1
    setProgressLabel(Math.round(global * 100));

    const n = SEGMENTS.length;
    const raw = global * n;
    const idx = Math.min(n - 1, Math.floor(raw));
    const local = Math.min(1, Math.max(0, raw - idx));

    setSegIndex((prev) => (prev === idx ? prev : idx));

    if (video && video.duration && !reduceMotion) {
      const t = local * video.duration * 0.98;
      if (Math.abs(video.currentTime - t) > 0.033) {
        try {
          video.currentTime = t;
        } catch {
          /* ignore seek errors while loading */
        }
      }
    }

    // When user finishes first journey, unlock future for next visit
    if (global > 0.92 && track === "build") {
      writeTrack("future");
    }
  }, [reduceMotion, track]);

  useEffect(() => {
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [onScroll]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    setReady(false);
    video.load();
    const mark = () => setReady(true);
    video.addEventListener("loadeddata", mark);
    return () => video.removeEventListener("loadeddata", mark);
  }, [src]);

  const toggleTrack = () => {
    const next: Track = track === "build" ? "future" : "build";
    setTrack(next);
    writeTrack(next);
  };

  const scrollHeightVh = heights.reduce((a, b) => a + b, 0);

  return (
    <section
      id="resa"
      ref={containerRef}
      className="relative bg-brand-dark"
      style={{ height: `${scrollHeightVh}vh` }}
      aria-label="Scrollresa genom en framtidsstad — före och efter med AI"
    >
      <div className="sticky top-0 flex h-[100svh] w-full items-end overflow-hidden">
        {/* Video layer */}
        <div className="absolute inset-0">
          {reduceMotion ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={poster}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <video
              ref={videoRef}
              key={src}
              className={cn(
                "h-full w-full object-cover transition-opacity duration-500",
                ready ? "opacity-100" : "opacity-0"
              )}
              src={src}
              poster={poster}
              muted
              playsInline
              preload="auto"
              controls={false}
              aria-hidden="true"
            />
          )}
          <div
            className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/35 to-brand-dark/25"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-brand-dark/70 via-transparent to-transparent"
            aria-hidden="true"
          />
        </div>

        {/* HUD / chapters */}
        <div className="relative z-10 flex w-full flex-col justify-between px-4 pb-8 pt-24 sm:px-6 lg:px-8">
          <div className="mx-auto flex w-full max-w-6xl items-start justify-between gap-4">
            <div className="max-w-xl rounded-2xl border border-white/10 bg-black/35 p-5 backdrop-blur-md sm:p-6">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                {track === "build"
                  ? "Första resan — ny stad under uppbyggnad"
                  : "Välkommen tillbaka — den ståtliga staden är klar"}
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Stopp {segIndex + 1} / {SEGMENTS.length}
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                {segment.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-200 sm:text-base">
                {segment.subtitle}
              </p>
            </div>

            <div className="flex flex-col items-end gap-2">
              <button
                type="button"
                onClick={toggleTrack}
                className="rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-xs font-medium text-white backdrop-blur hover:bg-black/55"
              >
                {track === "build" ? "Visa framtid →" : "← Visa bygge"}
              </button>
              <a
                href="#varfor"
                className="rounded-full border border-white/15 bg-black/30 px-3 py-1.5 text-xs text-slate-200 backdrop-blur hover:bg-black/45"
              >
                Hoppa över resan
              </a>
            </div>
          </div>

          <div className="mx-auto mt-8 w-full max-w-6xl">
            {/* Progress */}
            <div className="mb-4 flex items-center gap-3">
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full rounded-full bg-accent transition-[width] duration-150"
                  style={{ width: `${progressLabel}%` }}
                />
              </div>
              <span className="w-10 text-right text-xs text-slate-300">
                {progressLabel}%
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {SEGMENTS.map((s, i) => (
                <span
                  key={s.id}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[11px] font-medium",
                    i === segIndex
                      ? "bg-accent text-brand-dark"
                      : i < segIndex
                        ? "bg-white/20 text-white"
                        : "bg-white/10 text-slate-300"
                  )}
                >
                  {s.id}
                </span>
              ))}
            </div>

            {/* End CTA — visible more at the end */}
            <div
              className={cn(
                "mt-6 flex flex-col gap-3 transition-opacity duration-500 sm:flex-row sm:items-center",
                progressLabel > 78 ? "opacity-100" : "opacity-40"
              )}
            >
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="#guide">
                  Få guiden gratis
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto"
              >
                <a
                  href="https://calendly.com/hello-4days/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Boka 30 min intro
                </a>
              </Button>
              <p className="flex items-center gap-1 text-xs text-slate-300 sm:ml-2">
                <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
                Scrolla för att flyga
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
