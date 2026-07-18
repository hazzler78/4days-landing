"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";

const steps = [
  {
    number: "01",
    title: "Kartläggning av era processer",
    time: "2–3 veckor",
    description:
      "Vi analyserar arbetsflöden, flaskhalsar och var AI gör störst nytta – tillsammans med er ledning.",
  },
  {
    number: "02",
    title: "AI-automatisering av repetitivt arbete",
    time: "Prioriterade processer",
    description:
      "Rapporter, admin, kundflöden och intern kommunikation automatiseras med beprövade verktyg.",
  },
  {
    number: "03",
    title: "Implementering & utbildning",
    time: "Teamet äger förändringen",
    description:
      "Ni får playbook, rutiner och utbildning så förändringen sitter i organisationen – inte bara i verktygen.",
  },
  {
    number: "04",
    title: "Mätning & uppföljning",
    time: "100-80-100-garanti",
    description:
      "KPI:er vecka för vecka. Målet är tydligt: full lön, 80 % arbetstid och 100 % output.",
  },
];

export function HowItWorksSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="hur-det-fungerar"
      className="scroll-mt-24 border-y border-slate-200/80 bg-white py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto mb-14 max-w-2xl text-center">
          <p className="text-sm font-semibold text-accent">Hur det fungerar</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-brand sm:text-4xl">
            Fyra steg till mätbar effekt
          </h2>
          <p className="mt-4 text-slate-600">
            Från kartläggning till 4-dagarsvecka – vanligtvis inom 6–12 månader,
            enligt 4 Day Week Global Fast Track och vår egen metodik.
          </p>
        </Reveal>

        <div className="relative">
          <div
            className="timeline-line absolute left-6 top-0 hidden h-full w-px md:left-1/2 md:block"
            aria-hidden="true"
          />

          <Stagger className="space-y-6 md:space-y-10">
            {steps.map((step, index) => {
              const isLeft = index % 2 === 0;
              return (
                <StaggerItem key={step.number}>
                  <div className="relative grid items-center gap-6 md:grid-cols-2">
                    <div
                      className={`rounded-3xl border border-slate-200 bg-slate-50/80 p-6 shadow-sm transition-all hover:border-accent/30 hover:shadow-lg md:p-8 ${
                        isLeft ? "md:mr-10" : "md:col-start-2 md:ml-10"
                      }`}
                    >
                      <div className="mb-4 flex items-center gap-3">
                        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand text-sm font-bold text-accent">
                          {step.number}
                        </span>
                        <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent-dim">
                          {step.time}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-brand">
                        {step.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                        {step.description}
                      </p>
                    </div>

                    <motion.div
                      aria-hidden="true"
                      className="absolute left-6 top-8 hidden h-4 w-4 -translate-x-1/2 rounded-full border-4 border-white bg-accent shadow md:left-1/2 md:block"
                      initial={reduceMotion ? false : { scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 260, damping: 18 }}
                    />
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
