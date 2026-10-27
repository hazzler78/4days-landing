import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePage } from "@/components/articles/article-page";
import { getArticle, getArticleSlugs } from "@/lib/articles";
import {
  BOOK_AUTHOR,
  BOOK_COVER_ALT,
  BOOK_COVER_HEIGHT,
  BOOK_COVER_SRC,
  BOOK_COVER_WIDTH,
  BOOK_ISBN_PAPERBACK,
  BOOK_KINDLE_URL,
  BOOK_LANGUAGE,
  BOOK_PAGES,
  BOOK_PAPERBACK_URL,
  BOOK_PUBLISHED,
  BOOK_PUBLISHER,
  BOOK_TITLE,
} from "@/content/boken";
import { siteConfig } from "@/lib/site";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};

  const isProofPackage = article.slug === "bevispaketet";
  const isBook = article.slug === "boken";
  const bookImage = {
    url: BOOK_COVER_SRC,
    width: BOOK_COVER_WIDTH,
    height: BOOK_COVER_HEIGHT,
    alt: BOOK_COVER_ALT,
  };

  return {
    title: article.title,
    description: article.description,
    ...(isBook
      ? {
          keywords: [
            BOOK_TITLE,
            BOOK_AUTHOR,
            "4days.ai",
            "AI",
            "arbetstid",
            "produktivitet",
          ],
        }
      : isProofPackage
        ? {
            keywords: [
              "Bevispaketet",
              "4days.ai",
              "AI",
              "arbetstimmar",
              "svenska företag",
            ],
          }
        : {}),
    alternates: { canonical: `/${article.slug}` },
    openGraph: isBook
      ? {
          type: "book",
          title: article.h1,
          description: article.description,
          url: `${siteConfig.url}/${article.slug}`,
          images: [bookImage],
          authors: [BOOK_AUTHOR],
          isbn: BOOK_ISBN_PAPERBACK,
          releaseDate: BOOK_PUBLISHED,
        }
      : {
          type: "article",
          title: article.h1,
          description: article.description,
          url: `${siteConfig.url}/${article.slug}`,
          images: ["/og-image-v6.jpg"],
          ...(article.published ? { publishedTime: article.published } : {}),
          ...(article.modified ? { modifiedTime: article.modified } : {}),
        },
    ...(isBook || isProofPackage
      ? {
          twitter: {
            card: "summary_large_image" as const,
            title: article.h1,
            description: article.description,
            images: isBook ? [bookImage] : ["/og-image-v6.jpg"],
          },
        }
      : {}),
  };
}

function ArticleJsonLd({
  article,
}: {
  article: NonNullable<ReturnType<typeof getArticle>>;
}) {
  const url = `${siteConfig.url}/${article.slug}`;
  const isBook = article.slug === "boken";
  const graph: Record<string, unknown>[] = [
    isBook
      ? {
          "@type": "Book",
          "@id": `${url}#book`,
          name: BOOK_TITLE,
          description: article.description,
          inLanguage: BOOK_LANGUAGE,
          numberOfPages: BOOK_PAGES,
          isbn: BOOK_ISBN_PAPERBACK,
          datePublished: BOOK_PUBLISHED,
          image: `${siteConfig.url}${BOOK_COVER_SRC}`,
          url,
          author: {
            "@type": "Person",
            name: BOOK_AUTHOR,
          },
          publisher: {
            "@type": "Organization",
            name: BOOK_PUBLISHER,
          },
          offers: [
            {
              "@type": "Offer",
              url: BOOK_KINDLE_URL,
              name: "Kindle",
            },
            {
              "@type": "Offer",
              url: BOOK_PAPERBACK_URL,
              name: "Pocket",
            },
          ],
        }
      : {
          "@type": "Article",
          headline: article.h1,
          description: article.description,
          inLanguage: "sv-SE",
          mainEntityOfPage: url,
          url,
          image: `${siteConfig.url}/og-image-v6.jpg`,
          datePublished: article.published || undefined,
          dateModified: article.modified || article.published || undefined,
          author: {
            "@type": "Organization",
            name: siteConfig.legalName,
            url: `${siteConfig.url}/`,
          },
          publisher: {
            "@type": "Organization",
            name: siteConfig.legalName,
            logo: {
              "@type": "ImageObject",
              url: `${siteConfig.url}/bilder/logo-light.png`,
            },
          },
        },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Hem",
          item: `${siteConfig.url}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: article.h1,
          item: url,
        },
      ],
    },
  ];

  if (article.faq?.length) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: article.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    });
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": graph,
        }),
      }}
    />
  );
}

export default async function MarketingArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();
  return (
    <>
      <ArticleJsonLd article={article} />
      <ArticlePage article={article} />
    </>
  );
}
