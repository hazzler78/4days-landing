/** 4days free→paid funnel — source of truth for agent copy on web */
export const funnelAgentContent = {
  slogan: "En dag mer frihet. Med AI.",
  bookingEmail: "hello@4days.ai",
  bookingMode: "email" as "email" | "calendly",
  /** Parked — flip bookingMode to calendly when ready */
  calendlyUrl: "https://calendly.com/hello-4days/30min",
  auditPrice: "2 500 kr",
  tracks: {
    champion: {
      id: "A",
      name: "Champion",
      promise:
        "Status uppåt — du blir den som tar in spelet, inte den som tappar edge.",
    },
    quietHero: {
      id: "B",
      name: "Quiet hero",
      promise: "Behåll försprånget. Fördjupa solo. Audit bara om du vill.",
    },
  },
  stages: [
    { id: "individ", label: "Individ", price: "free", goal: "Första agent live + win" },
    { id: "track", label: "Spår A/B", price: "free", goal: "Champion eller Quiet hero" },
    { id: "audit", label: "Audit", price: "paid", goal: "45–60 min Time-Saver Audit" },
    { id: "pack", label: "Pack/Retainer", price: "paid", goal: "Starter→Growth→Enterprise" },
  ],
  scoreThresholds: { stayFree: 3, softAudit: 4, strongAudit: 7 },
} as const;
