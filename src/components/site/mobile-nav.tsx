"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { Dialog } from "@/components/ui/dialog";
import { EagleMark } from "@/components/visual/eagle-mark";
import { NAV_LINKS } from "./nav-links";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const titleId = useId();

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="flex flex-col gap-1.5 p-2 text-ivory"
      >
        <span className="sr-only">Abrir menu de navegação</span>
        <span aria-hidden="true" className="block h-px w-6 bg-bronze" />
        <span aria-hidden="true" className="block h-px w-6 bg-bronze" />
        <span aria-hidden="true" className="block h-px w-4 bg-bronze" />
      </button>

      <Dialog open={open} onClose={() => setOpen(false)} labelledBy={titleId} className="h-full w-full">
        <div className="flex h-full w-full flex-col bg-ink px-6 py-8">
          <div className="flex items-center justify-between">
            <span id={titleId} className="eyebrow">
              Navegação · Corvinal
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-2 font-sans text-sm text-ivory hover:text-bronze-soft"
            >
              Fechar
            </button>
          </div>

          <nav className="mt-12 flex flex-1 flex-col justify-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-display text-4xl text-ivory transition-colors hover:text-bronze-soft"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 text-bronze/70">
            <EagleMark className="h-8 w-8" />
            <span className="font-display text-lg">Casa Corvinal</span>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
