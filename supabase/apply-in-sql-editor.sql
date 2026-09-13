-- Corvinal — schema completo, para colar de uma vez no SQL Editor do
-- Supabase Studio (Project rccenblupxjfdihrfydo).
--
-- Este arquivo é apenas uma conveniência de aplicação: a fonte da verdade
-- versionada continua em supabase/migrations/*.sql (9 arquivos, na mesma
-- ordem concatenada aqui). Rode isso UMA VEZ, num projeto novo/vazio.
--
-- Tudo dentro de uma transação: se qualquer parte falhar (ex.: já existir
-- alguma dessas tabelas), nada é aplicado pela metade.

begin;

-- ============================================================
-- 20260912090001_extensions_and_helpers.sql
-- ============================================================
-- Extensões e funções auxiliares reutilizadas pelas migrations seguintes.
-- A função de autorização (`is_admin()`) fica em sua própria migration
-- (20260912090003_authorization.sql), depois de `admin_users` existir —
-- criá-la aqui antes da tabela existir falha, porque o Postgres valida a
-- existência das relações referenciadas já na criação de funções
-- `language sql`.

create extension if not exists pgcrypto with schema extensions;

-- Atualiza updated_at automaticamente em qualquer tabela que tenha a coluna
-- e um trigger `before update` apontando para esta função.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ============================================================
-- 20260912090002_admin_users.sql
-- ============================================================
-- Lista de administradores autorizados da casa. Não é uma tabela de perfis
-- geral: só existe para dizer "este usuário do Supabase Auth pode
-- administrar o site". Ver README para o provisionamento do primeiro
-- administrador (feito manualmente via SQL Editor/Studio, nunca pela
-- aplicação).
--
-- A política de leitura (que depende de `public.is_admin()`) fica na
-- migration seguinte, depois que essa função existir.
create table public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

-- ============================================================
-- 20260912090003_authorization.sql
-- ============================================================
-- Checagem central de autorização administrativa. SECURITY DEFINER evita
-- recursão de RLS ao consultar admin_users a partir das políticas de
-- outras tabelas (e da própria admin_users). Um usuário autenticado comum
-- nunca aparece em admin_users por conta própria: não há política de
-- INSERT/UPDATE/DELETE para o público nela — o primeiro administrador é
-- cadastrado manualmente (ver README).
--
-- Precisa vir depois de `admin_users` existir (migration anterior): uma
-- função `language sql` já tem a existência das relações referenciadas
-- validada no momento da criação, não só quando é chamada.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- Só administradores podem ler a própria lista (usado por
-- requireAdmin() para confirmar autorização).
create policy "admins can read admin_users"
  on public.admin_users for select
  using (public.is_admin());

-- ============================================================
-- 20260912090004_students.sql
-- ============================================================
create table public.students (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  school_year smallint check (school_year between 1 and 7),
  role_title text,
  status text not null default 'aluno' check (status in ('aluno', 'ex-aluno')),
  short_bio text,
  biography text,
  interests text[] not null default '{}',
  narrative_skills text[] not null default '{}',
  portrait_path text,
  published boolean not null default false,
  highlight_order integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index students_status_idx on public.students (status);
create index students_published_idx on public.students (published);
create index students_highlight_order_idx on public.students (highlight_order);

create trigger students_set_updated_at
  before update on public.students
  for each row execute function public.set_updated_at();

alter table public.students enable row level security;

-- Visitantes só leem alunos publicados.
create policy "public can read published students"
  on public.students for select
  using (published = true);

-- Administradores leem tudo, inclusive rascunhos.
create policy "admins can read all students"
  on public.students for select
  using (public.is_admin());

create policy "admins can insert students"
  on public.students for insert
  with check (public.is_admin());

create policy "admins can update students"
  on public.students for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "admins can delete students"
  on public.students for delete
  using (public.is_admin());

-- ============================================================
-- 20260912090005_posts.sql
-- ============================================================
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  category text not null check (category in ('aviso', 'evento', 'conquista', 'cronica')),
  title text not null,
  excerpt text,
  body text not null,
  cover_path text,
  author_label text,
  -- Data do acontecimento em si (para categoria "evento"), independente
  -- de published_at, que é quando o texto foi publicado no mural.
  event_date date,
  published boolean not null default false,
  published_at timestamptz,
  highlight_order integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index posts_category_idx on public.posts (category);
create index posts_published_idx on public.posts (published);
create index posts_published_at_idx on public.posts (published_at desc);

create trigger posts_set_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

-- Carimba published_at automaticamente na primeira vez que o post é
-- publicado, se o admin não tiver definido um valor manualmente.
create or replace function public.set_post_published_at()
returns trigger
language plpgsql
as $$
begin
  if new.published = true and new.published_at is null then
    new.published_at := now();
  end if;
  return new;
end;
$$;

create trigger posts_set_published_at
  before insert or update on public.posts
  for each row execute function public.set_post_published_at();

alter table public.posts enable row level security;

create policy "public can read published posts"
  on public.posts for select
  using (published = true);

create policy "admins can read all posts"
  on public.posts for select
  using (public.is_admin());

create policy "admins can insert posts"
  on public.posts for insert
  with check (public.is_admin());

create policy "admins can update posts"
  on public.posts for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "admins can delete posts"
  on public.posts for delete
  using (public.is_admin());

-- ============================================================
-- 20260912090006_gallery_items.sql
-- ============================================================
create table public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  caption text,
  image_path text not null,
  image_width integer,
  image_height integer,
  taken_at date,
  published boolean not null default false,
  highlight_order integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index gallery_items_published_idx on public.gallery_items (published);
create index gallery_items_taken_at_idx on public.gallery_items (taken_at desc);

create trigger gallery_items_set_updated_at
  before update on public.gallery_items
  for each row execute function public.set_updated_at();

alter table public.gallery_items enable row level security;

create policy "public can read published gallery items"
  on public.gallery_items for select
  using (published = true);

create policy "admins can read all gallery items"
  on public.gallery_items for select
  using (public.is_admin());

create policy "admins can insert gallery items"
  on public.gallery_items for insert
  with check (public.is_admin());

create policy "admins can update gallery items"
  on public.gallery_items for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "admins can delete gallery items"
  on public.gallery_items for delete
  using (public.is_admin());

-- ============================================================
-- 20260912090007_gallery_item_students.sql
-- ============================================================
-- Associação N:N entre itens de galeria e alunos retratados neles.
create table public.gallery_item_students (
  gallery_item_id uuid not null references public.gallery_items (id) on delete cascade,
  student_id uuid not null references public.students (id) on delete cascade,
  primary key (gallery_item_id, student_id)
);

create index gallery_item_students_student_idx on public.gallery_item_students (student_id);

alter table public.gallery_item_students enable row level security;

-- Visível publicamente só quando o item de galeria associado está
-- publicado (a visibilidade do próprio aluno é resolvida separadamente
-- pela RLS de `students` quando o join busca o nome).
create policy "public can read links of published gallery items"
  on public.gallery_item_students for select
  using (
    exists (
      select 1 from public.gallery_items g
      where g.id = gallery_item_id and g.published = true
    )
  );

create policy "admins can read all links"
  on public.gallery_item_students for select
  using (public.is_admin());

create policy "admins can insert links"
  on public.gallery_item_students for insert
  with check (public.is_admin());

create policy "admins can delete links"
  on public.gallery_item_students for delete
  using (public.is_admin());

-- ============================================================
-- 20260912090008_site_content.sql
-- ============================================================
-- Textos institucionais editáveis (introdução da home, história da casa,
-- Rowena Ravenclaw, sala comunal, trajetória no RPG etc.), identificados
-- por uma chave estável usada pelo código (ex.: 'casa_historia').
create table public.site_content (
  key text primary key,
  title text,
  body text,
  published boolean not null default false,
  updated_at timestamptz not null default now()
);

create trigger site_content_set_updated_at
  before update on public.site_content
  for each row execute function public.set_updated_at();

alter table public.site_content enable row level security;

create policy "public can read published site content"
  on public.site_content for select
  using (published = true);

create policy "admins can read all site content"
  on public.site_content for select
  using (public.is_admin());

create policy "admins can insert site content"
  on public.site_content for insert
  with check (public.is_admin());

create policy "admins can update site content"
  on public.site_content for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "admins can delete site content"
  on public.site_content for delete
  using (public.is_admin());

-- ============================================================
-- 20260912090009_storage.sql
-- ============================================================
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

commit;
