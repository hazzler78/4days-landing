"use client";

import { useEffect } from "react";
import Script from "next/script";
import {
  PLAUSIBLE_DOMAIN,
  plausibleEvents,
  trackPlausible,
} from "@/lib/plausible";

/**
 * Plausible is cookieless – load without consent banner.
 * Also tags Calendly / Hermes outbound clicks sitewide.
 */
export function PlausibleAnalytics() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a");
      if (!anchor?.href) return;

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.origin);
      } catch {
        return;
      }

      const path = window.location.pathname;

      if (url.hostname.includes("calendly.com")) {
        trackPlausible(plausibleEvents.bookingClick, { path });
        return;
      }

      const isHermesOutbound = url.hostname.includes(
        "hermes-agent.nousresearch.com"
      );
      const isHermesLanding =
        url.origin === window.location.origin &&
        url.pathname.startsWith("/gratis-guide-hermes-agenter");

      if (isHermesOutbound || isHermesLanding) {
        trackPlausible(plausibleEvents.hermesClick, {
          path,
          destination: isHermesOutbound
            ? url.hostname + url.pathname
            : url.pathname + url.hash,
        });
      }
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <Script
      defer
      data-domain={PLAUSIBLE_DOMAIN}
      src="https://plausible.io/js/script.js"
      strategy="afterInteractive"
    />
  );
}
