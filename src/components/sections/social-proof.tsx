"use client";

import { Quote } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";

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

export function SocialProofSection() {
  return (
    <section className="border-y border-slate-200/80 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto mb-10 max-w-2xl text-center">
          <p className="text-sm font-semibold text-accent">Bevis & riktning</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-brand sm:text-3xl">
            Byggt på bevis – inte magkänsla
          </h2>
        </Reveal>

        <Stagger className="grid gap-5 md:grid-cols-3">
          {proofs.map((item) => (
            <StaggerItem key={item.title}>
              <article className="h-full rounded-3xl border border-slate-200 bg-slate-50/80 p-6">
                <Quote className="mb-4 h-5 w-5 text-accent" aria-hidden="true" />
                <h3 className="text-lg font-semibold text-brand">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {item.text}
                </p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
