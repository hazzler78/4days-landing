import type { Metadata } from "next";
import Link from "next/link";
import { Download } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HermesStartPanel } from "@/components/sections/hermes-start-panel";
import { Button } from "@/components/ui/button";
import {
  hermesGuideMeta,
  hermesGuideSections,
} from "@/content/hermes-guide";
import { siteConfig, getBookingUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Hermes setup – korta stegen",
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
            Setup · inte en roman · 4days.ai
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-brand sm:text-4xl">
            Du är igång – här är bara det nödvändiga
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            Default: <strong>Grok/xAI</strong>. Har ni teamkonto – logga in med
            det. ChatGPT krävs inte. AI i Hermes tar dig vidare.
          </p>

          <div className="mt-8">
            <HermesStartPanel />
          </div>

          <div className="mt-12 space-y-10">
            {hermesGuideSections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-28">
                <h2 className="text-xl font-bold text-brand">{section.title}</h2>
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

          <div className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-lg font-bold text-brand">
              PDF bara om du vill (backup)
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Huvudvägen är klick + AI. PDF:en är frivillig.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="outline">
                <a
                  href={hermesGuideMeta.pdfPath}
                  download={hermesGuideMeta.pdfFileName}
                >
                  <Download className="h-4 w-4" />
                  Ladda ner PDF
                </a>
              </Button>
            </div>
          </div>

          <div className="mt-14 rounded-2xl bg-gradient-to-br from-brand to-brand-light p-8 text-white">
            <h2 className="text-2xl font-bold">När friheten ska delas i bolaget</h2>
            <p className="mt-3 text-slate-200 leading-relaxed">
              Du har mer tid. Vill fler få samma andrum? Boka 30 min – vi tar
              audit utan att du behöver bli IT-avdelning.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href={getBookingUrl()} target="_blank">
                  Boka 30 min
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="border-white/30"
              >
                <Link href={hermesGuideMeta.landingPath}>Till start-sidan</Link>
              </Button>
            </div>
            <p className="mt-4 text-xs text-slate-300">
              {siteConfig.slogan}
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
