import { UPLOAD_LIMITS } from "@/lib/supabase/storage";

export type MediaValidationResult = { ok: true } | { ok: false; message: string };

/** Validação de tipo e tamanho no servidor antes de qualquer upload para o
 * Storage — nunca confiar só na validação de `accept` do input de arquivo. */
export function validateMediaFile(file: File | null): MediaValidationResult {
  if (!file || file.size === 0) {
    return { ok: false, message: "Selecione um arquivo de imagem." };
  }
  if (!UPLOAD_LIMITS.acceptedMimeTypes.includes(file.type as never)) {
    return {
      ok: false,
      message: "Formato não suportado. Envie uma imagem JPEG, PNG ou WebP.",
    };
  }
  if (file.size > UPLOAD_LIMITS.maxSizeBytes) {
    return { ok: false, message: "A imagem deve ter no máximo 5 MB." };
  }
  return { ok: true };
}

export function extensionFromMime(mime: string): string {
  switch (mime) {
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    default:
      return "jpg";
  }
}
