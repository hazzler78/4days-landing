"use client";

import { BadgeCheck, ShieldCheck } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { AnimatedNumber } from "@/components/motion/counter";

const stats = [
  { value: 100, suffix: "%", label: "Lön – ingen sänkning" },
  { value: 80, suffix: "%", label: "Arbetstid – oftast 32 h" },
  { value: 100, suffix: "%", label: "Output – samma eller bättre" },
];

export function ResultsSection() {
  return (
    <section id="resultat" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <p className="text-sm font-semibold text-accent">Resultat & garanti</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-brand sm:text-4xl">
              100-80-100-modellen i praktiken
            </h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Modellen kommer från 4 Day Week Global och är ett ömsesidigt
              åtagande: full lön, kortare tid och bibehållen produktivitet. Det
              handlar inte om att pressa samma jobb på färre timmar – utan att
              ta bort spilltid med AI.
            </p>

            <ul className="mt-8 space-y-4">
              <li className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <div>
                  <p className="font-semibold text-brand">Svenska piloter 2024–2026</p>
                  <p className="mt-1 text-sm text-slate-600">
                    10 av 11 organisationer fortsatte efter testperioden. Stress
                    −19 %, livskvalitet +25 %, bibehållen eller ökad produktivitet.
                  </p>
                </div>
              </li>
              <li className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <div>
                  <p className="font-semibold text-brand">Vår garanti</p>
                  <p className="mt-1 text-sm text-slate-600">
                    Vi mäter före och efter. Ni får tydliga KPI:er för tid,
                    stress och output – så ni ser att 100 % resultat faktiskt
                    håller på 80 % tid.
                  </p>
                </div>
              </li>
            </ul>
          </Reveal>

          <Stagger className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {stats.map((stat) => (
              <StaggerItem key={stat.label}>
                <div className="rounded-3xl border border-brand/10 bg-brand p-6 text-white shadow-[var(--shadow-premium)]">
                  <p className="text-4xl font-bold tracking-tight">
                    <AnimatedNumber value={stat.value} />
                    {stat.suffix}
                  </p>
                  <p className="mt-2 text-sm text-slate-300">{stat.label}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
