import { track } from "@vercel/analytics";

const STORAGE_KEY = "4days_cookie_consent";

function hasAnalyticsConsent(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(STORAGE_KEY) === "analytics";
  } catch {
    return false;
  }
}

type EventProps = Record<
  string,
  string | number | boolean | null | undefined
>;

function vercelTrack(event: string, properties?: EventProps): void {
  if (!hasAnalyticsConsent()) return;
  try {
    track(event, properties);
  } catch {
    /* analytics unavailable */
  }
}

export function trackGuideSignup(placement: string): void {
  vercelTrack("guide_signup", {
    placement,
    page:
      typeof window !== "undefined" ? window.location.pathname : undefined,
  });
}

export function trackHermesGuideSignup(placement = "hermes-guide-form"): void {
  vercelTrack("hermes_guide_signup", {
    placement,
    page:
      typeof window !== "undefined" ? window.location.pathname : undefined,
  });
}

export function trackBookCallClick(placement: string): void {
  vercelTrack("book_call_click", { placement });
}

export function trackChatOpen(): void {
  vercelTrack("chat_open");
}

export function trackChatMessage(): void {
  vercelTrack("chat_message");
}
