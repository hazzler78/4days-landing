export const PLAUSIBLE_DOMAIN =
  process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || "4days.ai";

export type PlausibleProps = Record<string, string | number | boolean>;

declare global {
  interface Window {
    plausible?: (
      eventName: string,
      options?: { props?: PlausibleProps }
    ) => void;
  }
}

/** Fire a Plausible custom event (no-op until script is ready). */
export function trackPlausible(eventName: string, props?: PlausibleProps) {
  if (typeof window === "undefined") return;
  if (typeof window.plausible !== "function") return;
  if (props && Object.keys(props).length > 0) {
    window.plausible(eventName, { props });
    return;
  }
  window.plausible(eventName);
}

export const plausibleEvents = {
  leadSubmit: "Lead Submit",
  hermesClick: "Hermes Click",
  bookingClick: "Booking Click",
} as const;
