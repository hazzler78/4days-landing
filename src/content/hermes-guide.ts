export const hermesGuideMeta = {
  title: "Kom igång med Hermes Agents för svenska bolag",
  shortTitle: "Gratis guide: Hermes Agents",
  description:
    "Gratis mini-guide: vad Hermes Agents är, hög-ROI-fall för svenska SMEs, GDPR och när ni bör bygga själva vs låta oss implementera – kopplat till mer tid och 4-dagarsvecka.",
  landingPath: "/gratis-guide-hermes-agenter",
  deliveryPath: "/hermes-agenter-guide",
  source: "hermes-guide",
} as const;

export type HermesGuideSection = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export const hermesGuideSections: HermesGuideSection[] = [
  {
    id: "vad-ar-hermes",
    title: "Vad är Hermes Agents?",
    paragraphs: [
      "Hermes Agents (från Nous Research) är AI-agenter som kan utföra arbetsflöden – inte bara svara på frågor. Till skillnad från en vanlig chattbot kan en agent planera steg, använda verktyg, hämta data och lämna ifrån sig ett resultat ni kan agera på.",
      "För svenska bolag betyder det konkreta saker: sammanfatta mejltrådar, förbereda underlag från CRM, skapa utkast till offert eller rapport, och flagga avvikelser i adminflöden. Målet är inte “mer AI” – utan färre manuella timmar på repetitivt arbete.",
    ],
  },
  {
    id: "varfor-sme",
    title: "Varför det passar svenska SMEs",
    paragraphs: [
      "Många bolag med 10–200 anställda har redan verktyg (mejl, kalender, CRM, Fortnox/Visma, projektverktyg) – men saknar tid och kompetens att koppla ihop dem säkert. Det är precis där agenter skapar nytta: de sitter mellan era system och era människor.",
      "Hermes-kursen och den här guiden är byggda med affärsfokus: GDPR, svenska arbetssätt och mätbar tidsvinst – inte tech-demo för teknikens skull.",
    ],
    bullets: [
      "Ni behöver inte bli AI-labb – ni behöver 2–3 processer som sparar tid varje vecka.",
      "Börja där volymen och enformigheten är högst: admin, intern rapportering, kunduppföljning.",
      "Koppla alltid till ett affärsmål: färre övertidstimmar, snabbare offert, eller en dag mer frihet i veckan.",
    ],
  },
  {
    id: "hog-roi",
    title: "Hög-ROI-fall att börja med",
    paragraphs: [
      "Starta lean. En agent som sparar 3–5 timmar i veckan på ett team är mer värd än tio halvfärdiga experiment. Här är fall som ofta ger snabbast utväxling i kunskapsintensiva bolag:",
    ],
    bullets: [
      "Mejl & mötesprep: sammanfatta inkommande trådar, föreslå svar, skapa agenda och action points.",
      "CRM-hygien: påminna om uppföljning, fylla i saknade fält från anteckningar, skapa nästa steg.",
      "Intern rapportering: dra ihop veckostatus från Slack/Notion/ärendesystem till ett utkast ledningen kan granska.",
      "Ekonomi-admin: sortera underlag, skapa checklistor inför bokslut, flagga saknade kvitton (utan att “gissa” bokföring).",
      "Kundsupport nivå 1: föreslå svar utifrån er kunskapsbas – med människa i loopen innan något skickas.",
    ],
  },
  {
    id: "kom-igang",
    title: "Så kommer ni igång på 7 dagar (mini-plan)",
    paragraphs: [
      "Ni behöver inte en stor transformation. Använd den här veckoplanen som mall för ett första agent-pilotprojekt.",
    ],
    bullets: [
      "Dag 1–2: Välj EN process. Skriv ner stegen ni gör manuellt idag (input → beslut → output).",
      "Dag 3: Definiera regler. Vad får agenten göra själv? Vad kräver mänskligt godkännande?",
      "Dag 4: Samla data/källor. Policyer, mallar, exempel på bra/dåliga utfall.",
      "Dag 5: Bygg ett smalt flöde (MVP). Ett verktyg, ett mål, en ansvarig ägare.",
      "Dag 6: Testa på riktiga fall. Mät tid före/efter och antal fel/omarbetningar.",
      "Dag 7: Bestäm nästa steg. Skala, pausa, eller ta hjälp med säkrare integrationer.",
    ],
  },
  {
    id: "gdpr",
    title: "GDPR, säkerhet och svenska system",
    paragraphs: [
      "Det här är punkten där de flesta DIY-projekt bromsar in – och det är okej. Att koppla en agent till kunddata, personaldata eller ekonomisystem kräver tydliga ramar.",
      "Som minimum bör ni: minimera vilka data agenten ser, logga vad som körs, ha mänsklig granskning på utgående kommunikation, och undvika att lägga hemligheter i promptar. Integrationer mot Fortnox, Visma, CRM eller HR-system ska ske med behörighetsstyrning – inte via delade lösenord i chatten.",
    ],
    bullets: [
      "Personuppgifter: behandla bara det som behövs för uppgiften.",
      "Leverantörsavtal: förstå var data processas och hur länge den sparas.",
      "Åtkomst: separata API-nycklar per miljö, snäv behörighet, möjlighet att dra tillbaka access.",
      "Revision: spara exempel på input/output så ni kan förklara beslut i efterhand.",
    ],
  },
  {
    id: "diy-vs-oss",
    title: "Bygga själva eller låta oss göra det?",
    paragraphs: [
      "Gratis utbildning är till för att ni ska förstå möjligheterna och kunna ställa rätt krav. Men de flesta bolag vill inte själva driftsätta säkra, GDPR-anpassade agenter med integrationer – och det är precis därför hybridmodellen fungerar.",
      "DIY passar när processen är intern, risken låg och ni har teknisk kapacitet. Done-for-you passar när ni vill ha produktionssäkerhet, integrationer, uppföljning och en tydlig ROI-plan.",
    ],
    bullets: [
      "Gratis (den här guiden + kommande mini-kurs): kunskap, mallar, community-idéer.",
      "Betalt: blueprints, implementation, teamutbildning, support och uppföljning.",
      "Målbilden hos 4days.ai: frigjord tid som gör en 4-dagarsvecka med full lön möjlig.",
    ],
  },
  {
    id: "nasta-steg",
    title: "Nästa steg",
    paragraphs: [
      "Om ni vill gå vidare: välj ett hög-ROI-fall från listan ovan, räkna grovt hur många timmar det tar idag, och boka ett kort strategisamtal. Vi hjälper er avgöra vad som ska automatiseras först – och vad som hellre får vänta.",
      "Den här guiden är starten på en större Hermes-satsning under 4days.ai: mini-kurs, community där ni kan dela byggen och promptar, och betalda spår för dem som vill ha det gjort åt er.",
    ],
  },
];
