# 4days.ai – Landing (Next.js 15)

Premium landningssida för **4 Days AI AB** – AI-konsultbolag som hjälper kunskapsintensiva svenska företag att gå från 5 till 4 dagars arbetsvecka med full lön.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS 4
- Framer Motion
- shadcn-inspirerade UI-komponenter (Radix UI)
- Lucide icons
- Vercel Analytics

## Kom igång

```bash
npm install
npm run dev
```

Öppna [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` – lokal utveckling (Turbopack)
- `npm run build` – produktion
- `npm run start` – starta byggd app
- `npm run lint` – ESLint
- `npm run indexnow` – IndexNow-submit
- `npm run seed:knowledge` – seed till kunskapsbas

## Struktur

- `src/app` – App Router (layout, page, metadata)
- `src/components/sections` – landningssektioner
- `src/components/ui` – återanvändbara UI-primitiver
- `public/legacy` – befintliga SEO-/juridiska HTML-sidor
- `api/` – befintliga Vercel serverless functions (chat, subscribe, IndexNow)
- `4days-knowledge-agent/` – intern Knowledge Agent (separat Next-app)

## Formulär

Leadformuläret loggar tills vidare till `console` (placeholder). Nästa steg är att koppla det till `/api/subscribe` (MailerLite).
