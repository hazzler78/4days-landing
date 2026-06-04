# 4days Knowledge Agent

Intern AI-assistent för **4days.ai AB** – ladda upp dokument och chatta med en RAG-baserad agent som har full kunskap om allt material.

## Tech stack

- **Next.js 15** (App Router) + TypeScript
- **Tailwind CSS** + shadcn/ui
- **Supabase** (Auth, PostgreSQL, pgvector, Storage)
- **Grok (xAI)** – chat-svar
- **OpenAI `text-embedding-3-small`** – embeddings
- **Vercel** – deployment

## Kom igång

### 1. Klona och installera

```bash
npm install
cp .env.local.example .env.local
```

### 2. Supabase-setup

1. Skapa projekt på [supabase.com](https://supabase.com)
2. Kör SQL-migrationen i **SQL Editor**:

   ```
   supabase/migrations/001_initial_schema.sql
   ```

3. Aktivera **pgvector**-extension (ingår i migrationen)
4. Skapa Storage-bucket **`documents`** (privat)
5. Lägg till Storage-policies för `authenticated`:
   - SELECT, INSERT, DELETE
6. Under **Authentication → URL Configuration**, lägg till:
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/auth/callback`
7. Aktivera **Email (Magic Link)** under Authentication → Providers

### 3. Miljövariabler

Fyll i `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
OPENAI_API_KEY=sk-...
XAI_API_KEY=xai-...
```

### 4. Starta lokalt

```bash
npm run dev
```

Öppna [http://localhost:3000](http://localhost:3000) → logga in med magic link.

## Testa flödet

1. **Auth** – Ange e-post på `/login`, klicka länken i mailet
2. **Upload** – Dra en `.txt` eller `.pdf` till sidopanelen
3. **Indexering** – Dokumentet får status "Indexerad" med antal chunks
4. **Chat** – Ställ en fråga om dokumentinnehållet, t.ex. "Sammanfatta dokumentet"
5. **Källor** – Svaret visar badges med dokumentnamn + chunk-index
6. **Admin** – `/admin` visar chunks per dokument
7. **Inställningar** – `/settings` för chunk-storlek och overlap

## Deploy till Vercel

```bash
npx vercel
```

Lägg till samma miljövariabler i Vercel Dashboard. Uppdatera Supabase redirect URLs med produktionsdomänen.

> **Obs:** Dokumentbearbetning körs synkront vid upload. Stora PDF:er kan behöva Vercel Pro (60s timeout) eller async processing i framtiden.

## Projektstruktur

```
src/
├── app/
│   ├── api/          # REST + streaming chat
│   ├── admin/        # Admin-vy
│   ├── settings/     # Chunk-inställningar
│   └── login/        # Magic link
├── components/       # UI-komponenter
├── lib/
│   ├── ai/           # Embeddings + RAG
│   ├── documents/    # Text extraction, chunking
│   └── supabase/     # Auth clients
└── types/            # TypeScript-typer
supabase/migrations/  # PostgreSQL schema + RLS
```

## Licens

Proprietär – 4days.ai AB
