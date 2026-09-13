-- Bucket único para toda a mídia do site (retratos, capas do mural,
-- galeria de memórias). É PRIVADO de propósito: buckets públicos no
-- Supabase Storage servem qualquer objeto por URL direta ignorando RLS
-- por completo, o que tornaria impossível esconder rascunhos. Aqui,
-- imagens são resolvidas por signed URL gerada no servidor (ver
-- src/lib/supabase/storage.ts), o que respeita as políticas abaixo.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'corvinal-media',
  'corvinal-media',
  false,
  5242880, -- 5 MB
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

-- Leitura pública (via signed URL) de um arquivo só é possível quando ele
-- é, de fato, referenciado por uma linha PUBLICADA em students, posts ou
-- gallery_items. Um retrato de rascunho, por exemplo, não tem política de
-- SELECT aplicável para o papel anônimo — createSignedUrl() falha, e a
-- imagem simplesmente não é exibida.
create policy "public can read media of published content"
  on storage.objects for select
  using (
    bucket_id = 'corvinal-media'
    and (
      exists (
        select 1 from public.students s
        where s.portrait_path = storage.objects.name and s.published = true
      )
      or exists (
        select 1 from public.posts p
        where p.cover_path = storage.objects.name and p.published = true
      )
      or exists (
        select 1 from public.gallery_items g
        where g.image_path = storage.objects.name and g.published = true
      )
    )
  );

create policy "admins can read all media"
  on storage.objects for select
  using (bucket_id = 'corvinal-media' and public.is_admin());

create policy "admins can upload media"
  on storage.objects for insert
  with check (bucket_id = 'corvinal-media' and public.is_admin());

create policy "admins can update media"
  on storage.objects for update
  using (bucket_id = 'corvinal-media' and public.is_admin())
  with check (bucket_id = 'corvinal-media' and public.is_admin());

create policy "admins can delete media"
  on storage.objects for delete
  using (bucket_id = 'corvinal-media' and public.is_admin());
