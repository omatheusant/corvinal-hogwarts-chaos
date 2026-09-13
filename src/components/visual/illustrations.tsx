type IllustrationProps = {
  className?: string;
  title?: string;
};

/**
 * Composições atmosféricas autorais em SVG — usadas no hero, como capa de
 * publicações sem imagem cadastrada e como ilustração de itens de galeria
 * de demonstração. Não são fotografias: leem-se claramente como
 * ilustração/cartografia celeste, nunca fingindo ser um retrato real.
 *
 * Paleta fixa (tokens da Corvinal), sem dependência de imagens externas.
 */

function Stars({ seed = 0 }: { seed?: number }) {
  const points = [
    [8, 12], [22, 28], [40, 8], [58, 22], [74, 12], [88, 30],
    [14, 46], [34, 52], [63, 48], [82, 55], [50, 34], [30, 16],
  ];
  return (
    <g className="text-parchment/70">
      {points.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={((y as number) + seed) % 60}
          r={i % 3 === 0 ? 0.9 : 0.5}
          fill="currentColor"
          className="animate-twinkle"
          style={{ animationDelay: `${i * 0.4}s` }}
        />
      ))}
    </g>
  );
}

export function TowerWindowScene({ className, title = "A torre da Corvinal sob o céu noturno" }: IllustrationProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-label={title}>
      <rect width="100" height="100" fill="#080F1C" />
      <rect width="100" height="60" fill="url(#corvinal-glow)" />
      <Stars />
      <path d="M50 8 8 46v46h84V46Z" fill="#142742" stroke="#B08A57" strokeWidth="0.6" />
      <path d="M50 8 20 46h60Z" fill="#1a3050" stroke="#B08A57" strokeWidth="0.6" />
      <path
        d="M50 24v10 M42 34h16 M46 34v20h8V34"
        stroke="#B08A57"
        strokeWidth="0.6"
        fill="none"
      />
      <path d="M46 54Q50 50 54 54v18H46Z" fill="#0b1830" stroke="#B08A57" strokeWidth="0.5" />
    </svg>
  );
}

export function TelescopeScene({ className, title = "Instrumentos astronômicos da Torre Oeste" }: IllustrationProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-label={title}>
      <rect width="100" height="100" fill="#080F1C" />
      <Stars seed={5} />
      <circle cx="70" cy="18" r="10" fill="none" stroke="#B08A57" strokeWidth="0.4" opacity="0.6" />
      <circle cx="70" cy="18" r="16" fill="none" stroke="#B08A57" strokeWidth="0.3" opacity="0.35" />
      <path d="M30 90 60 40" stroke="#8b96a8" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M22 96 40 84" stroke="#344B67" strokeWidth="3" strokeLinecap="round" />
      <circle cx="60" cy="40" r="3.4" fill="#B08A57" />
    </svg>
  );
}

export function LibraryScene({ className, title = "Estantes da biblioteca da Corvinal" }: IllustrationProps) {
  const shelves = [18, 40, 62, 84];
  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-label={title}>
      <rect width="100" height="100" fill="#0b1830" />
      <rect width="100" height="100" fill="url(#corvinal-glow)" opacity="0.5" />
      {shelves.map((y, row) => (
        <g key={y}>
          <line x1="6" y1={y} x2="94" y2={y} stroke="#B08A57" strokeWidth="0.5" />
          {Array.from({ length: 10 }).map((_, i) => (
            <rect
              key={i}
              x={8 + i * 8.6}
              y={y - 14}
              width={3 + ((i + row) % 3)}
              height="14"
              fill={i % 2 === 0 ? "#344B67" : "#1a3050"}
              stroke="#B08A5766"
              strokeWidth="0.3"
            />
          ))}
        </g>
      ))}
    </svg>
  );
}

