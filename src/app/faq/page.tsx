import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FaqSection } from "@/components/sections/faq";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Vanliga frågor om 4-dagarsvecka och AI",
  description:
    "FAQ om 4-dagarsvecka med full lön, 100-80-100-modellen och AI-automatisering för svenska företag.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "Vanliga frågor | 4days.ai",
    description:
      "Svar på det ledningsgrupper och HR oftast undrar om 4-dagarsvecka och AI.",
    url: `${siteConfig.url}/faq`,
  },
};

export default function FaqPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <FaqSection />
      </main>
      <Footer />
    </>
  );
}
