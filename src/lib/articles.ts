import articlesJson from "@/content/articles/articles.json";

export type ArticleFaq = {
  question: string;
  answer: string;
};

export type ArticleAuthor = {
  name: string;
  jobTitle?: string;
  /** Visible text after the name, for example a role. Schema still uses jobTitle. */
  bylineDetail?: string;
  url?: string;
  sameAs?: string[];
};

export type ArticleDefinedTerm = {
  name: string;
  alternateName?: string[];
  description: string;
  inDefinedTermSet?: string;
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
  /** When true, the document title is used as-is, without the site title template. */
  titleAbsolute?: boolean;
  ogTitle?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  author?: ArticleAuthor;
  section?: { name: string; href: string };
  breadcrumbName?: string;
  about?: string[];
  definedTerm?: ArticleDefinedTerm;
  citations?: string[];
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
