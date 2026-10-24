"use client";

import { FormEvent, useId, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { hermesGuideMeta } from "@/content/hermes-guide";
import { cn } from "@/lib/utils";
import { trackHermesGuideSignup } from "@/lib/vercelEvents";

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

export type HermesGuideFormProps = {
  source?: string;
  tags?: string;
  idPrefix?: string;
  className?: string;
  submitLabel?: string;
  successCtaHref?: string;
  successCtaLabel?: string;
  successNote?: string;
  analyticsPlacement?: string;
};

export function HermesGuideForm({
  source = hermesGuideMeta.source,
  tags = "hermes-start,ai-agenter,gratis-start,grok-default",
  idPrefix,
  className,
  submitLabel = "Skicka mig tips",
  successCtaHref = "/gratis-guide-hermes-agenter#starta",
  successCtaLabel = "Till Starta här",
  successNote = "Bekräfta e-posten (dubbel opt-in). Sen skickar vi korta tips — men du kan redan klicka Starta här och installera Hermes direkt.",
  analyticsPlacement = "hermes-guide-form",
}: HermesGuideFormProps) {
  const reactId = useId().replace(/:/g, "");
  const prefix = idPrefix || `hermes-${reactId}`;
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
          source,
          tags,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Kunde inte skicka formuläret.");
      }

      trackHermesGuideSignup(analyticsPlacement);
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
    <Card
      className={cn(
        "border-accent/20 shadow-[var(--shadow-premium)]",
        className
      )}
    >
      <CardContent className="p-6 sm:p-8">
        {submitted ? (
          <div className="py-6 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-accent" />
            <h3 className="mt-4 text-xl font-semibold text-brand">
              Tack – kolla din inkorg!
            </h3>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              {successNote}
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button asChild>
                <Link href={successCtaHref}>{successCtaLabel}</Link>
              </Button>
              <Button variant="outline" onClick={() => setSubmitted(false)}>
                Skicka igen
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`${prefix}-firstName`}>
                  Förnamn <span className="text-red-500">*</span>
                </Label>
                <Input
                  id={`${prefix}-firstName`}
                  required
                  autoComplete="given-name"
                  value={form.firstName}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, firstName: e.target.value }))
                  }
                  placeholder="Förnamn"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${prefix}-lastName`}>
                  Efternamn <span className="text-red-500">*</span>
                </Label>
                <Input
                  id={`${prefix}-lastName`}
                  required
                  autoComplete="family-name"
                  value={form.lastName}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, lastName: e.target.value }))
                  }
                  placeholder="Efternamn"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${prefix}-email`}>
                E-post <span className="text-red-500">*</span>
              </Label>
              <Input
                id={`${prefix}-email`}
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
              <Label htmlFor={`${prefix}-company`}>
                Företag <span className="text-red-500">*</span>
              </Label>
              <Input
                id={`${prefix}-company`}
                required
                autoComplete="organization"
                value={form.company}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, company: e.target.value }))
                }
                placeholder="Företagsnamn"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${prefix}-role`}>Roll</Label>
              <Input
                id={`${prefix}-role`}
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
                  setForm((prev) => ({ ...prev, consent: e.target.checked }))
                }
                required
              />
              <span>
                Jag vill ha korta tips om Hermes-start och AI-agenter för svenska
                bolag. Läs mer i vår{" "}
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
                submitLabel
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
