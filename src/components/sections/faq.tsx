"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "@/components/motion/reveal";
import { faqItems } from "@/lib/faq-data";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";

export function FaqSection() {
  return (
    <section id="faq" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-12 text-center">
          <p className="text-sm font-semibold text-accent">Vanliga frågor</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-brand sm:text-4xl">
            4-dagarsvecka & AI – FAQ
          </h2>
          <p className="mt-4 text-slate-600">
            Svar på det ledningsgrupper och HR oftast undrar – med koppling till
            100-80-100-modellen och vår AI-konsultation.
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <Accordion type="single" collapsible className="space-y-3">
            {faqItems.map((item, index) => (
              <AccordionItem key={item.question} value={`item-${index}`}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>

        <Reveal delay={0.15} className="mt-12 text-center">
          <p className="mb-5 text-slate-600">
            Vill du veta hur 4-dagarsvecka kan se ut hos er?
          </p>
          <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Button asChild size="lg">
              <a href="#guide">Få guiden gratis</a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a
                href={siteConfig.calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Boka 30 min intro
              </a>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
