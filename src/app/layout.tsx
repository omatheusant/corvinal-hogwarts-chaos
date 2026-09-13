import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Cormorant_Garamond, Source_Serif_4, Inter } from "next/font/google";
import { SvgDefs } from "@/components/visual/svg-defs";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Corvinal — A Torre do Conhecimento",
    template: "%s · Corvinal",
  },
  description:
    "Portal da Casa Corvinal: história, alunos, mural de acontecimentos e memórias de um RPG de Hogwarts.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${cormorant.variable} ${sourceSerif.variable} ${inter.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-ink text-ivory antialiased">
        <SvgDefs />
        <a
          href="#conteudo-principal"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-bronze focus:px-4 focus:py-2 focus:text-ink focus:font-sans focus:text-sm"
        >
          Pular para o conteúdo principal
        </a>
        {children}
      </body>
    </html>
  );
}
