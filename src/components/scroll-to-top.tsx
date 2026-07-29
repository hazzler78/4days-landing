"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

/**
 * Old homepage hashes that moved to subpages after the redesign.
 * Client-side only — servers cannot redirect URL fragments.
 */
const HASH_REDIRECTS: Record<string, string> = {
  "#faq": "/faq",
  "#om-oss": "/om-oss",
  // Calculator removed from homepage — send visitors to proof/CTA area
  "#kalkylator": "/#bevis",
  "#resa": "/#start",
  "#resultat": "/#bevis",
};

/**
 * Prevent browser/Next scroll restoration from landing mid-page,
 * and remap retired homepage hashes to their new routes.
 */
export function ScrollToTop() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
    } catch {
      /* ignore */
    }

    const hash = window.location.hash.toLowerCase();
    if (pathname === "/" && HASH_REDIRECTS[hash]) {
      router.replace(HASH_REDIRECTS[hash]);
      return;
    }

    const html = document.documentElement;
    const prevBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";

    // Keep intentional deep-links (#guide, #varfor, etc.), otherwise start at top
    const hasHash = Boolean(window.location.hash);
    if (!hasHash) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
      const t1 = window.setTimeout(() => {
        if (!window.location.hash) window.scrollTo(0, 0);
      }, 0);
      const t2 = window.setTimeout(() => {
        if (!window.location.hash) window.scrollTo(0, 0);
        html.style.scrollBehavior = prevBehavior;
        html.setAttribute("data-smooth-scroll", "true");
      }, 200);
      return () => {
        window.clearTimeout(t1);
        window.clearTimeout(t2);
        html.style.scrollBehavior = prevBehavior;
      };
    }

    html.setAttribute("data-smooth-scroll", "true");
    html.style.scrollBehavior = prevBehavior;
  }, [pathname, router]);

  return null;
}
