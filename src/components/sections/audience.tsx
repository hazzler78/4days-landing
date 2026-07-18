"use client";

import {
  Building2,
  Code2,
  Landmark,
  Palette,
  BriefcaseBusiness,
} from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";

const audiences = [
  {
    icon: Code2,
    title: "IT & techbolag",
    description:
      "Digitala team med mycket rapportering, dokumentation och intern admin – perfekt för AI-driven tidsvinst.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Konsultbolag",
    description:
      "Frigör fakturerbar tid genom att automatisera offerter, statusrapporter och uppföljning.",
  },
  {
    icon: Palette,
    title: "Kreativa byråer",
    description:
      "Mer tid till kundarbete och kreativitet när admin och produktionsflöden effektiviseras.",
  },
  {
    icon: Landmark,
    title: "Professionella tjänster",
    description:
      "Revision, juridik, redovisning och liknande – där kvalitet och leverans måste hålla även med kortare vecka.",
  },
  {
    icon: Building2,
    title: "Kunskapsintensiva SME:er",
    description:
      "Företag med 10–200 anställda som vill bli en mer attraktiv arbetsgivare utan att tappa fart.",
  },
];

export function AudienceSection() {
  return (
    <section id="for-vem" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-sm font-semibold text-accent">För vem vi arbetar</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-brand sm:text-4xl">
            Byggt för kunskapsintensiva företag
          </h2>
          <p className="mt-4 text-slate-600">
            Vi passar bäst där arbetet är digitalt, kompetenstungt och fullt av
            repetitiva moment som AI kan ta över – med eller utan mål om
            4-dagarsvecka från dag ett.
          </p>
        </Reveal>

        <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {audiences.map((item) => (
            <StaggerItem key={item.title}>
              <article className="h-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-accent/30 hover:shadow-lg">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent-dim">
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-brand">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
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
