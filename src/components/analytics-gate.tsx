"use client";

import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/next";

const STORAGE_KEY = "4days_cookie_consent";

export function AnalyticsGate() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const sync = () => {
      try {
        setEnabled(localStorage.getItem(STORAGE_KEY) === "analytics");
      } catch {
        setEnabled(false);
      }
    };
    sync();
    window.addEventListener("4days:analytics-consent", sync);
    return () => window.removeEventListener("4days:analytics-consent", sync);
  }, []);

  if (!enabled) return null;
  return <Analytics />;
}
