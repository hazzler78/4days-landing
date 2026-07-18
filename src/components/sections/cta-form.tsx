"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  role: string;
};

const initialState: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  company: "",
  role: "",
};

export function CtaFormSection() {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);

    // Placeholder until backend (MailerLite) is wired into the Next.js route.
    console.log("Lead form submission:", form);

    await new Promise((resolve) => setTimeout(resolve, 600));
    setSubmitting(false);
    setSubmitted(true);
    setForm(initialState);
  };

  return (
    <section
      id="guide"
      className="scroll-mt-24 border-y border-accent/10 bg-gradient-to-b from-slate-50 via-white to-accent-soft/30 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-xl px-4 sm:px-6">
        <Reveal className="text-center">
          <p className="text-sm font-semibold text-accent">Kom igång</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-brand sm:text-4xl">
            Få guiden + inbjudan till webinar
          </h2>
          <p className="mt-4 text-slate-600 leading-relaxed">
            Praktisk guide för ledningsgrupper – plus plats på vårt kommande
            webinar. Fyll i formuläret så hör vi av oss.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-10">
          <Card className="border-accent/20 shadow-[var(--shadow-premium)]">
            <CardContent className="p-6 sm:p-8">
              {submitted ? (
                <div className="py-8 text-center">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-accent" />
                  <h3 className="mt-4 text-xl font-semibold text-brand">
                    Tack – vi har tagit emot din förfrågan!
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    Vi återkommer snart med guiden och information om nästa
                    webinar.
                  </p>
                  <Button
                    className="mt-6"
                    variant="outline"
                    onClick={() => setSubmitted(false)}
                  >
                    Skicka igen
                  </Button>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-4" noValidate>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">
                        Förnamn <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        required
                        autoComplete="given-name"
                        value={form.firstName}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            firstName: e.target.value,
                          }))
                        }
                        placeholder="Förnamn"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">
                        Efternamn <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        required
                        autoComplete="family-name"
                        value={form.lastName}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            lastName: e.target.value,
                          }))
                        }
                        placeholder="Efternamn"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">
                      E-post <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, email: e.target.value }))
                      }
                      placeholder="namn@foretag.se"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">
                      Företag <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="company"
                      name="company"
                      required
                      autoComplete="organization"
                      value={form.company}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          company: e.target.value,
                        }))
                      }
                      placeholder="Företagsnamn"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">
                      Roll <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="role"
                      name="role"
                      required
                      autoComplete="organization-title"
                      value={form.role}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, role: e.target.value }))
                      }
                      placeholder="VD, HR, CTO..."
                    />
                  </div>

                  <p className="text-xs leading-relaxed text-slate-500">
                    Genom att skicka formuläret godkänner du att vi kontaktar dig
                    om guiden, webinar och relevant information om 4-dagarsvecka
                    och AI. Läs mer i vår{" "}
                    <a
                      href="/integritetspolicy"
                      className="font-medium text-accent-dim underline-offset-2 hover:underline"
                    >
                      integritetspolicy
                    </a>
                    .
                  </p>

                  <Button
                    type="submit"
                    size="xl"
                    className="w-full"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Skickar...
                      </>
                    ) : (
                      "Få guiden + webinar-inbjudan gratis"
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}
