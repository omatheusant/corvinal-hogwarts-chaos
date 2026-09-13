import Link from "next/link";

/**
 * 404 de nível raiz — usado fora do grupo (site) (ex.: /admin/qualquer-coisa
 * sem página). Deliberadamente simples e sem depender do layout público.
 */
export default function RootNotFound() {
  return (
    <html lang="pt-BR">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ink px-4 text-center text-ivory">
        <p className="font-sans text-xs tracking-widest text-bronze uppercase">
          Corvinal · 404
        </p>
        <h1 className="font-serif text-2xl">Página não encontrada</h1>
        <Link href="/" className="font-sans text-sm text-bronze-soft hover:underline">
          Voltar para o início
        </Link>
      </body>
    </html>
  );
}
