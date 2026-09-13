import type { ReactNode } from "react";

type ArchFrameProps = {
  children: ReactNode;
  className?: string;
  /** Cor do contorno; usa o token bronze por padrão. */
  outlineClassName?: string;
};

/**
 * Moldura em arco ogival (arco gótico apontado). Recorta o conteúdo com a
 * clipPath global `#corvinal-arch` (ver `SvgDefs`) e desenha um contorno
 * fino de bronze acompanhando exatamente o mesmo contorno.
 *
 * Usada em retratos de alunos, no painel do hero e em citações de destaque.
 */
export function ArchFrame({ children, className, outlineClassName }: ArchFrameProps) {
  return (
    <div className={`relative ${className ?? ""}`}>
      <div className="arch-frame h-full w-full overflow-hidden bg-navy">{children}</div>
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1 1"
        preserveAspectRatio="none"
      >
        <path
          d="M0,1 L0,0.24 Q0,0 0.5,0 Q1,0 1,0.24 L1,1 Z"
          fill="none"
          className={outlineClassName ?? "stroke-bronze/80"}
          strokeWidth={0.006}
        />
      </svg>
    </div>
  );
}
