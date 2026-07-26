import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { siteConfig, getBookingUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Guider: AI-schemaläggning, 4-dagarsvecka & AI-automatisering",
  description:
    "Guider på svenska: AI-schemaläggning och automatisk schemaläggning, bemanningsplanering med AI, 4-dagarsvecka med full lön och AI-automatisering för företag.",
  alternates: { canonical: "/guider" },
  openGraph: {
    title: "Guider: AI-schemaläggning, 4-dagarsvecka & AI-automatisering",
    description:
      "Samlad kunskapsbank: AI-schemaläggning, bemanningsplanering, 4-dagarsvecka och AI-automatisering.",
    url: `${siteConfig.url}/guider`,
  },
};

const weekGuides = [
  {
    href: "/4-dagarsvecka-sverige",
    tag: "Grunderna",
    title: "4-dagarsvecka i Sverige",
    description:
      "Vad en 4-dagarsvecka är, vad svenska piloter och forskning visar – och hur AI gör den möjlig.",
  },
  {
    href: "/100-80-100-modellen",
    tag: "Metoden",
    title: "100-80-100-modellen",
    description:
      "100 % lön, 80 % tid, 100 % output – modellen bakom en hållbar 4-dagarsvecka, förklarad på djupet.",
  },
  {
    href: "/4-dagarsvecka-lonsamhet",
    tag: "Ekonomi",
    title: "4-dagarsvecka och lönsamhet",
    description:
      "Så räknar du på kostnad, tidsbesparing och ROI – med exempel för ledningsgruppen.",
  },
  {
    href: "/kortare-arbetsvecka-myter",
    tag: "Invändningar",
    title: "Kortare arbetsvecka: 7 vanliga myter",
    description:
      "Sju vanliga invändningar mot 4-dagarsvecka – och vad forskning och piloter faktiskt visar.",
  },
  {
    href: "/4-dagarsvecka-it-konsultbolag",
    tag: "Bransch",
    title: "4-dagarsvecka för IT- och konsultbolag",
    description:
      "Varför branschen passar särskilt bra – och hur AI frigör debiterbar tid.",
  },
];

const aiGuides = [
  {
    href: "/ai-automatisering-foretag",
    tag: "Grunderna",
    title: "AI-automatisering för företag",
    description:
      "Vad som kan automatiseras, hur arbetet går till i praktiken och vad det kostar.",
  },
  {
    href: "/ai-verktyg-spara-tid",
    tag: "Verktyg",
    title: "AI-verktyg som sparar tid på kontoret",
    description:
      "Verktygen som kapar mest tid – mejl, rapporter, möten, dataanalys, kundsupport och admin.",
  },
  {
    href: "/bemanningsplanering-ai",
    tag: "Schemaläggning",
    title: "AI-schemaläggning och automatisk schemaläggning",
    description:
      "Så fungerar schemaläggning med AI i praktiken – bemanningsplanering, branschexempel (vård, skola, handel) och checklista.",
  },
  {
    href: "/ai-guide-ledningsgrupper",
    tag: "Ledning",
    title: "AI-guide för ledningsgrupper",
    description:
      "Hur ledningen bör tänka kring AI-införande, steg för steg – och vanliga misstag att undvika.",
  },
];

function GuideCard({
  href,
  tag,
  title,
  description,
}: {
  href: string;
  tag: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-accent/40 hover:shadow-md"
    >
      <span className="text-xs font-semibold uppercase tracking-wide text-accent">
        {tag}
      </span>
      <span className="mt-2 block text-lg font-semibold leading-snug text-brand">
        {title}
      </span>
      <span className="mt-2 block text-sm leading-relaxed text-slate-600">
        {description}
      </span>
    </Link>
  );
}

export default function GuiderPage() {
  return (
    <>
      <Header />
      <main className="bg-slate-50 pt-24 pb-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-6 text-sm text-slate-500" aria-label="Brödsmulor">
            <Link href="/" className="hover:text-accent-dim">
              Hem
            </Link>{" "}
            <span aria-hidden="true">/</span>{" "}
            <span className="text-slate-700">Guider</span>
          </nav>

          <header className="max-w-3xl">
            <p className="mb-2 text-sm font-semibold text-accent">Kunskapsbank</p>
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-brand sm:text-4xl">
              Guider om AI-schemaläggning, 4-dagarsvecka och AI-automatisering
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              Praktiska guider på svenska – från{" "}
              <strong className="font-semibold text-brand">
                automatisk schemaläggning med AI
              </strong>{" "}
              och bemanningsplanering till 4-dagarsvecka med full lön. Baserat på
              forskning, svenska piloter och vårt arbete med kunder.
            </p>
          </header>

          <section
            className="mt-10 rounded-3xl border border-accent/30 bg-white p-6 shadow-sm sm:p-8"
            aria-labelledby="guider-featured"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-accent">
              Mest efterfrågad
            </p>
            <h2
              id="guider-featured"
              className="mt-2 text-2xl font-bold text-brand"
            >
              AI-schemaläggning och automatisk schemaläggning
            </h2>
            <p className="mt-3 max-w-2xl text-slate-600 leading-relaxed">
              Komplett guide till hur AI lägger schema, hur bemanningsplanering
              fungerar i vård, skola och handel – plus checklista och svar på
              vanliga frågor.
            </p>
            <div className="mt-6">
              <Button asChild size="lg">
                <Link href="/bemanningsplanering-ai">
                  Läs guiden om AI-schemaläggning
                </Link>
              </Button>
            </div>
          </section>

          <section className="mt-12" aria-labelledby="guider-4dagars">
            <h2
              id="guider-4dagars"
              className="mb-6 text-2xl font-bold text-brand"
            >
              4-dagarsvecka
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {weekGuides.map((guide) => (
                <GuideCard key={guide.href} {...guide} />
              ))}
            </div>
          </section>

          <section className="mt-14" aria-labelledby="guider-ai">
            <h2 id="guider-ai" className="mb-6 text-2xl font-bold text-brand">
              AI &amp; automatisering
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {aiGuides.map((guide) => (
                <GuideCard key={guide.href} {...guide} />
              ))}
            </div>
          </section>

          <section className="mt-14" aria-labelledby="guider-leadmagnets">
            <h2
              id="guider-leadmagnets"
              className="mb-6 text-2xl font-bold text-brand"
            >
              Gratis guider via e-post
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <GuideCard
                href="/gratis-guide-hermes-agenter"
                tag="Ny · AI-agenter"
                title="Starta Hermes på några klick"
                description="Klicka Starta här, installera Hermes Desktop, koppla Grok/xAI och kör din första agent samma dag."
              />
              <GuideCard
                href="/#guide"
                tag="4-dagarsvecka"
                title="Guide + webinar för ledningsgrupper"
                description="Praktisk guide för ledningsgrupper som vill gå från 5 till 4 dagar med AI – plus webinar-inbjudan."
              />
            </div>
          </section>

          <div className="mt-16 rounded-3xl bg-brand p-8 text-white shadow-[var(--shadow-premium)]">
            <h2 className="text-2xl font-bold">
              Vill ni veta var AI gör störst nytta hos just er?
            </h2>
            <p className="mt-3 text-slate-300">
              Boka ett kostnadsfritt strategisamtal – vi går igenom era processer
              och var timmarna finns att hämta.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/gratis-guide-hermes-agenter">
                  Starta Hermes gratis
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <a
                  href={getBookingUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Boka 30 min strategi-call
                </a>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
