import type { Metadata } from "next";
import Image from "next/image";
import { SectionHeading } from "@/components/site/section-heading";
import { CelestialDivider } from "@/components/visual/celestial-divider";
import { RichText } from "@/components/site/rich-text";
import { ArchFrame } from "@/components/visual/arch-frame";
import { LibraryScene } from "@/components/visual/illustrations";
import { getSiteContentMany } from "@/lib/data/site-content";
import { DEFAULT_CASA_CONTENT, resolveCasaContent } from "@/lib/content/casa";

export const metadata: Metadata = {
  title: "A Casa",
  description:
    "História e origem da Corvinal, Rowena Ravenclaw, a lenda do diadema, valores, símbolos, a sala comunal e a trajetória da casa em nosso RPG.",
};

const KEYS = [
  "casa_historia",
  "casa_rowena",
  "casa_diadema",
  "casa_valores",
  "casa_sala_comunal",
  "casa_nosso_rpg",
] as const;

export default async function ACasaPage() {
  const { data: content } = await getSiteContentMany([...KEYS]);

  // Cada seção sempre tem o que mostrar: usa o texto publicado pelo admin
  // quando existir (campo a campo — título e corpo podem ter sido
  // preenchidos em momentos diferentes), e cai no conteúdo padrão (mesma
  // história, sempre atualizada) quando algo ainda faltar.
  const historia = resolveCasaContent(content.casa_historia, DEFAULT_CASA_CONTENT.casa_historia);
  const rowena = resolveCasaContent(content.casa_rowena, DEFAULT_CASA_CONTENT.casa_rowena);
  const diadema = resolveCasaContent(content.casa_diadema, DEFAULT_CASA_CONTENT.casa_diadema);
  const valores = resolveCasaContent(content.casa_valores, DEFAULT_CASA_CONTENT.casa_valores);
  const salaComunal = resolveCasaContent(
    content.casa_sala_comunal,
    DEFAULT_CASA_CONTENT.casa_sala_comunal,
  );
  const nossoRpg = resolveCasaContent(content.casa_nosso_rpg, DEFAULT_CASA_CONTENT.casa_nosso_rpg);

  return (
    <div className="pb-28">
      <header className="container-page pt-20 pb-16 sm:pt-28">
        <p className="eyebrow">A Casa Corvinal</p>
        <h1 className="mt-4 max-w-2xl text-balance font-display text-4xl text-ivory sm:text-5xl">
          Uma torre erguida para quem faz perguntas
        </h1>
      </header>

      <section className="container-page grid gap-10 pb-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
        <div className="space-y-6">
          <SectionHeading eyebrow="Origem" title={historia.title} />
          <RichText content={historia.body} />
        </div>
        <ArchFrame className="aspect-4/5 w-full shadow-elevated">
          <Image
            src="/images/symbol.jpg"
            alt="Brasão da Corvinal: um corvo sobre um escudo azul, encimado por um elmo de cavaleiro"
            fill
            sizes="(min-width: 1024px) 480px, 90vw"
            className="object-cover [object-position:50%_38%]"
            priority
          />
        </ArchFrame>
      </section>

      <div className="container-page">
        <CelestialDivider />
      </div>

      <section className="container-page grid gap-10 py-20 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-16">
        <ArchFrame className="aspect-3/4 w-full max-w-sm justify-self-center shadow-elevated lg:justify-self-start">
          <Image
            src="/images/rowena.jpg"
            alt="Retrato de Rowena Ravenclaw, com um corvo pousado ao seu lado, em um corredor de arcos góticos"
            fill
            sizes="(min-width: 1024px) 400px, 85vw"
            className="object-cover [object-position:50%_18%]"
          />
        </ArchFrame>
        <div className="space-y-6">
          <SectionHeading eyebrow="A fundadora" title={rowena.title} />
          <RichText content={rowena.body} />
        </div>
      </section>

      {/* A lenda do diadema — leitura em coluna única, como uma página
          de livro antigo, para destacar o tom de história contada. */}
      <section className="border-t border-bronze/15 bg-navy/30 py-20 backdrop-blur-[2px]">
        <div className="container-page mx-auto max-w-2xl space-y-6 text-center">
          <SectionHeading
            eyebrow="Uma lenda da casa"
            title={diadema.title}
            align="center"
            className="mx-auto"
          />
          <div className="text-left">
            <RichText content={diadema.body} />
          </div>
        </div>
      </section>

      <div className="container-page">
        <CelestialDivider />
      </div>

      <section className="container-page grid gap-10 py-20 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-16">
        <ArchFrame className="aspect-4/5 w-full max-w-sm justify-self-center shadow-elevated lg:justify-self-start">
          <Image
            src="/images/background-image.jpg"
            alt="Broche de prata em forma de águia com uma safira azul ao centro, gravado com o lema da casa"
            fill
            sizes="(min-width: 1024px) 380px, 80vw"
            className="object-cover [object-position:40%_35%]"
          />
        </ArchFrame>
        <div className="space-y-6">
          <SectionHeading eyebrow="Identidade" title={valores.title} />
          <RichText content={valores.body} />
        </div>
      </section>

      <section
        id="sala-comunal"
        className="border-t border-bronze/15 bg-navy/40 py-20 backdrop-blur-[2px] scroll-mt-24"
      >
        <div className="container-page grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
          <ArchFrame className="aspect-3/4 w-full shadow-elevated lg:order-2">
            <Image
              src="/images/comunal.jpg"
              alt="A sala comunal da Corvinal, com sua cúpula de vitrais, escada em espiral e janelas em arco"
              fill
              sizes="(min-width: 1024px) 480px, 90vw"
              className="object-cover"
            />
          </ArchFrame>
          <div className="space-y-6 lg:order-1">
            <SectionHeading eyebrow="Onde vivemos" title={salaComunal.title} />
            <RichText content={salaComunal.body} />
          </div>
        </div>
      </section>

      <div className="container-page">
        <CelestialDivider />
      </div>

      <section id="nosso-rpg" className="container-page grid gap-10 py-20 scroll-mt-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
        <div className="space-y-6">
          <SectionHeading
            eyebrow="Nossa mesa"
            title={nossoRpg.title}
            description="Esta seção é sobre a nossa campanha — separada da história do universo original de Hogwarts."
          />
          <RichText content={nossoRpg.body} />
        </div>
        <ArchFrame className="aspect-4/3 w-full shadow-elevated">
          <LibraryScene className="h-full w-full" />
        </ArchFrame>
      </section>
    </div>
  );
}
