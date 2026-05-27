-- Publik chatlogg från 4days.ai Agent (landningssidan)
-- Endast skrivs/läses via service role (API) – ingen publik RLS-åtkomst

create table if not exists public.public_chat_sessions (
  id uuid primary key default gen_random_uuid(),
  visitor_session_id text not null unique,
  page_url text,
  user_agent text,
  message_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists public_chat_sessions_created_at_idx
  on public.public_chat_sessions (created_at desc);

create table if not exists public.public_chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.public_chat_sessions(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  sources jsonb,
  created_at timestamptz not null default now()
);

create index if not exists public_chat_messages_session_id_idx
  on public.public_chat_messages (session_id, created_at);

alter table public.public_chat_sessions enable row level security;
alter table public.public_chat_messages enable row level security;

-- Ingen policy för anon/authenticated → endast service role (bypass RLS)

create or replace function public.touch_public_chat_session()
returns trigger as $$
begin
  update public.public_chat_sessions
  set
    updated_at = now(),
    message_count = message_count + 1
  where id = new.session_id;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists public_chat_messages_touch_session on public.public_chat_messages;

create trigger public_chat_messages_touch_session
  after insert on public.public_chat_messages
  for each row execute function public.touch_public_chat_session();
