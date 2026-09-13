import Link from "next/link";
import { CelestialDivider } from "@/components/visual/celestial-divider";
import { LinkButton } from "@/components/ui/button";

export default function SiteNotFound() {
  return (
    <div className="container-page flex min-h-[70vh] flex-col items-center justify-center gap-6 py-24 text-center">
      <p className="eyebrow">Página não encontrada</p>
      <h1 className="font-display text-4xl text-ivory sm:text-5xl">
        Este corredor da Torre ainda não foi mapeado
      </h1>
      <p className="max-w-md font-serif text-muted">
        A página que você procura pode ter sido movida, renomeada ou nunca ter existido.
      </p>
      <CelestialDivider className="max-w-xs" />
      <div className="flex flex-col gap-3 sm:flex-row">
        <LinkButton href="/" variant="primary">
          Voltar para o início
        </LinkButton>
        <Link href="/alunos" className="self-center font-sans text-sm text-bronze-soft hover:underline">
          Ver alunos
        </Link>
      </div>
    </div>
  );
}
