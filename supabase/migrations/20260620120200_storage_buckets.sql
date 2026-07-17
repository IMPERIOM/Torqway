-- =============================================================================
-- BoxSpace Containers — Storage buckets
--   product-media : product images & videos
--   project-media : project showcase galleries
-- Both are public-read; writes are restricted to admins (customers.is_admin).
-- =============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('product-media', 'product-media', true, 524288000,
    array['image/jpeg','image/png','image/webp','image/avif','image/gif','video/mp4','video/webm']),
  ('project-media', 'project-media', true, 524288000,
    array['image/jpeg','image/png','image/webp','image/avif','image/gif','video/mp4','video/webm'])
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Public read for both buckets -----------------------------------------------
drop policy if exists "media public read" on storage.objects;
create policy "media public read" on storage.objects
  for select
  using (bucket_id in ('product-media', 'project-media'));

-- Admin-only writes -----------------------------------------------------------
drop policy if exists "media admin insert" on storage.objects;
create policy "media admin insert" on storage.objects
  for insert to authenticated
  with check (bucket_id in ('product-media', 'project-media') and public.is_admin());

drop policy if exists "media admin update" on storage.objects;
create policy "media admin update" on storage.objects
  for update to authenticated
  using (bucket_id in ('product-media', 'project-media') and public.is_admin())
  with check (bucket_id in ('product-media', 'project-media') and public.is_admin());

drop policy if exists "media admin delete" on storage.objects;
create policy "media admin delete" on storage.objects
  for delete to authenticated
  using (bucket_id in ('product-media', 'project-media') and public.is_admin());
