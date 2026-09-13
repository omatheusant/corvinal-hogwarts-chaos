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
