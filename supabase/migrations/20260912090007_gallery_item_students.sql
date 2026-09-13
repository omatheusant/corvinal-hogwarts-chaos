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
