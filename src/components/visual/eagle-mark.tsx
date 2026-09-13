type EagleMarkProps = {
  className?: string;
  title?: string;
};

/**
 * Símbolo da casa: uma águia estilizada em linha, desenhada como marca
 * heráldica simples — asas abertas sobre um losango, referência discreta ao
 * brasão da Corvinal sem reproduzir marca registrada de terceiros.
 */
export function EagleMark({ className, title = "Símbolo da Corvinal" }: EagleMarkProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label={title}
      fill="none"
    >
      <path
        d="M32 6c2.5 4 4 8.5 4 13"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M32 19c-9 -3 -18 -1 -27 6 8 1.5 14 4.5 18.5 9.5C19 32 13 31 6 33c9 4 16 3 22 -2 2 3 2 7 1 12 3 -3 5 -7 5 -12"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M32 19c9 -3 18 -1 27 6 -8 1.5 -14 4.5 -18.5 9.5C45 32 51 31 58 33c-9 4 -16 3 -22 -2 -2 3 -2 7 -1 12 -3 -3 -5 -7 -5 -12"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx="32" cy="19" r="2.2" fill="currentColor" />
      <path
        d="M32 43v9m-5 3h10"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
