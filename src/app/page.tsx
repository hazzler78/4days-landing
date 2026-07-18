import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/sections/hero";
import { WhySection } from "@/components/sections/why";
import { HowItWorksSection } from "@/components/sections/how-it-works";
import { ResultsSection } from "@/components/sections/results";
import { CalculatorSection } from "@/components/sections/calculator";
import { AudienceSection } from "@/components/sections/audience";
import { AboutSection } from "@/components/sections/about";
import { FaqSection } from "@/components/sections/faq";
import { CtaFormSection } from "@/components/sections/cta-form";
import { JsonLd } from "@/components/seo/json-ld";

export default function HomePage() {
  return (
    <>
      <JsonLd />
      <Header />
      <main>
        <HeroSection />
        <WhySection />
        <HowItWorksSection />
        <ResultsSection />
        <CalculatorSection />
        <AudienceSection />
        <AboutSection />
        <FaqSection />
        <CtaFormSection />
      </main>
      <Footer />
    </>
  );
}
