import type { Metadata } from "next";
import { EagleMark } from "@/components/visual/eagle-mark";
import { LoginForm } from "@/components/admin/login-form";
import { SetupGuidance } from "@/components/admin/setup-guidance";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Entrar" };
export const dynamic = "force-dynamic";

export default async function AdminLoginPage(props: PageProps<"/admin/login">) {
  const searchParams = await props.searchParams;
  const redirectTo = typeof searchParams.redirectTo === "string" ? searchParams.redirectTo : undefined;

  if (!isSupabaseConfigured()) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink px-4 py-16">
        <SetupGuidance />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4 py-16">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <EagleMark className="h-10 w-10 text-bronze" />
          <h1 className="font-display text-2xl text-ivory">Administração da Corvinal</h1>
          <p className="font-sans text-sm text-muted">
            Acesso restrito a responsáveis pela casa.
          </p>
        </div>
        <LoginForm redirectTo={redirectTo} />
      </div>
    </div>
  );
}
