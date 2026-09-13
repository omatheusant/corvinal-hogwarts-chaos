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
