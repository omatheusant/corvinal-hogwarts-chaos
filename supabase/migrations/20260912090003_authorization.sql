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
