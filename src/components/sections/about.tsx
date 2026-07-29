"use client";

import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { siteConfig } from "@/lib/site";

const founders = [
  {
    name: "Joseph Tran",
    initials: "JT",
    role: "Försäljning & affärsutveckling",
    bio: "Erfaren försäljnings- och affärsutvecklare med bakgrund som VD och chef för bolag med runt 40 anställda. Driver kunddialog, partnerskap och affärsmodellen bakom 4days.ai.",
    linkedin: siteConfig.linkedin.joseph,
    image: "/bilder/profilbild_joseph.png",
  },
  {
    name: "Mikael Söderberg",
    initials: "MS",
    role: "Teknisk grundare & AI",
    bio: "Teknisk grundare, fullstack-utvecklare och AI-specialist med fokus på Next.js, LangChain, OpenAI och n8n. Ansvarar för automation, arkitektur och teknisk leverans.",
    linkedin: siteConfig.linkedin.mikael,
    image: "/bilder/profilbild_mikael.png",
  },
];

export function AboutSection() {
  return (
    <section id="om-oss" className="scroll-mt-24 bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto mb-14 max-w-2xl text-center">
          <p className="text-sm font-semibold text-accent">Om oss</p>
          <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
            Teamet bakom 4days.ai
          </h2>
          <p className="mt-4 text-slate-600">
            Vi kombinerar affärsutveckling, ledarskap och hands-on AI-implementation
            – så att 4-dagarsveckan blir både mänsklig och mätbar.
          </p>
        </Reveal>

        <Stagger className="grid gap-6 md:grid-cols-2">
          {founders.map((person) => (
            <StaggerItem key={person.name}>
              <article className="h-full rounded-3xl border border-slate-200 bg-slate-50/70 p-6 shadow-sm transition-all hover:border-accent/30 hover:shadow-lg sm:p-8">
                <div className="flex gap-5">
                  {person.image ? (
                    <Image
                      src={person.image}
                      alt={person.name}
                      width={72}
                      height={72}
                      className="h-[72px] w-[72px] rounded-2xl object-cover"
                    />
                  ) : (
                    <div
                      className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-2xl bg-brand text-xl font-bold text-accent"
                      aria-hidden="true"
                    >
                      {person.initials}
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-semibold text-brand">
                      {person.name}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-accent-dim">
                      {person.role}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">
                      {person.bio}
                    </p>
                    <a
                      href={person.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand transition-colors hover:text-accent-dim"
                    >
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                      LinkedIn
                    </a>
                  </div>
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.15}>
          <p className="mt-10 text-center text-sm text-slate-500">
            {siteConfig.legalName} · Org.nr {siteConfig.orgNumber}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
