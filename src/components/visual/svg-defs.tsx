/**
 * Definições SVG globais compartilhadas pela identidade visual da Corvinal:
 * a clipPath do arco ogival (usada por `ArchFrame`/`.arch-frame`) e o
 * gradiente estrelado usado em composições noturnas. Renderizado uma única
 * vez no layout raiz, sem exibição própria (width/height 0).
 *
 * O arco é desenhado em coordenadas normalizadas (objectBoundingBox), então
 * se adapta à proporção real de qualquer elemento que o utilize — retratos
 * verticais, painéis do hero, molduras de citação.
 */
export function SvgDefs() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="0"
      height="0"
      style={{ position: "absolute" }}
    >
      <defs>
        <clipPath id="corvinal-arch" clipPathUnits="objectBoundingBox">
          <path d="M0,1 L0,0.24 Q0,0 0.5,0 Q1,0 1,0.24 L1,1 Z" />
        </clipPath>
        <radialGradient id="corvinal-glow" cx="50%" cy="0%" r="75%">
          <stop offset="0%" stopColor="#B08A57" stopOpacity="0.35" />
          <stop offset="45%" stopColor="#142742" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#080F1C" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}
