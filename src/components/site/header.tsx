import Link from "next/link";
import { EagleMark } from "@/components/visual/eagle-mark";
import { MobileNav } from "./mobile-nav";
import { NAV_LINKS } from "./nav-links";

/**
 * Cabeçalho `sticky`: permanece visível ao rolar sem exigir JavaScript
 * nem observadores de scroll. O fundo semitransparente com desfoque já
 * garante contraste legível sobre qualquer cena do hero, em qualquer
 * posição de rolagem — mais robusto que alternar estilos via scroll
 * listener, e funciona igual com JS desabilitado ou reduced motion.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-bronze/25 bg-ink/80 shadow-soft backdrop-blur-md">
      <div className="container-page flex h-18 items-center justify-between py-4">
        <Link href="/" className="group flex items-center gap-3">
          <EagleMark className="h-8 w-8 text-bronze transition-transform duration-300 group-hover:scale-110" />
          <span className="font-display text-xl tracking-wide text-ivory">
            Corvinal
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Navegação principal">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative font-sans text-sm tracking-wide text-ivory/85 transition-colors hover:text-bronze-soft after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-bronze-soft after:transition-all after:duration-300 hover:after:w-full"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <MobileNav />
      </div>
    </header>
  );
}
