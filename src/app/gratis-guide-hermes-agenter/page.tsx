import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HermesGuideForm } from "@/components/sections/hermes-guide-form";
import { Button } from "@/components/ui/button";
import { hermesGuideMeta } from "@/content/hermes-guide";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: hermesGuideMeta.shortTitle,
  description: hermesGuideMeta.description,
  alternates: { canonical: hermesGuideMeta.landingPath },
  openGraph: {
    title: hermesGuideMeta.title,
    description: hermesGuideMeta.description,
    url: `${siteConfig.url}${hermesGuideMeta.landingPath}`,
  },
};

const benefits = [
  "Vad Hermes Agents är – utan tech-jargong",
  "5 hög-ROI-fall för svenska SMEs (mejl, CRM, admin, rapportering)",
  "7-dagars mini-plan för er första agent-pilot",
  "GDPR-checklistor innan ni kopplar Fortnox/Visma/CRM",
  "När ni bör bygga själva vs ta hjälp (hybridmodellen)",
];

export default function HermesGuideLandingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: hermesGuideMeta.title,
    description: hermesGuideMeta.description,
    url: `${siteConfig.url}${hermesGuideMeta.landingPath}`,
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.brand,
      url: siteConfig.url,
    },
    about: {
      "@type": "Thing",
      name: "Hermes Agents",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="bg-white">
        <section className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-b from-brand-dark via-brand to-brand-light text-white">
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-accent/20 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-28">
            <div>
              <p className="text-sm font-semibold text-accent">
                Ny gratis lead-magnet · Mini-guide
              </p>
              <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                {hermesGuideMeta.title}
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-200">
                Lär er hur AI-agenter kan ta repetitivt arbete – så ni frigör tid
                och kommer närmare en 4-dagarsvecka med full lön. Praktiskt,
                svenskt och utan fluff.
              </p>
              <ul className="mt-8 space-y-3 text-sm text-slate-100">
                {benefits.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-sm text-slate-300">
                Redan läst klart?{" "}
                <Link
                  href="/#guide"
                  className="font-medium text-accent underline-offset-2 hover:underline"
                >
                  Få även vår 4-dagarsvecka-guide
                </Link>
                .
              </p>
            </div>

            <div id="formular" className="scroll-mt-28">
              <p className="mb-3 text-center text-sm font-medium text-slate-200 lg:text-left">
                Fyll i formuläret – guiden skickas efter e-postbekräftelse.
              </p>
              <HermesGuideForm />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-brand">
            Varför e-post – och varför gratis ändå lönar sig
          </h2>
          <div className="mt-5 space-y-4 text-slate-600 leading-relaxed">
            <p>
              De flesta företag vill inte själva bygga och driftsätta komplexa,
              GDPR-anpassade Hermes Agents med integrationer. Den här guiden ger
              er koll på möjligheterna – och blir startpunkten för dem som vill
              gå vidare med blueprints, implementation eller teamutbildning.
            </p>
            <p>
              Det är samma hybridmodell som i vår idébank: gratis kunskap →
              kvalificerade leads → betalda uppdrag. Community och mer kursmaterial
              kommer i nästa steg.
            </p>
          </div>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <a href="#formular">Hämta guiden gratis</a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href={siteConfig.calendlyUrl} target="_blank">
                Boka 30 min strategi-call
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
