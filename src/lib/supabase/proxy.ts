import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured, supabaseAnonOrPublishableKey } from "@/lib/env";

/**
 * Refresca a sessão Supabase a cada request e devolve o usuário atual, para
 * uso em `src/proxy.ts` (Next.js 16 renomeou `middleware.ts` para
 * `proxy.ts` — mesma função, novo nome). Segue o padrão oficial de SSR do
 * Supabase, adaptado à API de cookies de NextRequest/NextResponse.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  if (!isSupabaseConfigured()) {
    return { response, user: null, configured: false as const };
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseAnonOrPublishableKey()!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // getUser() valida o token com o servidor Supabase (ao contrário de
  // getSession(), que só lê o cookie) — necessário para uma checagem de
  // autenticação confiável aqui no proxy.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { response, user, configured: true as const };
}
