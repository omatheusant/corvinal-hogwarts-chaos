/**
 * O site público precisa abrir mesmo sem Supabase configurado (modo de
 * demonstração explícito). Esta função é a única fonte de verdade sobre
 * "Supabase está configurado" — usada tanto pela camada de dados quanto
 * pelo /admin para decidir entre operar normalmente ou mostrar orientação.
 *
 * Importante: isto só cobre a AUSÊNCIA de configuração. Uma falha de rede
 * ou de credenciais inválidas com as variáveis presentes NÃO deve cair
 * silenciosamente em modo demo — deve estourar o erro normalmente (ver
 * `src/app/(site)/error.tsx` e os try/catch da camada de dados).
 */

/**
 * Supabase vem migrando de chaves legadas (`anon`, formato JWT) para o
 * novo sistema de chaves (`publishable`, string curta `sb_publishable_...`).
 * Aceitamos as duas variáveis — `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
 * (nome atual no dashboard do Supabase) tem prioridade, com
 * `NEXT_PUBLIC_SUPABASE_ANON_KEY` como alternativa para projetos que ainda
 * usam a chave legada. Em ambos os casos, o valor é passado do mesmo jeito
 * para `createBrowserClient`/`createServerClient` — só o formato do valor
 * muda, não a API.
 */
export function supabaseAnonOrPublishableKey(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = supabaseAnonOrPublishableKey();

  if (!url || !key) return false;
  if (url.includes("your-project") || key.includes("your-publishable") || key.includes("your-anon")) {
    return false;
  }

  return true;
}

export function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}
