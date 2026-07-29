import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePage } from "@/components/articles/article-page";
import { getArticle, getArticleSlugs } from "@/lib/articles";
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

  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.h1,
      description: article.description,
      url: `${siteConfig.url}/${article.slug}`,
      images: ["/og-image-v6.jpg"],
      ...(article.published
        ? { publishedTime: article.published }
        : {}),
      ...(article.modified ? { modifiedTime: article.modified } : {}),
    },
  };
}

function ArticleJsonLd({
  article,
}: {
  article: NonNullable<ReturnType<typeof getArticle>>;
}) {
  const url = `${siteConfig.url}/${article.slug}`;
  const graph: Record<string, unknown>[] = [
    {
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
