export const hermesGuideMeta = {
  title: "Starta Hermes på några klick",
  shortTitle: "Starta Hermes gratis",
  description:
    "Klicka Starta här, installera Hermes Desktop, logga in med Grok/xAI (eller teamkonto) och kör din första agent. Inga 40-sidorsguider – AI leder dig.",
  landingPath: "/gratis-guide-hermes-agenter",
  deliveryPath: "/hermes-agenter-guide",
  pdfPath: "/guides/4Days_AI_Hermes_Quick_Start_Mac_v1.1.pdf",
  pdfFileName: "4Days_AI_Hermes_Quick_Start_Mac_v1.1.pdf",
  source: "hermes-start",
  /** Official Hermes entry points */
  install: {
    hub: "https://hermes-agent.nousresearch.com/",
    desktop: "https://hermes-agent.nousresearch.com/desktop",
    docs: "https://hermes-agent.nousresearch.com/docs/getting-started/installation",
    macHint: "Ladda ner Hermes Desktop för Mac och öppna installern.",
    winHint: "Ladda ner Hermes Desktop för Windows och kör .exe.",
    cli:
      "curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash",
  },
  defaults: {
    modelProvider: "Grok / xAI",
    modelNote:
      "Default: Grok free via xAI. Har du teamkonto hos Nous/xAI – logga in med det.",
    altProvider: "OpenAI/ChatGPT valfritt senare – inte krav.",
  },
} as const;

export type HermesGuideSection = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

/** Kort “efter start”-guide – inte en kursroman */
export const hermesGuideSections: HermesGuideSection[] = [
  {
    id: "steg-1",
    title: "1. Installera (ett klick)",
    paragraphs: [
      "Tryck Starta här på landningssidan och ladda ner Hermes Desktop för din dator. Installern tar det tunga: app + CLI-grunder. På Mac kan systemet be om Command Line Tools/Git en gång – klicka Installera och vänta ut det.",
    ],
    bullets: [
      "Mac: öppna .dmg → dra till Program → starta Hermes",
      "Windows: kör installern → Starta Hermes",
      "Stuck? Skicka skärmdump till hello@4days.ai – vi hjälper dig vidare",
    ],
  },
  {
    id: "steg-2",
    title: "2. Logga in – Grok/xAI som default",
    paragraphs: [
      "När Hermes öppnas: koppla modell. Vi vill att default ska vara Grok via xAI (free funkar att börja). Har du redan ett team- eller företagskonto – logga in med det i stället för att skapa nytt.",
    ],
    bullets: [
      "Grok/xAI: skapa/logga in på grok.com eller xAI-konto i webben, koppla i Hermes",
      "Teamkonto: använd samma inloggning ni fått av IT/4days",
      "ChatGPT/OpenAI: valfritt senare – hoppa över nu",
    ],
  },
  {
    id: "steg-3",
    title: "3. Två koder? Lugnt.",
    paragraphs: [
      "Login kan visa mejl-kod (6 siffror) och sedan enhetskod (XXXX-XXXX). De är olika steg – inte samma kod. Ha webbläsare och Hermes öppna samtidigt. Försvann sidan? Re-open verification page i Hermes.",
    ],
  },
  {
    id: "steg-4",
    title: "4. Din första agent (5 min)",
    paragraphs: [
      "Välj EN tidstjuv: mejlsammanfattning, mötesnotes → actions, eller veckorapport-utkast. Be Hermes bygga agenten. Målet är en win samma dag – inte en perfekt stack.",
    ],
  },
  {
    id: "steg-5",
    title: "5. Dela frihet – eller behåll edge",
    paragraphs: [
      "När du sparar tid: du får behålla försprånget. Vill du att fler andas ut? Dela resultatet (inte hela receptet) och boka 30 min intro/audit när bolaget ska ta nästa steg.",
    ],
  },
];
