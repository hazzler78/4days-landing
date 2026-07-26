import articlesJson from "@/content/articles/articles.json";

export type ArticleFaq = {
  question: string;
  answer: string;
};

export type Article = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  eyebrow: string;
  lead: string;
  published: string;
  modified?: string;
  body: string;
  faq?: ArticleFaq[];
  related: Array<{ href: string; title: string; description: string }>;
  isLegal: boolean;
};

export const articles = articlesJson as Article[];

export function getArticle(slug: string) {
  return articles.find((article) => article.slug === slug);
}

export function getArticleSlugs() {
  return articles.map((article) => article.slug);
}
