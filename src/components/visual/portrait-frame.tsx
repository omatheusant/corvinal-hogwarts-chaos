import Image from "next/image";
import { ArchFrame } from "./arch-frame";

type PortraitFrameProps = {
  src?: string | null;
  alt: string;
  name: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

function initialsFrom(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0] + parts[parts.length - 1]![0]).toUpperCase();
}

/**
 * Retrato em moldura ogival. Quando não há imagem cadastrada, exibe um
 * monograma discreto sobre um fundo estrelado no lugar de uma foto —
 * nunca substituímos o rosto de um personagem por uma imagem aleatória.
 */
export function PortraitFrame({
  src,
  alt,
  name,
  className = "aspect-[3/4] w-full",
  sizes = "(min-width: 1024px) 320px, 45vw",
  priority,
}: PortraitFrameProps) {
  return (
    <ArchFrame className={className}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-linear-to-b from-navy to-ink">
          <span
            aria-hidden="true"
            className="font-display text-4xl tracking-widest text-bronze/80"
          >
            {initialsFrom(name)}
          </span>
          <svg width="28" height="14" viewBox="0 0 28 14" aria-hidden="true" className="text-bronze/50">
            <path d="M2 10c4-8 8-8 12 0M14 10c4-8 8-8 12 0" stroke="currentColor" strokeWidth="1" fill="none" />
          </svg>
          <span className="sr-only">Retrato ainda não cadastrado para {name}</span>
        </div>
      )}
    </ArchFrame>
  );
}
