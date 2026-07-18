"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "4days_cookie_consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(STORAGE_KEY);
      if (!consent) setVisible(true);
      if (consent === "analytics") {
        window.dispatchEvent(new Event("4days:analytics-consent"));
      }
    } catch {
      setVisible(true);
    }
  }, []);

  const choose = (value: "analytics" | "necessary") => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
    if (value === "analytics") {
      window.dispatchEvent(new Event("4days:analytics-consent"));
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[90] p-4"
      role="dialog"
      aria-label="Cookie-inställningar"
    >
      <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6">
        <p className="text-sm leading-relaxed text-slate-700">
          Vi använder nödvändiga cookies för att sidan ska fungera. Med ditt
          samtycke använder vi även analytics för att förbättra webbplatsen.{" "}
          <Link href="/cookies" className="font-medium text-accent-dim hover:underline">
            Läs mer
          </Link>
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => choose("necessary")}
          >
            Endast nödvändiga
          </Button>
          <Button type="button" onClick={() => choose("analytics")}>
            Godkänn analytics
          </Button>
        </div>
      </div>
    </div>
  );
}
