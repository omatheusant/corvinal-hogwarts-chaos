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
