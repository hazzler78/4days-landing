"use client";

import Image from "next/image";
import { HeartHandshake, LineChart, Trophy } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { siteConfig } from "@/lib/site";

const values = [
  {
    icon: HeartHandshake,
    title: "Mer tid & bättre välmående",
    description:
      "En extra dag för återhämtning och fokus – lägre stress och högre engagemang när arbetet struktureras rätt.",
  },
  {
    icon: LineChart,
    title: "Ökad lönsamhet med AI",
    description:
      "Typisk tidsbesparing på repetitiva uppgifter: 30–50 %. Samma eller högre output på färre timmar.",
  },
  {
    icon: Trophy,
    title: "Starkare arbetsgivarvarumärke",
    description:
      "4-dagarsvecka med full lön gör er attraktivare för talang – särskilt i konkurrens om kunskapsintensiva roller.",
  },
];

export function WhySection() {
  return (
    <section id="varfor" className="scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto mb-16 max-w-2xl text-center">
          <Image
            src="/bilder/logo-light.png"
            alt={siteConfig.brand}
            width={96}
            height={96}
            className="mx-auto mb-6 h-20 w-20 rounded-2xl sm:h-24 sm:w-24"
          />
          <p className="text-sm font-semibold text-accent">Varför 4days.ai</p>
          <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
            Smartare, inte hårdare
          </h2>
          <p className="mt-4 text-slate-600">
            Tre tydliga vinster när AI tar det repetitiva arbetet och teamet får
            mer frihet – utan att tumma på resultat eller lön.
          </p>
        </Reveal>

        <Stagger className="grid gap-10 md:grid-cols-3 md:gap-12">
          {values.map((item) => (
            <StaggerItem key={item.title}>
              <article className="h-full">
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent-dim">
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="font-display text-xl font-semibold text-brand">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                  {item.description}
                </p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
