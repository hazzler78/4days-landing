"use client";

import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "@/components/motion/reveal";
import { faqItems } from "@/lib/faq-data";
import { Button } from "@/components/ui/button";
import { getBookingUrl } from "@/lib/site";

export function FaqSection() {
  return (
    <section id="faq" className="scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-14 text-center">
          <p className="text-sm font-semibold text-accent">Vanliga frågor</p>
          <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
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

        <Reveal delay={0.15} className="mt-14 text-center">
          <p className="mb-5 text-slate-600">
            Vill du veta hur 4-dagarsvecka kan se ut hos er?
          </p>
          <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Button asChild size="lg">
              <a
                href={getBookingUrl()}
                target="_blank"
                rel="noopener noreferrer"
              >
                Boka 30 min kartläggning
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/#guide">Ladda ner guide</Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
