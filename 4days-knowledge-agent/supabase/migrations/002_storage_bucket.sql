-- Storage bucket for document uploads
-- Run after 001_initial_schema.sql

insert into storage.buckets (id, name, public, file_size_limit)
values ('documents', 'documents', false, 52428800)
on conflict (id) do nothing;

-- Authenticated users can upload
create policy "Authenticated upload documents"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'documents');

-- Authenticated users can read
create policy "Authenticated read documents"
  on storage.objects for select to authenticated
  using (bucket_id = 'documents');

-- Authenticated users can delete
create policy "Authenticated delete documents"
  on storage.objects for delete to authenticated
  using (bucket_id = 'documents');
