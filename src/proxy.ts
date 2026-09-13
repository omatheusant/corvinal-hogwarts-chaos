import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

/**
 * Protege /admin/*: refresca a sessão e redireciona quem não está
 * autenticado para /admin/login. Esta é só a checagem otimista de
 * primeira camada — cada Server Component e Server Action do admin também
 * valida a sessão e o cargo de administrador por conta própria (ver
 * `src/lib/admin/authorize.ts`); nunca confiar apenas neste redirect.
 *
 * Sem Supabase configurado, deixamos passar: o layout do /admin mostra a
 * orientação de configuração em vez de travar aqui.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginRoute = pathname === "/admin/login";

  const { response, user, configured } = await updateSession(request);

  if (!configured) {
    return response;
  }

  if (!isLoginRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    url.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(url);
  }

  if (isLoginRoute && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
