insert into storage.buckets (id, name, public)
values ('stock-images', 'stock-images', true)
on conflict (id) do update set public = true;

create policy "public can read stock images"
  on storage.objects for select
  using (bucket_id = 'stock-images');

create policy "service role can upload stock images"
  on storage.objects for insert
  with check (bucket_id = 'stock-images' and auth.role() = 'service_role');

create policy "service role can update stock images"
  on storage.objects for update
  using (bucket_id = 'stock-images' and auth.role() = 'service_role')
  with check (bucket_id = 'stock-images' and auth.role() = 'service_role');

create policy "service role can delete stock images"
  on storage.objects for delete
  using (bucket_id = 'stock-images' and auth.role() = 'service_role');
