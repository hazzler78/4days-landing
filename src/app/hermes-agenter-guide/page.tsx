import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import {
  hermesGuideMeta,
  hermesGuideSections,
} from "@/content/hermes-guide";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: hermesGuideMeta.title,
  description: hermesGuideMeta.description,
  robots: { index: false, follow: true },
  alternates: { canonical: hermesGuideMeta.deliveryPath },
};

export default function HermesGuideDeliveryPage() {
  return (
    <>
      <Header />
      <main className="bg-white">
        <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold text-accent">
            Gratis mini-guide · 4days.ai
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-brand sm:text-4xl">
            {hermesGuideMeta.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            Praktisk startguide för svenska SMEs som vill använda Hermes Agents
            för att frigöra tid – och komma närmare en 4-dagarsvecka med full
            lön.
          </p>

          <div className="mt-10 space-y-10">
            {hermesGuideSections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-28">
                <h2 className="text-2xl font-bold text-brand">
                  {section.title}
                </h2>
                <div className="mt-4 space-y-3 text-slate-600 leading-relaxed">
                  {section.paragraphs.map((p) => (
                    <p key={p.slice(0, 48)}>{p}</p>
                  ))}
                </div>
                {section.bullets && (
                  <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-600 leading-relaxed">
                    {section.bullets.map((b) => (
                      <li key={b.slice(0, 48)}>{b}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          <div className="mt-14 rounded-2xl bg-gradient-to-br from-brand to-brand-light p-8 text-white">
            <h2 className="text-2xl font-bold">Vill ni ha hjälp att bygga?</h2>
            <p className="mt-3 text-slate-200 leading-relaxed">
              Vi hjälper svenska bolag att gå från idé till säkra agenter i
              produktion – med fokus på tidsvinst och 100-80-100.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href={siteConfig.calendlyUrl} target="_blank">
                  Boka 30 min strategi-call
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="border-white/30"
              >
                <Link href={hermesGuideMeta.landingPath}>
                  Tipsa en kollega om guiden
                </Link>
              </Button>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
