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
