import Link from "next/link";
import { EagleMark } from "@/components/visual/eagle-mark";
import { NAV_LINKS } from "./nav-links";

export function Footer() {
  return (
    <footer className="relative border-t border-bronze/25 bg-navy/70 backdrop-blur-sm">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-bronze/70 to-transparent"
      />
      <div className="container-page grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 text-bronze">
            <EagleMark className="h-7 w-7" />
            <span className="font-display text-lg text-ivory">Corvinal</span>
          </div>
          <p className="max-w-xs font-sans text-sm text-muted">
            A Torre do Conhecimento — portal da Casa Corvinal em um RPG de Hogwarts.
          </p>
        </div>

        <nav aria-label="Navegação do rodapé" className="space-y-3">
          <p className="eyebrow">Explorar</p>
          <ul className="space-y-2 font-sans text-sm text-ivory/85">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-bronze-soft">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-3">
          <p className="eyebrow">A casa</p>
          <ul className="space-y-2 font-sans text-sm text-ivory/85">
            <li>
              <Link href="/a-casa#sala-comunal" className="hover:text-bronze-soft">
                Sala comunal
              </Link>
            </li>
            <li>
              <Link href="/a-casa#nosso-rpg" className="hover:text-bronze-soft">
                Nossa trajetória no RPG
              </Link>
            </li>
            <li>
              <Link href="/admin" className="hover:text-bronze-soft">
                Área administrativa
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <p className="eyebrow">Sobre este projeto</p>
          <p className="font-sans text-sm text-muted">
            Projeto de fãs, não oficial e sem fins lucrativos, criado para um RPG de mesa
            ambientado no universo de Hogwarts. Não associado à Warner Bros. ou a J.K. Rowling.
          </p>
        </div>
      </div>

      <div className="border-t border-border/70 py-6">
        <p className="container-page font-sans text-xs text-muted-foreground">
          Corvinal — A Torre do Conhecimento. Projeto de fãs para RPG de Hogwarts.
        </p>
      </div>
    </footer>
  );
}
