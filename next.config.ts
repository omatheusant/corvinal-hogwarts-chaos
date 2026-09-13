import type { NextConfig } from "next";

/**
 * Permite ao next/image otimizar imagens do bucket de Storage do Supabase
 * usado pelo site (retratos de alunos, capas do mural, galeria de memórias).
 * O host é derivado de NEXT_PUBLIC_SUPABASE_URL, então funciona com
 * qualquer projeto Supabase sem hardcode.
 */
function supabaseStorageRemotePattern() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return [];

  try {
    const { hostname } = new URL(supabaseUrl);
    return [
      {
        protocol: "https" as const,
        hostname,
        // O bucket de mídia é privado; imagens são resolvidas via signed
        // URL (ver src/lib/supabase/storage.ts), não pela rota /public/.
        pathname: "/storage/v1/object/sign/**",
      },
    ];
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [...supabaseStorageRemotePattern()],
  },
  // O limite padrão de Server Actions é 1 MB — abaixo do próprio limite de
  // upload de imagem do site (5 MB, ver UPLOAD_LIMITS em
  // src/lib/validations/media.ts). 8 MB dá margem para o overhead do
  // multipart/form-data e os demais campos de texto do formulário.
  experimental: {
    serverActions: {
      bodySizeLimit: "8mb",
    },
  },
};

export default nextConfig;
