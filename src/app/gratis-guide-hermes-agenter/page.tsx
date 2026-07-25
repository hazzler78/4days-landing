import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HermesStartPanel } from "@/components/sections/hermes-start-panel";
import { HermesGuideForm } from "@/components/sections/hermes-guide-form";
import { Button } from "@/components/ui/button";
import { hermesGuideMeta } from "@/content/hermes-guide";
import { siteConfig, getBookingUrl } from "@/lib/site";

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

const bullets = [
  "Ett klick → Hermes Desktop (Mac/Windows)",
  "Default: Grok/xAI (free funkar att börja)",
  "Har ni teamkonto? Logga in med det",
  "AI leder setup – ingen 40-sidors kurs",
  "Första agent samma dag → mer tid, mer frihet",
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
      "@type": "SoftwareApplication",
      name: "Hermes Agent",
      applicationCategory: "BusinessApplication",
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
          <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
            <div>
              <p className="text-sm font-semibold text-accent">
                Gratis start · 4days.ai × Hermes
              </p>
              <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                {hermesGuideMeta.title}
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-200">
                Slipp läskursen. Klicka{" "}
                <span className="font-semibold text-white">Starta här</span>,
                installera det du behöver, koppla <strong>Grok/xAI</strong> (eller
                teamkonto) och låt AI:n guida dig in i första agenten.
              </p>
              <ul className="mt-8 space-y-3 text-sm text-slate-100">
                {bullets.map((item) => (
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
                Redan igång?{" "}
                <Link
                  href={hermesGuideMeta.deliveryPath}
                  className="font-medium text-accent underline-offset-2 hover:underline"
                >
                  Kort setup-checklista
                </Link>
                {" · "}
                <Link
                  href={getBookingUrl()}
                  target="_blank"
                  className="font-medium text-accent underline-offset-2 hover:underline"
                >
                  Boka 30 min
                </Link>
              </p>
            </div>

            <div id="starta" className="scroll-mt-28">
              <HermesStartPanel />
            </div>
          </div>
        </section>

        <section className="border-b border-slate-100 bg-slate-50">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <h2 className="text-2xl font-bold text-brand">
                Efter klicket – vad händer?
              </h2>
              <ol className="mt-5 space-y-4 text-slate-600 leading-relaxed">
                <li>
                  <strong className="text-brand">Install:</strong> Desktop-appen
                  sätter grunden. Mac kan be om systemverktyg en gång – godkänn.
                </li>
                <li>
                  <strong className="text-brand">Login:</strong> Grok/xAI som
                  default. Teamkonto? Använd det. ChatGPT behövs inte nu.
                </li>
                <li>
                  <strong className="text-brand">Första agenten:</strong> En
                  tidstjuv. En win. Sen bestämmer du om du delar friheten vidare.
                </li>
              </ol>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <a href="#starta">Till Starta här</a>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href={hermesGuideMeta.deliveryPath}>
                    Öppna korta guiden
                  </Link>
                </Button>
              </div>
            </div>

            <div id="tips" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-brand">
                Vill du ha tips i mejlen?
              </h2>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Valfritt. Lämna e-post så skickar vi korta nuds (install-stöd,
                första agent, när audit är värt det) – inte en roman.
              </p>
              <div className="mt-5">
                <HermesGuideForm />
              </div>
              <p className="mt-4 text-xs text-slate-500">
                PDF finns kvar som backup för den som vill skriva ut – men
                huvudvägen är klick + AI i appen.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
