# Kunskapsbas – 4days.ai Agent

Textfiler som matas in i Supabase (pgvector) för RAG i chatboten.

| Fil | Innehåll |
|-----|----------|
| `affarsplan-4days.txt` | Affärsplan maj 2026 |
| `primara-farger-4days.txt` | Brand-färger |
| `website-4days.txt` | Landningssida, tjänster, priser, kontakt |
| `faq-4days.txt` | FAQ (samma som på sidan) |

## Indexera till Supabase

```powershell
cd d:\Cursor\HEMSIDOR\4days
npm install
npm run seed:knowledge
```

Kräver i `.env`: `SUPABASE_URL` (eller `NEXT_PUBLIC_SUPABASE_URL`), `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`.

Kör migration `supabase/migrations/003_public_knowledge.sql` i Supabase SQL Editor (engångs) om scriptet ber om det.
