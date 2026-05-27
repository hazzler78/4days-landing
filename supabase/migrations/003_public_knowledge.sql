-- Tillåt repo-seedade kunskapsdokument utan inloggad användare
alter table public.documents alter column user_id drop not null;

comment on column public.documents.user_id is
  'Null för publik kunskapsbas seedad från knowledge/ i git.';
