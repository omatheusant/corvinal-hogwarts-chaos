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
