import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CityHero } from "@/components/city/city-hero";
import { WhySection } from "@/components/sections/why";
import { HowItWorksSection } from "@/components/sections/how-it-works";
import { ProofSection } from "@/components/sections/proof";
import { AudienceSection } from "@/components/sections/audience";
import { CtaFormSection } from "@/components/sections/cta-form";
import { JsonLd } from "@/components/seo/json-ld";

export default function HomePage() {
  return (
    <>
      <JsonLd />
      <Header />
      <main>
        <CityHero />
        <WhySection />
        <HowItWorksSection />
        <ProofSection />
        <AudienceSection />
        <CtaFormSection />
      </main>
      <Footer />
    </>
  );
}
