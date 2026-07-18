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
      title: article.h1,
      description: article.description,
      url: `${siteConfig.url}/${article.slug}`,
      images: ["/og-image.jpg"],
    },
  };
}

export default async function MarketingArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();
  return <ArticlePage article={article} />;
}
