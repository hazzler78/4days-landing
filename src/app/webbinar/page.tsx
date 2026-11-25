import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HermesGuideForm } from "@/components/sections/hermes-guide-form";
import { WebinarActions } from "@/components/sections/webinar-actions";
import { PageAiActions } from "@/components/page-ai-actions";
import { siteConfig, getBookingUrl } from "@/lib/site";
import {
  formatSessionWhen,
  getNextSession,
  googleCalendarUrl,
  invalidWebinarSessions,
  joinPhase,
  webinarCalendarDescription,
  webinarEventTitle,
  webinarIcsPath,
  webinarPath,
  webinarZoomUrl,
} from "@/content/webinar";

const title = "Webbinar: Kom igång med SI-agenter";
const description =
  "Två gånger i månaden visar vi hur du får agenter att jobba för dig, steg för steg med Grok Bot. Gratis och live via Zoom.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: webinarPath },
  openGraph: {
    title: `${title} | 4days.ai`,
    description,
    url: `${siteConfig.url}${webinarPath}`,
  },
};

export const revalidate = 60;

const steps = [
  "Vi ses live i Zoom, två gånger i månaden.",
  "Vi visar stegen i Grok Bot, så att agenter kan jobba för dig.",
  "Det är gratis.",
];

export default function WebinarPage() {
  const invalid = invalidWebinarSessions();
  if (invalid.length > 0) {
    console.error("Ogiltiga webbinartider i src/content/webinar.ts", invalid);
  }

  const next = getNextSession();
  const phase = joinPhase(next);
  const pageUrl = `${siteConfig.url}${webinarPath}`;

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: "Kom igång med SI-agenter",
        description,
        url: pageUrl,
        inLanguage: "sv-SE",
        isPartOf: {
          "@type": "WebSite",
          name: "4days.ai",
          url: siteConfig.url,
        },
      },
      ...(next
        ? [
            {
              "@type": "Event",
              name: webinarEventTitle,
              description: webinarCalendarDescription(),
              startDate: next.start,
              endDate: next.end,
              eventAttendanceMode:
                "https://schema.org/OnlineEventAttendanceMode",
              eventStatus: "https://schema.org/EventScheduled",
              inLanguage: "sv-SE",
              isAccessibleForFree: true,
              location: {
                "@type": "VirtualLocation",
                url: webinarZoomUrl,
              },
              organizer: {
                "@type": "Organization",
                name: "4days.ai",
                url: siteConfig.url,
              },
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "SEK",
                availability: "https://schema.org/InStock",
                url: pageUrl,
              },
            },
          ]
        : []),
    ],
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
          <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <p className="text-sm font-semibold text-accent">Webbinar</p>
            <h1 className="font-display mt-3 max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Kom igång med SI-agenter
            </h1>
            <PageAiActions mdPath="/webbinar.md" tone="dark" className="mt-4" />
            <p className="mt-5 max-w-2xl text-sm font-medium text-slate-300">
              SI betyder superintelligens.
            </p>
            <p className="mt-3 max-w-2xl text-lg leading-relaxed text-slate-200">
              Två gånger i månaden visar vi hur du får agenter att jobba för
              dig, steg för steg med Grok Bot. Gratis och live via Zoom.
            </p>
            <p className="mt-4 text-sm text-slate-300">
              4days.ai · {siteConfig.slogan}
            </p>

            <div className="mt-10 max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
              <p className="text-lg font-medium text-white">
                {next
                  ? `Nästa tillfälle: ${formatSessionWhen(next)}`
                  : "Datum för nästa tillfälle kommer snart"}
              </p>
              {next ? (
                <p className="mt-1 text-sm text-slate-300">
                  Svensk tid (Europe/Stockholm).
                </p>
              ) : null}
              <WebinarActions
                zoomUrl={webinarZoomUrl}
                session={next}
                initialPhase={phase}
                icsPath={next ? webinarIcsPath : null}
                googleCalendarUrl={next ? googleCalendarUrl(next) : null}
              />
            </div>
          </div>
        </section>

        <section
          id="paminnelse"
          className="scroll-mt-28 border-b border-slate-100 bg-slate-50"
        >
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-brand sm:text-3xl">
                Få en påminnelse
              </h2>
              <p className="mt-4 text-slate-600 leading-relaxed">
                Lämna dina uppgifter så hör vi av oss inför nästa tillfälle.
                Du bekräftar anmälan i mejlen.
              </p>
              <h3 className="mt-10 text-lg font-semibold text-brand">
                Så går det till
              </h3>
              <ul className="mt-4 space-y-3 text-slate-600">
                {steps.map((step) => (
                  <li key={step} className="flex gap-3">
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                      aria-hidden="true"
                    />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-sm text-slate-600">
                Vill du prata om ert eget upplägg?{" "}
                <Link
                  href={getBookingUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-accent-dim underline-offset-2 hover:underline"
                >
                  Boka 30 min
                </Link>
                .
              </p>
            </div>

            <HermesGuideForm
              source="webbinar"
              tags="webbinar"
              idPrefix="webbinar"
              employees=""
              submitLabel="Påminn mig"
              consentLead="Jag vill få en påminnelse inför webbinaret från 4days.ai."
              successNote="Bekräfta e-posten (dubbel opt-in). Sen hör vi av oss inför nästa tillfälle."
              successCtaHref={webinarZoomUrl}
              successCtaLabel="Gå med i webbinaret"
              successCtaExternal
              analyticsPlacement="webbinar"
              signupEvent="webinar"
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
