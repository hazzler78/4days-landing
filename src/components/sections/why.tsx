"use client";

import { HeartHandshake, LineChart, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";

const values = [
  {
    icon: HeartHandshake,
    title: "Mer tid & bättre välmående",
    description:
      "En extra dag för återhämtning och fokus – lägre stress och högre engagemang när arbetet struktureras rätt.",
    tone: "text-accent bg-accent-soft",
  },
  {
    icon: LineChart,
    title: "Ökad lönsamhet med AI",
    description:
      "Typisk tidsbesparing på repetitiva uppgifter: 30–50 %. Samma eller högre output på färre timmar.",
    tone: "text-cyan bg-cyan/10",
  },
  {
    icon: Trophy,
    title: "Starkare arbetsgivarvarumärke",
    description:
      "4-dagarsvecka med full lön gör er attraktivare för talang – särskilt i konkurrens om kunskapsintensiva roller.",
    tone: "text-brand bg-slate-100",
  },
];

export function WhySection() {
  return (
    <section id="varfor" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto mb-14 max-w-2xl text-center">
          <p className="text-sm font-semibold text-accent">Varför 4days.ai</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-brand sm:text-4xl">
            Smartare, inte hårdare
          </h2>
          <p className="mt-4 text-slate-600">
            Tre tydliga vinster när AI tar det repetitiva arbetet och teamet får
            mer frihet – utan att tumma på resultat eller lön.
          </p>
        </Reveal>

        <Stagger className="grid gap-6 md:grid-cols-3">
          {values.map((item) => (
            <StaggerItem key={item.title}>
              <Card className="h-full border-slate-200/70 transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-xl">
                <CardContent className="p-8">
                  <div
                    className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${item.tone}`}
                  >
                    <item.icon className="h-7 w-7" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-semibold text-brand">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
