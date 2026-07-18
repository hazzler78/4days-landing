"use client";

import { useMemo, useState } from "react";
import { Calculator, Clock3, CalendarRange } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { AnimatedNumber } from "@/components/motion/counter";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

function SliderField({
  id,
  label,
  value,
  min,
  max,
  step = 1,
  suffix,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <Label htmlFor={id}>{label}</Label>
        <span className="rounded-lg bg-accent-soft px-2.5 py-1 text-sm font-semibold text-accent-dim">
          {value}
          {suffix}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-accent"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
      />
      <div className="flex justify-between text-xs text-slate-400">
        <span>
          {min}
          {suffix}
        </span>
        <span>
          {max}
          {suffix}
        </span>
      </div>
    </div>
  );
}

export function CalculatorSection() {
  const [employees, setEmployees] = useState(40);
  const [repetitivePercent, setRepetitivePercent] = useState(25);
  const [hoursSaved, setHoursSaved] = useState(8);

  const results = useMemo(() => {
    const weekly = employees * hoursSaved;
    const monthly = weekly * 4.33;
    const yearly = weekly * 52;
    const extraDays = yearly / 8;
    const potentialFromRepetitive = employees * 40 * (repetitivePercent / 100) * 0.5;
    return { weekly, monthly, yearly, extraDays, potentialFromRepetitive };
  }, [employees, hoursSaved, repetitivePercent]);

  return (
    <section id="kalkylator" className="scroll-mt-24 bg-slate-50 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-sm font-semibold text-accent">Time-Saver Calculator</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-brand sm:text-4xl">
            Räkna på er tidsvinst
          </h2>
          <p className="mt-4 text-slate-600">
            Justera reglagen och se hur många timmar – och extra lediga dagar – AI
            kan frigöra för er organisation varje år.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <Card className="overflow-hidden border-slate-200/80 shadow-[var(--shadow-premium)]">
            <CardContent className="grid gap-0 p-0 lg:grid-cols-2">
              <div className="space-y-8 p-6 sm:p-8">
                <div className="inline-flex items-center gap-2 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-accent">
                  <Calculator className="h-3.5 w-3.5" aria-hidden="true" />
                  Interaktiv kalkylator
                </div>

                <SliderField
                  id="employees"
                  label="Antal anställda"
                  value={employees}
                  min={10}
                  max={200}
                  suffix=" pers"
                  onChange={setEmployees}
                />
                <SliderField
                  id="repetitive"
                  label="Tid på repetitivt/admin-arbete"
                  value={repetitivePercent}
                  min={5}
                  max={60}
                  suffix="%"
                  onChange={setRepetitivePercent}
                />
                <SliderField
                  id="hours-saved"
                  label="Sparad tid per person och vecka"
                  value={hoursSaved}
                  min={2}
                  max={16}
                  suffix=" h"
                  onChange={setHoursSaved}
                />

                <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
                  Tips: många kunskapsintensiva bolag ligger på 20–30 % repetitivt
                  arbete. Med AI ser vi ofta 8–12 timmar frigjord tid per person och
                  vecka.
                </p>
              </div>

              <div className="border-t border-slate-200 bg-brand p-6 text-white sm:p-8 lg:border-l lg:border-t-0">
                <p className="text-sm font-semibold text-accent">Er potentiella vinst</p>
                <div className="mt-6 grid gap-4">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Clock3 className="h-4 w-4 text-accent" />
                      <span className="text-sm">Timmar sparade / vecka</span>
                    </div>
                    <p className="mt-2 text-4xl font-bold">
                      <AnimatedNumber value={Math.round(results.weekly)} />
                    </p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                      <p className="text-sm text-slate-300">Per månad</p>
                      <p className="mt-2 text-2xl font-bold">
                        <AnimatedNumber value={Math.round(results.monthly)} /> h
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                      <p className="text-sm text-slate-300">Per år</p>
                      <p className="mt-2 text-2xl font-bold">
                        <AnimatedNumber value={Math.round(results.yearly)} /> h
                      </p>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-accent/30 bg-accent/10 p-5">
                    <div className="flex items-center gap-2 text-accent">
                      <CalendarRange className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Motsvarar extra lediga dagar / år
                      </span>
                    </div>
                    <p className="mt-2 text-4xl font-bold text-white">
                      <AnimatedNumber
                        value={Number(results.extraDays.toFixed(0))}
                      />
                    </p>
                    <p className="mt-2 text-sm text-slate-300">
                      Baserat på 8-timmarsdagar. Potentiell vinst från er
                      adminandel: ca{" "}
                      <strong className="text-white">
                        {Math.round(results.potentialFromRepetitive)} h/vecka
                      </strong>{" "}
                      om hälften automatiseras.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}
