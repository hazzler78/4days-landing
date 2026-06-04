-- 4days Knowledge Agent – teardown (database only)
-- Storage måste rensas separat via Dashboard eller Storage API (se README nedan).

-- ─── App-tabeller ────────────────────────────────────────────────────────────
drop table if exists public.chat_messages cascade;
drop table if exists public.chat_sessions cascade;
drop table if exists public.document_chunks cascade;
drop table if exists public.documents cascade;
drop table if exists public.app_settings cascade;

-- ─── App-funktioner ──────────────────────────────────────────────────────────
drop function if exists public.match_document_chunks(extensions.vector, int, float);
drop function if exists public.set_updated_at() cascade;

-- ─── Storage policies (bucket kan finnas kvar tills den tas bort manuellt) ───
drop policy if exists "Authenticated upload documents" on storage.objects;
drop policy if exists "Authenticated read documents" on storage.objects;
drop policy if exists "Authenticated delete documents" on storage.objects;

-- pgvector: behåll om nästa projekt ska använda det
-- drop extension if exists vector cascade;
