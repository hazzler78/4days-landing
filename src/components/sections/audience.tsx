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
    <section
      id="for-vem"
      className="scroll-mt-24 border-y border-slate-200/80 bg-white py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto mb-16 max-w-2xl text-center">
          <p className="text-sm font-semibold text-accent">För vem</p>
          <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
            Byggt för kunskapsintensiva företag
          </h2>
          <p className="mt-4 text-slate-600">
            Vi passar bäst där arbetet är digitalt, kompetenstungt och fullt av
            repetitiva moment som AI kan ta över.
          </p>
        </Reveal>

        <Stagger className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {audiences.map((item) => (
            <StaggerItem key={item.title}>
              <article className="h-full">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center text-accent-dim">
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="font-display text-lg font-semibold text-brand">
                  {item.title}
                </h3>
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
