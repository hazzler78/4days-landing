import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";
import type { Article } from "@/lib/articles";

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

export function ArticlePage({ article }: { article: Article }) {
  const publishedLabel = formatDate(article.published);

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
                {article.eyebrow}
              </p>
            )}
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-brand sm:text-4xl">
              {article.h1}
            </h1>
            {publishedLabel && (
              <p className="mt-4 text-sm text-slate-500">
                <time dateTime={article.published}>{publishedLabel}</time>
              </p>
            )}
            {article.lead && (
              <p className="mt-5 text-lg leading-relaxed text-slate-600">
                {article.lead}
              </p>
            )}
          </header>

          <div
            className="prose-article mt-10 space-y-8 text-base leading-relaxed text-slate-600 [&_a]:font-medium [&_a]:text-accent-dim [&_a]:underline-offset-2 hover:[&_a]:underline [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-brand [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-brand [&_li]:my-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_strong]:text-brand [&_ul]:list-disc [&_ul]:pl-6"
            dangerouslySetInnerHTML={{ __html: article.body }}
          />

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
            <div className="mt-14 rounded-3xl bg-brand p-8 text-white shadow-[var(--shadow-premium)]">
              <h2 className="text-2xl font-bold">
                Vill du se hur en 4-dagarsvecka kan se ut hos er?
              </h2>
              <p className="mt-3 text-slate-300">
                Ladda ner vår kostnadsfria guide för ledningsgrupper – eller boka
                ett kort intro-call.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/#guide">Få guiden gratis</Link>
                </Button>
                <Button asChild size="lg" variant="secondary">
                  <a
                    href={siteConfig.calendlyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Boka 30 min intro
                  </a>
                </Button>
              </div>
            </div>
          )}
        </article>
      </main>
      <Footer />
    </>
  );
}
