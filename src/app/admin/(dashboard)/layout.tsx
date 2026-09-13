import type { ReactNode } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { SetupGuidance } from "@/components/admin/setup-guidance";
import { requireAdmin } from "@/lib/admin/authorize";
import { isSupabaseConfigured } from "@/lib/env";

// A área administrativa depende de sessão/cookies em cada requisição e
// nunca deve ser pré-renderizada estaticamente — inclusive em builds sem
// Supabase configurado, quando ainda nem haveria o que renderizar.
export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({ children }: { children: ReactNode }) {
  if (!isSupabaseConfigured()) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink px-4 py-16">
        <SetupGuidance />
      </div>
    );
  }

  // Checagem "segura" de sessão + cargo de administrador, verificada no
  // servidor e contra o banco (ver src/lib/admin/authorize.ts) — o proxy
  // só faz o redirecionamento otimista.
  const session = await requireAdmin();

  return <AdminShell session={session}>{children}</AdminShell>;
}
