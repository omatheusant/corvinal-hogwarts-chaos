import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AdminSession = {
  userId: string;
  email: string | null;
  displayName: string | null;
};

/**
 * Checagem "segura" de autorização (não apenas otimista): confirma a sessão
 * com o Supabase Auth e, além disso, confere no banco (tabela
 * `admin_users`, protegida por RLS) que este usuário é de fato um
 * administrador autorizado. Um usuário autenticado comum que não esteja
 * nessa tabela nunca passa daqui — mesmo que o proxy já o deixe entrar em
 * /admin por estar logado.
 *
 * Use em toda página, Server Action e Route Handler do /admin que leia ou
 * escreva dados administrativos. Redireciona para /admin/login (sem
 * sessão) ou lança erro 403 (sessão válida, mas sem autorização — tratado
 * pela error boundary do /admin com uma mensagem clara).
 */
export async function requireAdmin(): Promise<AdminSession> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: adminRow } = await supabase
    .from("admin_users")
    .select("display_name")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!adminRow) {
    throw new Error(
      "Sua conta está autenticada, mas não tem permissão de administrador da Corvinal. Peça a um responsável pela casa para cadastrar seu usuário em admin_users.",
    );
  }

  return {
    userId: user.id,
    email: user.email ?? null,
    displayName: adminRow.display_name,
  };
}
