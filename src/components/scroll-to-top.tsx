"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Prevent browser/Next scroll restoration from landing mid-page,
 * and avoid smooth-scroll fighting the initial paint.
 */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
    } catch {
      /* ignore */
    }

    const html = document.documentElement;
    const prevBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";

    // Keep intentional deep-links (#faq etc.), otherwise always start at top
    const hasHash = Boolean(window.location.hash);
    if (!hasHash) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
      // Extra tick: layout/video can shift after first paint
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
  }, [pathname]);

  return null;
}
