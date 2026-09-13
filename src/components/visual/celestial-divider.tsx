import type { CSSProperties } from "react";

type CelestialDividerProps = {
  className?: string;
  style?: CSSProperties;
};

/**
 * Divisória ornamental inspirada em cartas celestes: uma linha fina de
 * bronze com um pequeno arranjo de "estrelas" e uma constelação estilizada
 * ao centro. Puramente decorativo (aria-hidden).
 */
export function CelestialDivider({ className, style }: CelestialDividerProps) {
  return (
    <div
      aria-hidden="true"
      style={style}
      className={`flex items-center gap-4 text-bronze/70 ${className ?? ""}`}
    >
      <span className="h-px flex-1 bg-linear-to-r from-transparent to-bronze/60" />
      <svg width="72" height="20" viewBox="0 0 72 20" fill="none">
        <path
          d="M4 10h16M52 10h16"
          stroke="currentColor"
          strokeWidth="1"
        />
        <path
          d="M22 10l6 -5 6 5 6 -5 6 5"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="22" cy="10" r="1.6" fill="currentColor" />
        <circle cx="28" cy="5" r="1.2" fill="currentColor" />
        <circle cx="34" cy="10" r="1.8" fill="currentColor" />
        <circle cx="40" cy="5" r="1.2" fill="currentColor" />
        <circle cx="46" cy="10" r="1.6" fill="currentColor" />
      </svg>
      <span className="h-px flex-1 bg-linear-to-l from-transparent to-bronze/60" />
    </div>
  );
}
