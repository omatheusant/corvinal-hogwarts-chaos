import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";
import { isSupabaseConfigured, supabaseAnonOrPublishableKey } from "@/lib/env";

/**
 * Cliente Supabase para Server Components, Server Actions e Route Handlers.
 * Usa a chave publishable/anon (nunca a secret/service_role) e respeita
 * RLS. Lança um erro claro se chamado sem configuração — quem chama deve
 * checar `isSupabaseConfigured()` antes (a camada de dados em
 * `src/lib/data` já faz isso).
 */
export async function createClient() {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase não configurado: defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
    );
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseAnonOrPublishableKey()!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Chamado a partir de um Server Component sem permissão de
            // escrita em cookies — inofensivo porque o proxy já refresca a
            // sessão a cada request.
          }
        },
      },
    },
  );
}
