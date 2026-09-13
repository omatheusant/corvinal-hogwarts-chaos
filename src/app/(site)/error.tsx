"use client";

import { useEffect } from "react";
import { LinkButton } from "@/components/ui/button";

export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-page flex min-h-[70vh] flex-col items-center justify-center gap-6 py-24 text-center">
      <p className="eyebrow">Algo saiu do previsto</p>
      <h1 className="font-display text-4xl text-ivory sm:text-5xl">
        Uma névoa cobriu esta página
      </h1>
      <p className="max-w-md font-serif text-muted">
        Não conseguimos carregar este conteúdo agora. Tente novamente em instantes.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={reset}
          className="border border-bronze bg-bronze px-6 py-3 font-sans text-sm text-ink hover:bg-bronze-soft"
        >
          Tentar novamente
        </button>
        <LinkButton href="/" variant="outline">
          Voltar para o início
        </LinkButton>
      </div>
    </div>
  );
}
