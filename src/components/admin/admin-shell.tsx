import Link from "next/link";
import { EagleMark } from "@/components/visual/eagle-mark";
import { signOutAction } from "@/app/admin/actions";
import { ADMIN_NAV_LINKS } from "./admin-nav-links";
import type { AdminSession } from "@/lib/admin/authorize";

/**
 * Casca visual do /admin — deliberadamente mais simples que o site
 * público (menos composição editorial, mais utilitária), mas usando a
 * mesma paleta da casa para continuar reconhecível como Corvinal.
 */
export function AdminShell({
  session,
  children,
}: {
  session: AdminSession;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-ink text-ivory">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="border-b border-border bg-navy/60 px-6 py-6 lg:w-64 lg:shrink-0 lg:border-r lg:border-b-0">
          <Link href="/admin" className="flex items-center gap-2">
            <EagleMark className="h-7 w-7 text-bronze" />
            <span className="font-display text-lg">Corvinal · Admin</span>
          </Link>

          <nav className="mt-8 flex flex-row flex-wrap gap-2 lg:flex-col lg:gap-1" aria-label="Navegação administrativa">
            {ADMIN_NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-sm px-3 py-2 font-sans text-sm text-ivory/85 hover:bg-ink hover:text-bronze-soft"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-8 space-y-3 border-t border-border pt-4">
            <p className="font-sans text-xs text-muted-foreground">
              {session.displayName ?? session.email ?? "Administrador"}
            </p>
            <form action={signOutAction}>
              <button type="submit" className="font-sans text-xs text-bronze-soft hover:underline">
                Sair
              </button>
            </form>
            <Link href="/" className="block font-sans text-xs text-muted hover:text-bronze-soft">
              ← Ver site público
            </Link>
          </div>
        </aside>

        <main className="flex-1 px-6 py-10 sm:px-10">{children}</main>
      </div>
    </div>
  );
}
