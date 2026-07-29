"use client";

import { BadgeCheck, Quote, ShieldCheck } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { AnimatedNumber } from "@/components/motion/counter";

const stats = [
  { value: 100, suffix: "%", label: "Lön – ingen sänkning" },
  { value: 80, suffix: "%", label: "Arbetstid – oftast 32 h" },
  { value: 100, suffix: "%", label: "Output – samma eller bättre" },
];

const proofs = [
  {
    title: "10 av 11 fortsatte",
    text: "I svenska piloter 2024–2026 valde nästan alla organisationer att behålla kortare arbetsvecka efter testperioden.",
  },
  {
    title: "−19 % stress",
    text: "Mätbara förbättringar i återhämtning och välmående – samtidigt som produktiviteten hölls uppe eller ökade.",
  },
  {
    title: "15–30 % tidsvinst",
    text: "Typisk effekt när repetitiva processer automatiseras med AI – ofta ännu mer på admin-tunga flöden.",
  },
];

/** Combined evidence + 100-80-100 guarantee for the slim homepage. */
export function ProofSection() {
  return (
    <section id="bevis" className="scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto mb-16 max-w-2xl text-center">
          <p className="text-sm font-semibold text-accent">Bevis & garanti</p>
          <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
            100-80-100 — evidens, inte magkänsla
          </h2>
          <p className="mt-4 text-slate-600 leading-relaxed">
            Full lön, kortare tid och bibehållen produktivitet. Vi mäter före och
            efter så ni ser att resultatet håller.
          </p>
        </Reveal>

        <Stagger className="mb-16 grid gap-6 md:grid-cols-3">
          {proofs.map((item) => (
            <StaggerItem key={item.title}>
              <article className="h-full border-t border-accent/40 pt-6">
                <Quote className="mb-4 h-5 w-5 text-accent" aria-hidden="true" />
                <h3 className="font-display text-lg font-semibold text-brand">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {item.text}
                </p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>

        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <ul className="space-y-4">
              <li className="flex gap-3 border-b border-slate-200 pb-5">
                <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <div>
                  <p className="font-semibold text-brand">
                    Svenska piloter 2024–2026
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    10 av 11 organisationer fortsatte efter testperioden. Stress
                    −19 %, livskvalitet +25 %, bibehållen eller ökad produktivitet.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <div>
                  <p className="font-semibold text-brand">Vår garanti</p>
                  <p className="mt-1 text-sm text-slate-600">
                    Ni får tydliga KPI:er för tid, stress och output – så ni ser
                    att 100 % resultat faktiskt håller på 80 % tid.
                  </p>
                </div>
              </li>
            </ul>
          </Reveal>

          <Stagger className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {stats.map((stat) => (
              <StaggerItem key={stat.label}>
                <div className="rounded-2xl bg-brand px-6 py-5 text-white">
                  <p className="font-display text-4xl font-semibold tracking-tight">
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
