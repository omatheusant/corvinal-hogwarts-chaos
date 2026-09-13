"use client";

/**
 * Error boundary de última instância — só é acionado se o layout raiz em
 * si falhar. Precisa renderizar <html>/<body> porque substitui o layout
 * inteiro nesse cenário.
 */
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="pt-BR">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#080F1C] px-4 text-center text-[#E9E2D5]">
        <h1 className="text-2xl">Algo deu muito errado</h1>
        <p className="text-sm opacity-80">Tente recarregar a página.</p>
        <button
          type="button"
          onClick={reset}
          className="border border-[#B08A57] px-5 py-2 text-sm"
        >
          Tentar novamente
        </button>
      </body>
    </html>
  );
}
