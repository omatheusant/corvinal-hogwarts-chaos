import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";
import { supabaseAnonOrPublishableKey } from "@/lib/env";

/**
 * Cliente Supabase para Client Components (ex.: formulário de login do
 * /admin). Usa apenas a chave publishable/anon e respeita RLS. Nunca
 * importar uma chave secreta a partir daqui.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseAnonOrPublishableKey()!,
  );
}
