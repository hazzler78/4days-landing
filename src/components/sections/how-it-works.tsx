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
      className="scroll-mt-24 border-y border-slate-200/80 bg-white py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto mb-16 max-w-2xl text-center">
          <p className="text-sm font-semibold text-accent">Hur det fungerar</p>
          <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
            Fyra steg till mätbar effekt
          </h2>
          <p className="mt-4 text-slate-600">
            Från kartläggning till 4-dagarsvecka – vanligtvis inom 6–12 månader.
          </p>
        </Reveal>

        <div className="relative">
          <div
            className="timeline-line absolute left-6 top-0 hidden h-full w-px md:left-1/2 md:block"
            aria-hidden="true"
          />

          <Stagger className="space-y-8 md:space-y-12">
            {steps.map((step, index) => {
              const isLeft = index % 2 === 0;
              return (
                <StaggerItem key={step.number}>
                  <div className="relative grid items-center gap-6 md:grid-cols-2">
                    <div
                      className={`p-2 md:p-4 ${
                        isLeft ? "md:mr-10" : "md:col-start-2 md:ml-10"
                      }`}
                    >
                      <div className="mb-4 flex items-center gap-3">
                        <span className="font-display inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand text-sm font-semibold text-accent">
                          {step.number}
                        </span>
                        <span className="text-xs font-semibold tracking-wide text-accent-dim uppercase">
                          {step.time}
                        </span>
                      </div>
                      <h3 className="font-display text-xl font-semibold text-brand">
                        {step.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                        {step.description}
                      </p>
                    </div>

                    <motion.div
                      aria-hidden="true"
                      className="absolute left-6 top-8 hidden h-3 w-3 -translate-x-1/2 rounded-full bg-accent md:left-1/2 md:block"
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
