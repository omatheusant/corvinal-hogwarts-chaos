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
