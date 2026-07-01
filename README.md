# 4days.ai – landningssida

En-sida landningssida (HTML + Tailwind CDN) för lead capture och Calendly-bokning.

## Lokal preview

Öppna `index.html` i webbläsaren, eller:

```bash
npx serve .
```

## Deploy

Hostas på [Vercel](https://vercel.com). Vid push till `main` deployas automatiskt när GitHub är kopplat (se nedan).

## GitHub (engångs-setup)

```powershell
cd "d:\Cursor\HEMSIDOR\4days"
gh auth login
# Välj: GitHub.com → HTTPS → Login with a web browser

gh repo create 4days-landing --public --description "4days.ai Coming Soon landningssida" --source=. --remote=origin --push

# Koppla Vercel till repot (auto-deploy vid push)
vercel git connect
```

Om repot redan finns på GitHub:

```powershell
git remote add origin https://github.com/DITT-ANVÄNDARNAMN/4days-landing.git
git push -u origin main
vercel git connect
```

## MailerLite (Vercel serverless)

Formuläret postar till `/api/subscribe`, som anropar MailerLite API. API-nyckeln lagras **endast** på Vercel.

### 1. MailerLite-inställningar

1. **Account settings → Subscribe settings**
   - Aktivera **Double opt-in**
   - Aktivera **Double opt-in for API and integrations**
2. Skapa custom fields (om de saknas): `company`, `employees` (standardfältet `phone` används för telefon)
3. (Valfritt) Skapa grupp t.ex. "Landningssida" och notera **Group ID**

### 2. Vercel miljövariabler

```powershell
cd "d:\Cursor\HEMSIDOR\4days"
vercel env add MAILERLITE_API_TOKEN production
# Klistra in API-token när du tillfrågas

vercel env add MAILERLITE_GROUP_ID production
# Klistra in grupp-ID (valfritt)
```

Upprepa för `preview` om du vill testa på preview-URL:er. Deploya om efter att variablerna lagts till:

```powershell
vercel deploy --prod
```

### 3. Lokal utveckling

```powershell
copy .env.example .env.local
# Fyll i MAILERLITE_API_TOKEN i .env.local
vercel dev
```

Öppna http://localhost:3000 och testa formuläret.

## IndexNow (Bing-indexering)

IndexNow meddelar Bing (och andra sökmotorer) när sidor uppdaterats.

### 1. Skapa API-nyckel

Gå till [Bing IndexNow](https://www.bing.com/indexnow/getstarted) och generera en nyckel.

### 2. Lägg nyckeln i miljövariabler

**Lokalt** – i `.env.local` (kopiera från `.env.example`):

```env
INDEXNOW_API_KEY=din_nyckel_från_bing
```

**Produktion** – i [Vercel Dashboard](https://vercel.com) → Project → Settings → Environment Variables:

| Variabel | Värde |
|----------|--------|
| `INDEXNOW_API_KEY` | Din nyckel från Bing |
| `INDEXNOW_SUBMIT_SECRET` | (valfritt) hemligt värde för att skydda `/api/indexnow` |

Nyckeln ska **inte** committas till git. Vid deploy skapas automatiskt verifieringsfilen `https://www.4days.ai/{din-nyckel}.txt`.

### 3. Deploya om

Efter att variabeln lagts till i Vercel: pusha till `main` eller kör `vercel deploy --prod`.

Kontrollera att filen fungerar: öppna `https://www.4days.ai/DIN-NYCKEL.txt` i webbläsaren – den ska visa bara nyckeln som ren text.

### 4. Skicka in sidor

```bash
npm run indexnow
```

Eller efter deploy (om `INDEXNOW_SUBMIT_SECRET` är satt):

```bash
curl -X POST "https://www.4days.ai/api/indexnow" \
  -H "Authorization: Bearer DITT_HEMLIGA_VARDE"
```

## Övrig konfiguration

Se kommentarer högst upp i `index.html` (hero-bild, logotyp, OG-bild, footer-länkar).

Calendly: `https://calendly.com/hello-4days/30min`

## 4days.ai Agent (chatbot)

Publik chat-widget på landningssidan → `POST /api/chat` → **Grok (xAI)** + **Supabase RAG** (kunskapsbas).

### Miljövariabler (Vercel Production)

```powershell
vercel env add XAI_API_KEY production
vercel env add OPENAI_API_KEY production
vercel env add SUPABASE_URL production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
# valfritt:
vercel env add CALENDLY_URL production
```

Lokal utveckling: lägg samma nycklar i `.env` i projektroten och kör `vercel dev`.

### Kunskapsbas (Supabase)

**Steg 1 – SQL (engångs)** i [Supabase SQL Editor](https://supabase.com/dashboard):

Kör filerna i ordning (finns i `supabase/migrations/`):

1. `001_initial_schema.sql` – tabeller + pgvector
2. `002_storage_bucket.sql` – valfritt för filuppladdning i admin
3. `003_public_knowledge.sql` – tillåter seed utan inloggad användare
4. `004_public_chat_logs.sql` – sparar chattkonversationer från landningssidan

**Steg 2 – Indexera textfiler:**

```powershell
npm run seed:knowledge
```

Läser alla `knowledge/*.txt` (affärsplan, färger, webb, FAQ) och skapar embeddings.

**Steg 3 – Vercel:** `SUPABASE_SERVICE_ROLE_KEY` i production (redan i `.env` lokalt).

### Filer

| Fil | Syfte |
|-----|--------|
| `api/chat.js` | Serverless API (Grok + embeddings + Supabase) |
| `lib/agent-prompt.js` | Systemprompt för 4days.ai Agent |
| `js/chat-widget.js` | Flytande chat på sidan |
