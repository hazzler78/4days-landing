import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AboutSection } from "@/components/sections/about";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Om oss – teamet bakom 4days.ai",
  description:
    "Möt teamet bakom 4days.ai: affärsutveckling och hands-on AI-implementation för 4-dagarsvecka med full lön.",
  alternates: { canonical: "/om-oss" },
  openGraph: {
    title: "Om oss | 4days.ai",
    description:
      "Vi kombinerar affärsutveckling, ledarskap och AI – så att 4-dagarsveckan blir både mänsklig och mätbar.",
    url: `${siteConfig.url}/om-oss`,
  },
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <AboutSection />
      </main>
      <Footer />
    </>
  );
}
