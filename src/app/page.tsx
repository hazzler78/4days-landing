import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/sections/hero";
import { JourneyScrollSection } from "@/components/sections/journey-scroll";
import { WhySection } from "@/components/sections/why";
import { HowItWorksSection } from "@/components/sections/how-it-works";
import { ResultsSection } from "@/components/sections/results";
import { CalculatorSection } from "@/components/sections/calculator";
import { AudienceSection } from "@/components/sections/audience";
import { SocialProofSection } from "@/components/sections/social-proof";
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
        <JourneyScrollSection />
        <HeroSection />
        <WhySection />
        <HowItWorksSection />
        <ResultsSection />
        <SocialProofSection />
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
