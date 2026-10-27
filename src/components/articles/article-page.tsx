import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { HermesGuideForm } from "@/components/sections/hermes-guide-form";
import {
  BOOK_AMAZON_REL,
  BOOK_COVER_ALT,
  BOOK_COVER_HEIGHT,
  BOOK_COVER_SRC,
  BOOK_COVER_WIDTH,
  BOOK_KINDLE_URL,
  BOOK_PAPERBACK_URL,
} from "@/content/boken";
import { getBookingUrl, siteConfig } from "@/lib/site";
import type { Article } from "@/lib/articles";

function BookBuyLinks({ tone }: { tone: "light" | "dark" }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button asChild size="lg">
        <a href={BOOK_KINDLE_URL} target="_blank" rel={BOOK_AMAZON_REL}>
          Köp boken på Amazon
        </a>
      </Button>
      <Button
        asChild
        size="lg"
        variant={tone === "dark" ? "secondary" : "outline"}
      >
        <a href={BOOK_PAPERBACK_URL} target="_blank" rel={BOOK_AMAZON_REL}>
          Köp pocket på Amazon
        </a>
      </Button>
    </div>
  );
}

function formatDate(value?: string) {
  if (!value) return null;
  try {
    return new Intl.DateTimeFormat("sv-SE", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function isAgentLeadArticle(slug: string) {
  return slug === "vad-ar-en-ai-agent";
}

function isProofPackageArticle(slug: string) {
  return slug === "bevispaketet";
}

function isBookArticle(slug: string) {
  return slug === "boken";
}

export function ArticlePage({ article }: { article: Article }) {
  const publishedLabel = formatDate(article.published);
  const modifiedLabel = formatDate(article.modified);
  const agentLead = isAgentLeadArticle(article.slug);
  const proofPackage = isProofPackageArticle(article.slug);
  const bookPage = isBookArticle(article.slug);

  return (
    <>
      <Header />
      <main className="bg-slate-50 pt-24 pb-16">
        <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-6 text-sm text-slate-500" aria-label="Brödsmulor">
            <Link href="/" className="hover:text-accent-dim">
              Hem
            </Link>{" "}
            <span aria-hidden="true">/</span>{" "}
            <span className="text-slate-700">{article.h1}</span>
          </nav>

          <header>
            {article.eyebrow && (
              <p className="mb-2 text-sm font-semibold text-accent">
                {article.eyebrow.replace(/&amp;/g, "&")}
              </p>
            )}
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-brand sm:text-4xl">
              {article.h1}
            </h1>
            {(publishedLabel || modifiedLabel) && (
              <p className="mt-4 flex flex-wrap items-center gap-x-2 text-sm text-slate-500">
                {publishedLabel && (
                  <time dateTime={article.published}>
                    Publicerad {publishedLabel}
                  </time>
                )}
                {publishedLabel && modifiedLabel && (
                  <span aria-hidden="true">·</span>
                )}
                {modifiedLabel && (
                  <time dateTime={article.modified}>
                    Uppdaterad {modifiedLabel}
                  </time>
                )}
              </p>
            )}
            {article.lead && (
              <p className="mt-5 text-lg leading-relaxed text-slate-600">
                {article.lead}
              </p>
            )}
            {bookPage && (
              <div className="mt-8 grid gap-6 sm:grid-cols-[220px_1fr] sm:items-start">
                <Image
                  src={BOOK_COVER_SRC}
                  alt={BOOK_COVER_ALT}
                  width={BOOK_COVER_WIDTH}
                  height={BOOK_COVER_HEIGHT}
                  priority
                  className="mx-auto h-auto w-full max-w-[280px] rounded-2xl border border-slate-200 shadow-sm sm:mx-0"
                />
                <div>
                  <dl className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <dt className="text-xs font-semibold uppercase tracking-wide text-accent">
                        Författare
                      </dt>
                      <dd className="mt-1 text-sm font-semibold leading-snug text-brand">
                        Joseph Tran
                        <span className="mt-1 block text-xs font-medium text-slate-500">
                          Förlag: 4 Days AI AB
                        </span>
                      </dd>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <dt className="text-xs font-semibold uppercase tracking-wide text-accent">
                        Omfång
                      </dt>
                      <dd className="mt-1 text-sm font-semibold leading-snug text-brand">
                        129 sidor, svenska
                      </dd>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:col-span-2">
                      <dt className="text-xs font-semibold uppercase tracking-wide text-accent">
                        Format
                      </dt>
                      <dd className="mt-1 text-sm font-semibold leading-snug text-brand">
                        Kindle och pocket
                        <span className="mt-1 block text-xs font-medium text-slate-500">
                          ISBN-13 pocket 9798165121296. Pris och format visas på
                          Amazon.
                        </span>
                      </dd>
                    </div>
                  </dl>
                  <div className="mt-4">
                    <BookBuyLinks tone="light" />
                  </div>
                </div>
              </div>
            )}
            {proofPackage && (
              <dl className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-accent">
                    Mätning
                  </dt>
                  <dd className="mt-1 text-sm font-semibold leading-snug text-brand">
                    Fem veckor, era egna siffror
                  </dd>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-accent">
                    Garanti
                  </dt>
                  <dd className="mt-1 text-sm font-semibold leading-snug text-brand">
                    Minst fyra sparade timmar per person och vecka
                  </dd>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-accent">
                    Pris
                  </dt>
                  <dd className="mt-1 text-sm font-semibold leading-snug text-brand">
                    45 000–85 000 kr exkl. moms
                    <span className="mt-1 block text-xs font-medium text-slate-500">
                      Grundarpris 45 000 kr för de tre första som bokar senast
                      31 oktober 2026
                    </span>
                  </dd>
                </div>
              </dl>
            )}
          </header>

          <div
            className="prose-article mt-10 space-y-8 text-base leading-relaxed text-slate-600 [&_a]:font-medium [&_a]:text-accent-dim [&_a]:underline-offset-2 hover:[&_a]:underline [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-brand [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-brand [&_li]:my-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_strong]:text-brand [&_ul]:list-disc [&_ul]:pl-6"
            dangerouslySetInnerHTML={{ __html: article.body }}
          />

          {agentLead && (
            <section
              id="agent-tips"
              className="mt-14 scroll-mt-24"
              aria-labelledby="agent-tips-heading"
            >
              <div className="mb-6">
                <p className="text-sm font-semibold uppercase tracking-wide text-accent">
                  Nästa steg
                </p>
                <h2
                  id="agent-tips-heading"
                  className="mt-2 text-2xl font-bold text-brand"
                >
                  Få agent-tips + Hermes one-click
                </h2>
                <p className="mt-3 text-slate-600 leading-relaxed">
                  Lämna mejl så skickar vi korta tips om AI-agenter för svenska
                  bolag – och hur du startar din första agent samma dag.
                </p>
              </div>
              <HermesGuideForm
                source="vad-ar-en-ai-agent"
                tags="vad-ar-en-ai-agent,hermes-start,ai-agenter,article-lead"
                idPrefix="agent-article"
                analyticsPlacement="article"
                submitLabel="Skicka tips till mig"
                successCtaHref="/gratis-guide-hermes-agenter#starta"
                successCtaLabel="Starta Hermes nu"
                successNote="Bekräfta e-posten (dubbel opt-in). Sen skickar vi tips — du kan också starta Hermes direkt."
              />
            </section>
          )}

          {article.related.length > 0 && (
            <aside className="mt-14" aria-label="Relaterade guider">
              <h2 className="mb-4 text-xl font-bold text-brand">
                Relaterade guider
              </h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {article.related.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-accent/40 hover:shadow-md"
                  >
                    <span className="block font-semibold text-brand">
                      {item.title}
                    </span>
                    <span className="mt-1 block text-sm text-slate-500">
                      {item.description}
                    </span>
                  </Link>
                ))}
              </div>
            </aside>
          )}

          {!article.isLegal && (
            <div
              id={bookPage ? "kop" : proofPackage ? "kontakt" : undefined}
              className="mt-14 scroll-mt-24 rounded-3xl bg-brand p-8 text-white shadow-[var(--shadow-premium)]"
            >
              <h2 className="text-2xl font-bold">
                {bookPage
                  ? "Köp boken"
                  : agentLead
                    ? "Redo att testa en riktig AI-agent?"
                    : proofPackage
                      ? "Vill du veta vad AI ger er?"
                      : article.slug === "bemanningsplanering-ai"
                        ? "Vill ni effektivisera er bemanningsplanering?"
                        : "Vill du se hur en 4-dagarsvecka kan se ut hos er?"}
              </h2>
              <p className="mt-3 text-slate-300">
                {bookPage ? (
                  "Pris och format visas på Amazon."
                ) : agentLead ? (
                  "Starta Hermes one-click – eller boka 30 min så tittar vi på var en agent sparar mest tid hos er."
                ) : proofPackage ? (
                  <>
                    Hör av dig via 4days.ai. Boka 30 minuter, eller mejla{" "}
                    <a
                      href={`mailto:${siteConfig.email}?subject=Bevispaketet%20via%204days.ai`}
                      className="font-medium text-white underline-offset-2 hover:underline"
                    >
                      {siteConfig.email}
                    </a>
                    .
                  </>
                ) : article.slug === "bemanningsplanering-ai" ? (
                  "Berätta om era scheman och volymer – vi visar var AI-schemaläggning gör störst nytta hos just er."
                ) : (
                  "Ladda ner vår kostnadsfria guide för ledningsgrupper – eller boka ett kort intro-call."
                )}
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                {bookPage ? (
                  <BookBuyLinks tone="dark" />
                ) : agentLead ? (
                  <>
                    <Button asChild size="lg">
                      <a href="#agent-tips">Få tips i mejlen</a>
                    </Button>
                    <Button asChild size="lg" variant="secondary">
                      <Link href="/gratis-guide-hermes-agenter#starta">
                        Starta Hermes
                      </Link>
                    </Button>
                  </>
                ) : proofPackage ? (
                  <>
                    <Button asChild size="lg">
                      <a
                        href={getBookingUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Boka 30 min intro
                      </a>
                    </Button>
                    <Button asChild size="lg" variant="secondary">
                      <a
                        href={`mailto:${siteConfig.email}?subject=Bevispaketet%20via%204days.ai`}
                      >
                        Mejla {siteConfig.email}
                      </a>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild size="lg">
                      <Link href="/#guide">Få guiden gratis</Link>
                    </Button>
                    <Button asChild size="lg" variant="secondary">
                      <a
                        href={getBookingUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Boka 30 min intro
                      </a>
                    </Button>
                  </>
                )}
              </div>
              {agentLead && (
                <p className="mt-4 text-sm text-slate-400">
                  Vill ni hellre prata?{" "}
                  <a
                    href={getBookingUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-white underline-offset-2 hover:underline"
                  >
                    Boka 30 min intro
                  </a>
                </p>
              )}
            </div>
          )}
        </article>
      </main>
      <Footer
        omitHrefs={
          proofPackage || bookPage ? ["/100-80-100-modellen"] : undefined
        }
      />
    </>
  );
}
