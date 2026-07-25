export const siteConfig = {
  name: "4 Days AI AB",
  brand: "4days.ai",
  legalName: "4 Days AI AB",
  orgNumber: "559587-6888",
  slogan: "En dag mer frihet. Med AI.",
  tagline: "Från 5 till 4 – smartare, inte hårdare.",
  model: "100% lön · 80% tid · 100% output",
  email: "hello@4days.ai",
  url: "https://www.4days.ai",
  /**
   * Booking CTA.
   * - "calendly" (current): https://calendly.com/hello-4days/30min (30 min intro/audit)
   * - "email": mailto hello@4days.ai (fallback)
   */
  bookingMode: "calendly" as "email" | "calendly",
  calendlyUrl: "https://calendly.com/hello-4days/30min",
  bookingUrl:
    "mailto:hello@4days.ai?subject=Boka%20intro%20%2F%20AI%20Time-Saver%20Audit%20%E2%80%93%204days.ai&body=Hej%204days%2C%0A%0AJag%20vill%20boka%20en%20tid%20(intro%20eller%20AI%20Time-Saver%20Audit).%0A%0ANamn%3A%0AF%C3%B6retag%3A%0AAntal%20anst%C3%A4llda%20(ca)%3A%0AKort%20om%20behov%3A%0A%0ATack%21%0A",
  address: {
    street: "Vasavägen 29",
    postalCode: "177 52",
    city: "Järfälla",
    country: "SE",
  },
  linkedin: {
    company: "https://www.linkedin.com/company/4days-ai",
    joseph: "https://www.linkedin.com/in/joseph-tran-844993150/",
    mikael: "https://www.linkedin.com/in/mikaelsoderberg1/",
  },
  pricing: {
    hourly: "2 500 kr/tim",
    kickstart20: "45 000 kr",
    kickstart40: "90 000 kr",
  },
} as const;

/** Resolve active booking link (Calendly when mode=calendly, else mailto). */
export function getBookingUrl(): string {
  if (siteConfig.bookingMode === "calendly") return siteConfig.calendlyUrl;
  return siteConfig.bookingUrl;
}
