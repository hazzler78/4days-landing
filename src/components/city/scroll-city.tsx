"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { CITY_ASSETS, getCityAssets, type CityVisitMode } from "@/lib/city-assets";
import { markReturningVisit } from "@/lib/visit-tracker";
import { cn } from "@/lib/utils";

type ScrollCityProps = {
  mode: CityVisitMode;
  /** Extra scroll height for pin duration (e.g. "280%"). */
  scrollLength?: string;
  className?: string;
  onProgress?: (progress: number) => void;
  /** Overlay / atmosphere — pinned with the video. */
  children?: ReactNode;
};

/**
 * Scroll-driven cinematic city.
 * Primary path: GSAP ScrollTrigger video scrub.
 *
 * Perf notes:
 * - Seeking large MP4s every scroll frame is expensive. We throttle seeks via rAF
 *   and skip tiny deltas. For smooth scrub, re-encode with frequent keyframes
 *   (e.g. -g 12) and target ~1080p / smaller bitrate — see /public/video/README.md.
 */
export function ScrollCity({
  mode,
  scrollLength = "220%",
  className,
  onProgress,
  children,
}: ScrollCityProps) {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const markedRef = useRef(false);
  const targetTimeRef = useRef(0);
  const lastAppliedRef = useRef(-1);
  const rafRef = useRef<number | null>(null);
  const seekingRef = useRef(false);
  const assets = getCityAssets(mode);

  useEffect(() => {
    if (reduceMotion) return;
    if (CITY_ASSETS.useGlbCity) return;

    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    let ctx: { revert: () => void } | null = null;
    let cancelled = false;

    const flushSeek = () => {
      rafRef.current = null;
      if (cancelled || seekingRef.current) return;

      const next = targetTimeRef.current;
      // Skip microscopic seeks — browser decode is the bottleneck
      if (Math.abs(next - lastAppliedRef.current) < 0.04) return;

      seekingRef.current = true;
      const onSeeked = () => {
        video.removeEventListener("seeked", onSeeked);
        seekingRef.current = false;
        lastAppliedRef.current = video.currentTime;
        // If scroll moved further while we were seeking, catch up
        if (Math.abs(targetTimeRef.current - lastAppliedRef.current) >= 0.04) {
          rafRef.current = requestAnimationFrame(flushSeek);
        }
      };
      video.addEventListener("seeked", onSeeked);

      try {
        video.currentTime = next;
      } catch {
        seekingRef.current = false;
        video.removeEventListener("seeked", onSeeked);
      }
    };

    const queueSeek = (t: number) => {
      targetTimeRef.current = t;
      if (rafRef.current == null && !seekingRef.current) {
        rafRef.current = requestAnimationFrame(flushSeek);
      }
    };

    const setup = async () => {
      const gsapMod = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (cancelled) return;

      const gsap = gsapMod.default;
      gsap.registerPlugin(ScrollTrigger);

      const prepareVideo = () =>
        new Promise<void>((resolve) => {
          if (video.readyState >= 2) {
            resolve();
            return;
          }
          const done = () => {
            video.removeEventListener("loadeddata", done);
            video.removeEventListener("canplay", done);
            resolve();
          };
          video.addEventListener("loadeddata", done);
          video.addEventListener("canplay", done);
          video.load();
        });

      await prepareVideo();
      if (cancelled) return;

      video.pause();
      try {
        video.currentTime = 0;
      } catch {
        /* ignore */
      }

      const duration = Math.max(video.duration || 1, 0.1);

      ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: `+=${scrollLength}`,
          pin: true,
          // Higher scrub = smoother scroll, fewer panicked seeks
          scrub: 1.2,
          anticipatePin: 1,
          fastScrollEnd: true,
          onUpdate: (self) => {
            const progress = self.progress;
            queueSeek(progress * duration);
            onProgress?.(progress);

            if (mode === "first" && progress >= 0.92 && !markedRef.current) {
              markedRef.current = true;
              markReturningVisit();
            }
          },
        });
      }, section);
    };

    void setup();

    return () => {
      cancelled = true;
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      ctx?.revert();
    };
  }, [mode, reduceMotion, scrollLength, onProgress, assets.video]);

  return (
    <div
      ref={sectionRef}
      className={cn(
        "relative h-[100svh] w-full overflow-hidden bg-brand-dark",
        className
      )}
    >
      {reduceMotion || CITY_ASSETS.useGlbCity ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={assets.poster}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden="true"
        />
      ) : (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          poster={assets.poster}
          muted
          playsInline
          // Buffer more of the file so seeks don't stall mid-scroll
          preload="auto"
          controls={false}
          aria-hidden="true"
          tabIndex={-1}
        >
          {/* Add city-*.webm under /public/video/ then uncomment:
          <source src={assets.videoWebm} type="video/webm" /> */}
          <source src={assets.video} type="video/mp4" />
        </video>
      )}

      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/45 to-brand-dark/25"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-brand-dark/75 via-brand-dark/20 to-transparent"
        aria-hidden="true"
      />

      {children}
    </div>
  );
}
