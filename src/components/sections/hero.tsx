"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CalendarDays, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";

export function HeroSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative min-h-[100svh] overflow-hidden text-white">
      <Image
        src="/bilder/Hero.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-brand-dark/95 via-brand/80 to-brand/40"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(105deg, rgba(2,6,23,0.92) 0%, rgba(15,23,42,0.78) 42%, rgba(15,23,42,0.42) 68%, rgba(16,185,129,0.16) 100%)",
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl"
        animate={
          reduceMotion
            ? undefined
            : { y: [0, 24, 0], scale: [1, 1.08, 1] }
        }
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
            {siteConfig.tagline}
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            En dag mer frihet.{" "}
            <span className="bg-gradient-to-r from-accent to-cyan bg-clip-text text-transparent">
              Med AI.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300 sm:text-xl">
            Vi hjälper kunskapsintensiva svenska företag (10–200 anställda) att gå
            från 5 till 4 dagars arbetsvecka med full lön – genom AI-automatisering
            av repetitivt arbete och den evidensbaserade 100-80-100-modellen.
          </p>

          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <span className="rounded-xl border border-accent/30 bg-accent/10 px-3 py-1.5 font-medium text-accent">
              {siteConfig.model}
            </span>
            <span className="rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 font-medium text-slate-200">
              Typisk tidsplan: 6–12 månader
            </span>
          </div>

          <div className="mt-10 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
            <Button asChild size="xl">
              <a href="#guide">
                Få guiden gratis
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </a>
            </Button>
            <Button asChild size="xl" variant="secondary">
              <a
                href={siteConfig.calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <CalendarDays className="h-5 w-5" aria-hidden="true" />
                Boka 30 min intro
              </a>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.7 }}
          className="mt-14 grid max-w-3xl gap-4 sm:grid-cols-3"
        >
          {[
            { label: "Tid sparad på repetitiva uppgifter", value: "30–50%" },
            { label: "Svenska piloter som fortsatte", value: "10/11" },
            { label: "Extra frihet per vecka", value: "1 dag" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur"
            >
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-300">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
