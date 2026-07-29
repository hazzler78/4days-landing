import { siteConfig } from "@/lib/site";
import { faqItems } from "@/lib/faq-data";

/** Organization + WebSite — use on the homepage. */
export function JsonLd() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteConfig.url}/#organization`,
        name: siteConfig.legalName,
        url: `${siteConfig.url}/`,
        logo: `${siteConfig.url}/bilder/logo-light.png`,
        email: siteConfig.email,
        taxID: siteConfig.orgNumber,
        slogan: siteConfig.slogan,
        description:
          "Hjälper kunskapsintensiva svenska företag införa 4-dagarsvecka med AI-automatisering.",
        address: {
          "@type": "PostalAddress",
          streetAddress: siteConfig.address.street,
          postalCode: siteConfig.address.postalCode,
          addressLocality: siteConfig.address.city,
          addressCountry: siteConfig.address.country,
        },
        sameAs: [siteConfig.linkedin.company],
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: `${siteConfig.url}/`,
        name: siteConfig.legalName,
        inLanguage: "sv-SE",
        publisher: { "@id": `${siteConfig.url}/#organization` },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}

/** FAQPage schema — only on /faq where the questions are visible. */
export function FaqJsonLd() {
  const graph = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${siteConfig.url}/faq#faq`,
    url: `${siteConfig.url}/faq`,
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}

/** About page schema for /om-oss. */
export function AboutJsonLd() {
  const graph = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${siteConfig.url}/om-oss#about`,
    url: `${siteConfig.url}/om-oss`,
    name: "Om oss – teamet bakom 4days.ai",
    isPartOf: { "@id": `${siteConfig.url}/#website` },
    about: { "@id": `${siteConfig.url}/#organization` },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