export function CommonRoomScene({ className, title = "Sala comunal da Corvinal, à luz de velas" }: IllustrationProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-label={title}>
      <rect width="100" height="100" fill="#0b1830" />
      <ellipse cx="50" cy="90" rx="46" ry="10" fill="#080F1C" />
      <path d="M20 90V50a30 30 0 0 1 60 0v40" fill="none" stroke="#344B67" strokeWidth="1" />
      <circle cx="50" cy="30" r="14" fill="none" stroke="#B08A57" strokeWidth="0.5" opacity="0.7" />
      <circle cx="30" cy="70" r="2.6" fill="#B08A57" className="animate-twinkle" />
      <circle cx="70" cy="66" r="2.2" fill="#c9a877" className="animate-twinkle" style={{ animationDelay: "0.6s" }} />
      <rect x="26" y="72" width="6" height="10" fill="#1a3050" stroke="#B08A5755" strokeWidth="0.3" />
      <rect x="66" y="68" width="6" height="14" fill="#1a3050" stroke="#B08A5755" strokeWidth="0.3" />
    </svg>
  );
}

export function HeroScene({ className, title = "A Torre da Corvinal recortada contra o céu noturno" }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 160 100"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label={title}
    >
      <rect width="160" height="100" fill="#080F1C" />
      <rect width="160" height="100" fill="url(#corvinal-glow)" opacity="0.8" />
      <g className="text-parchment/60">
        {[
          [10, 10], [140, 14], [70, 6], [30, 22], [110, 24], [150, 34], [6, 30], [50, 12],
          [90, 16], [130, 8], [22, 40], [100, 38], [60, 30], [120, 46],
        ].map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={i % 4 === 0 ? 1 : 0.55}
            fill="currentColor"
            className="animate-twinkle"
            style={{ animationDelay: `${i * 0.35}s` }}
          />
        ))}
      </g>

      {/* Silhueta de torres ao fundo */}
      <path d="M0 100V70l14-10 4 4 4-4 14 10v30Z" fill="#0b1830" opacity="0.9" />
      <path d="M160 100V64l-16-11-5 5-5-5-16 11v36Z" fill="#0b1830" opacity="0.9" />

      {/* Torre central com janela ogival, alinhada ao ArchFrame da identidade */}
      <path d="M55 100V38l25-24 25 24v62Z" fill="#142742" stroke="#B08A57" strokeWidth="0.5" />
      <path
        d="M69 100V52 Q69 44 80 44 Q91 44 91 52 V100"
        fill="#080F1C"
        stroke="#B08A57"
        strokeWidth="0.5"
      />
      <path d="M80 44v56M69 74h22" stroke="#B08A5788" strokeWidth="0.4" />
      <circle cx="80" cy="30" r="1.4" fill="#c9a877" className="animate-twinkle" />

      {/* Linha de horizonte em bronze, referência de cartografia celeste */}
      <path d="M0 92h160" stroke="#B08A5744" strokeWidth="0.4" />
    </svg>
  );
}

export function MapScene({ className, title = "Mapa celeste desenhado à mão" }: IllustrationProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-label={title}>
      <rect width="100" height="100" fill="#D7C9AD" />
      <circle cx="50" cy="50" r="38" fill="none" stroke="#080F1C" strokeWidth="0.4" opacity="0.5" />
      <circle cx="50" cy="50" r="26" fill="none" stroke="#080F1C" strokeWidth="0.3" opacity="0.4" />
      <path d="M50 12v76M12 50h76" stroke="#080F1C" strokeWidth="0.3" opacity="0.35" />
      <g fill="#080F1C" opacity="0.75">
        <circle cx="34" cy="30" r="0.8" />
        <circle cx="66" cy="26" r="0.6" />
        <circle cx="70" cy="60" r="0.9" />
        <circle cx="38" cy="70" r="0.6" />
        <circle cx="58" cy="42" r="0.7" />
      </g>
      <path d="M34 30 58 42 70 60" fill="none" stroke="#B08A57" strokeWidth="0.4" />
    </svg>
  );
}
