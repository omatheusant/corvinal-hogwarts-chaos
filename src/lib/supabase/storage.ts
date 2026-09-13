import type { SupabaseClient } from "@supabase/supabase-js";

export const MEDIA_BUCKET = "corvinal-media";

/** URL assinada válida por 24h — suficiente para uma página estática
 * revalidada periodicamente; renovada a cada nova renderização/revalidação. */
const SIGNED_URL_TTL_SECONDS = 60 * 60 * 24;

/**
 * O bucket de mídia é PRIVADO — imagens não são servidas pela URL
 * `/object/public/...` (que, em buckets públicos, ignora RLS por completo).
 * Em vez disso, cada imagem é resolvida com uma signed URL de curta
 * duração, gerada aqui no servidor. A geração da signed URL passa pelas
 * políticas de RLS de `storage.objects`: só é emitida se a linha da
 * tabela que referencia o arquivo (aluno, publicação ou item de galeria)
 * estiver publicada — visitantes nunca recebem link para um rascunho,
 * mesmo que o path vaze de alguma forma.
 */
export async function signedMediaUrl(
  supabase: SupabaseClient,
  path: string | null | undefined,
): Promise<string | null> {
  if (!path) return null;

  const { data, error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .createSignedUrl(path, SIGNED_URL_TTL_SECONDS);

  if (error || !data) return null;
  return data.signedUrl;
}

export const UPLOAD_LIMITS = {
  maxSizeBytes: 5 * 1024 * 1024,
  acceptedMimeTypes: ["image/jpeg", "image/png", "image/webp"] as const,
};
