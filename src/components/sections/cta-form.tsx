"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
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
  consent: boolean;
};

const initialState: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  company: "",
  role: "",
  consent: false,
};

export function CtaFormSection() {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: form.firstName,
          last_name: form.lastName,
          email: form.email,
          company: form.company,
          role: form.role,
          employees: "10–200",
          consent: form.consent,
          source: "landing-4days-ai",
          tags: "4-dagarsvecka,guide,webinar,ai",
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Kunde inte skicka formuläret.");
      }

      setSubmitted(true);
      setForm(initialState);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Ett fel uppstod. Försök igen om en stund."
      );
    } finally {
      setSubmitting(false);
    }
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
            webinar. Bekräftelse via e-post (dubbel opt-in).
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-10">
          <Card className="border-accent/20 shadow-[var(--shadow-premium)]">
            <CardContent className="p-6 sm:p-8">
              {submitted ? (
                <div className="py-8 text-center">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-accent" />
                  <h3 className="mt-4 text-xl font-semibold text-brand">
                    Tack – kolla din inkorg!
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    Bekräfta din e-post via länken vi skickar (dubbel opt-in) –
                    då får du guiden och inbjudan till webinaret.
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
                      required
                      autoComplete="organization-title"
                      value={form.role}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, role: e.target.value }))
                      }
                      placeholder="VD, HR, CTO..."
                    />
                  </div>

                  <label className="flex items-start gap-3 text-xs leading-relaxed text-slate-600">
                    <input
                      type="checkbox"
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-accent focus:ring-accent"
                      checked={form.consent}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          consent: e.target.checked,
                        }))
                      }
                      required
                    />
                    <span>
                      Jag vill ha tips om 4-dagarsvecka, AI-automatisering och
                      inbjudan till nästa webinar. Läs mer i vår{" "}
                      <Link
                        href="/integritetspolicy"
                        className="font-medium text-accent-dim underline-offset-2 hover:underline"
                      >
                        integritetspolicy
                      </Link>
                      .
                    </span>
                  </label>

                  {error && (
                    <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                      {error}
                    </p>
                  )}

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
