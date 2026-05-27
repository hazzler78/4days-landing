-- 4days Knowledge Agent – initial schema
-- Run in Supabase SQL Editor or via supabase db push

create extension if not exists vector with schema extensions;

-- ─── Documents ───────────────────────────────────────────────────────────────
create table public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  filename text not null,
  file_path text not null,
  file_size bigint not null,
  mime_type text not null,
  status text not null default 'pending'
    check (status in ('pending', 'processing', 'indexed', 'error')),
  error_message text,
  chunk_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index documents_user_id_idx on public.documents(user_id);
create index documents_status_idx on public.documents(status);
create index documents_created_at_idx on public.documents(created_at desc);

-- ─── Document chunks (pgvector) ──────────────────────────────────────────────
create table public.document_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references public.documents(id) on delete cascade not null,
  chunk_index int not null,
  content text not null,
  embedding extensions.vector(1536),
  created_at timestamptz not null default now(),
  unique (document_id, chunk_index)
);

create index document_chunks_document_id_idx on public.document_chunks(document_id);

-- HNSW index for fast similarity search
create index document_chunks_embedding_idx
  on public.document_chunks
  using hnsw (embedding extensions.vector_cosine_ops);

-- ─── Chat sessions & messages ────────────────────────────────────────────────
create table public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.chat_sessions(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  sources jsonb,
  created_at timestamptz not null default now()
);

create index chat_messages_session_id_idx on public.chat_messages(session_id);

-- ─── App settings (singleton) ────────────────────────────────────────────────
create table public.app_settings (
  id int primary key default 1 check (id = 1),
  chunk_size int not null default 1000,
  chunk_overlap int not null default 200,
  updated_at timestamptz not null default now()
);

insert into public.app_settings (id) values (1);

-- ─── Similarity search function ──────────────────────────────────────────────
create or replace function public.match_document_chunks(
  query_embedding extensions.vector(1536),
  match_count int default 8,
  match_threshold float default 0.3
)
returns table (
  id uuid,
  document_id uuid,
  chunk_index int,
  content text,
  similarity float,
  document_filename text
)
language sql stable
as $$
  select
    dc.id,
    dc.document_id,
    dc.chunk_index,
    dc.content,
    1 - (dc.embedding <=> query_embedding) as similarity,
    d.filename as document_filename
  from public.document_chunks dc
  join public.documents d on d.id = dc.document_id
  where dc.embedding is not null
    and d.status = 'indexed'
    and 1 - (dc.embedding <=> query_embedding) > match_threshold
  order by dc.embedding <=> query_embedding
  limit match_count;
$$;

-- ─── Updated_at trigger ──────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger documents_updated_at
  before update on public.documents
  for each row execute function public.set_updated_at();

create trigger chat_sessions_updated_at
  before update on public.chat_sessions
  for each row execute function public.set_updated_at();

-- ─── Row Level Security ──────────────────────────────────────────────────────
alter table public.documents enable row level security;
alter table public.document_chunks enable row level security;
alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;
alter table public.app_settings enable row level security;

-- Shared workspace: all authenticated users see all documents
create policy "Authenticated read documents"
  on public.documents for select to authenticated using (true);

create policy "Authenticated insert own documents"
  on public.documents for insert to authenticated
  with check (auth.uid() = user_id);

create policy "Authenticated update documents"
  on public.documents for update to authenticated using (true);

create policy "Authenticated delete documents"
  on public.documents for delete to authenticated using (true);

create policy "Authenticated read chunks"
  on public.document_chunks for select to authenticated using (true);

create policy "Authenticated insert chunks"
  on public.document_chunks for insert to authenticated with check (true);

create policy "Authenticated delete chunks"
  on public.document_chunks for delete to authenticated using (true);

create policy "Users manage own chat sessions"
  on public.chat_sessions for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own chat messages"
  on public.chat_messages for all to authenticated
  using (
    exists (
      select 1 from public.chat_sessions cs
      where cs.id = session_id and cs.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.chat_sessions cs
      where cs.id = session_id and cs.user_id = auth.uid()
    )
  );

create policy "Authenticated read settings"
  on public.app_settings for select to authenticated using (true);

create policy "Authenticated update settings"
  on public.app_settings for update to authenticated using (true);

-- ─── Storage bucket (run separately if needed) ─────────────────────────────────
-- insert into storage.buckets (id, name, public)
-- values ('documents', 'documents', false)
-- on conflict do nothing;

-- Storage policies (apply in Storage > Policies):
-- SELECT: authenticated users
-- INSERT: authenticated users
-- DELETE: authenticated users
