import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { MEDIA_BUCKET } from "@/lib/supabase/storage";
import { extensionFromMime, validateMediaFile } from "@/lib/validations/media";

/**
 * Envia uma imagem para o bucket de mídia sob `folder/` e devolve o path
 * salvo (não a URL — URLs são resolvidas por signed URL na leitura, ver
 * `src/lib/supabase/storage.ts`). Lança um erro com mensagem amigável se o
 * arquivo não passar na validação de tipo/tamanho.
 */
export async function uploadMedia(
  supabase: SupabaseClient,
  folder: "students" | "posts" | "gallery",
  file: File,
): Promise<string> {
  const validation = validateMediaFile(file);
  if (!validation.ok) throw new Error(validation.message);

  const path = `${folder}/${crypto.randomUUID()}.${extensionFromMime(file.type)}`;

  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });

  if (error) throw new Error(`Falha ao enviar a imagem: ${error.message}`);

  return path;
}

export async function deleteMedia(supabase: SupabaseClient, path: string | null | undefined) {
  if (!path) return;
  await supabase.storage.from(MEDIA_BUCKET).remove([path]);
}
