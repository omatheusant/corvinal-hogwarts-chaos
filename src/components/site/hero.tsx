import Image from "next/image";
import { LinkButton } from "@/components/ui/button";
import { CelestialDivider } from "@/components/visual/celestial-divider";

/**
 * O hero soma sua própria imagem (nitidamente mais revelada que no resto
 * do site) e um degradê dedicado por cima do pano de fundo global — o
 * broche da águia, símbolo da casa, em primeiro plano logo na entrada.
 */
export function Hero() {
  return (
    <section className="relative flex min-h-[92svh] items-end overflow-hidden sm:min-h-screen">
      <Image
        src="/images/background-image.jpg"
        alt="Broche de prata em forma de águia, com uma safira azul ao centro — símbolo da Casa Corvinal"
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-90 [object-position:42%_28%]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-t from-ink from-5% via-ink/45 via-55% to-ink/5"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-r from-ink/70 via-transparent to-ink/30"
      />

      <div className="container-page relative z-10 max-w-3xl space-y-6 pb-16 pt-32 sm:pb-24">
        <p className="eyebrow animate-fade-in">Hogwarts · Casa Corvinal</p>
        <h1 className="animate-fade-up text-balance font-display text-5xl leading-[1.08] text-ivory drop-shadow-[0_2px_18px_rgba(0,0,0,0.65)] sm:text-6xl lg:text-7xl">
          Há mundos que só a curiosidade abre.
        </h1>
        <p
          className="animate-fade-up max-w-xl text-balance font-serif text-base leading-relaxed text-ivory/90 drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)] sm:text-lg"
          style={{ animationDelay: "0.1s" }}
        >
          A Corvinal é a casa de quem prefere entender a atravessar. Este é o portal da nossa
          casa em um RPG de Hogwarts: sua história, seus alunos, seus acontecimentos e suas
          memórias.
        </p>
        <div
          className="animate-fade-up flex flex-col gap-3 pt-2 sm:flex-row"
          style={{ animationDelay: "0.2s" }}
        >
          <LinkButton href="/a-casa" variant="primary">
            Conheça a casa
          </LinkButton>
          <LinkButton href="/alunos" variant="outline">
            Nossos alunos
          </LinkButton>
        </div>
        <CelestialDivider
          className="animate-fade-in max-w-xs pt-4 opacity-80"
          style={{ animationDelay: "0.3s" }}
        />
      </div>
    </section>
  );
}
