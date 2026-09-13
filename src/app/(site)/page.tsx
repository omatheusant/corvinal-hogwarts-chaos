import Image from "next/image";
import { Hero } from "@/components/site/hero";
import { SectionHeading } from "@/components/site/section-heading";
import { CelestialDivider } from "@/components/visual/celestial-divider";
import { StudentCard } from "@/components/site/student-card";
import { PostCard } from "@/components/site/post-card";
import { RichText } from "@/components/site/rich-text";
import { LinkButton } from "@/components/ui/button";
import { ArchFrame } from "@/components/visual/arch-frame";
import { getFeaturedStudents } from "@/lib/data/students";
import { getFeaturedPosts } from "@/lib/data/posts";
import { getFeaturedGalleryItems } from "@/lib/data/gallery";
import { getSiteContentMany } from "@/lib/data/site-content";
import { GalleryPreviewGrid } from "@/components/site/gallery-preview-grid";
import { DEFAULT_HOME_INTRO_BODY, DEFAULT_HOME_INTRO_TITLE } from "@/lib/content/home-intro";

const VALUE_FALLBACKS: Record<string, { title: string; body: string }> = {
  value_sabedoria: {
    title: "Sabedoria",
    body: "Valorizamos quem busca entender antes de concluir.",
  },
  value_criatividade: {
    title: "Criatividade",
    body: "Soluções pouco óbvias e um certo gosto por reinventar o caminho conhecido.",
  },
  value_individualidade: {
    title: "Individualidade",
    body: "Cada aluno chega com interesses próprios — a casa pede curiosidade, não uniformidade.",
  },
};

export default async function HomePage() {
  const [students, posts, gallery, content] = await Promise.all([
    getFeaturedStudents(3),
    getFeaturedPosts(3),
    getFeaturedGalleryItems(4),
    getSiteContentMany([
      "home_intro",
      "value_sabedoria",
      "value_criatividade",
      "value_individualidade",
    ]),
  ]);

  const intro = content.data.home_intro;
  const values = ["value_sabedoria", "value_criatividade", "value_individualidade"].map((key) => ({
    key,
    title: content.data[key]?.title ?? VALUE_FALLBACKS[key]!.title,
    body: content.data[key]?.body ?? VALUE_FALLBACKS[key]!.body,
  }));

  return (
    <>
      <Hero />

      {/* 1. Introdução editorial à casa — a história da torre */}
      <section className="container-page grid gap-10 py-20 sm:py-28 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
        <div className="space-y-6">
          <p className="eyebrow">A casa</p>
          <h2 className="text-balance font-display text-3xl text-ivory sm:text-4xl">
            {intro?.title ?? DEFAULT_HOME_INTRO_TITLE}
          </h2>
          <RichText content={intro?.body ?? DEFAULT_HOME_INTRO_BODY} />
          <LinkButton href="/a-casa" variant="outline">
            Conhecer a história completa
          </LinkButton>
        </div>
        <ArchFrame className="aspect-4/5 w-full shadow-elevated">
          <Image
            src="/images/corvinal-tower.jpg"
            alt="A Torre da Corvinal recortada contra o céu noturno, com suas janelas em arco iluminadas"
            fill
            sizes="(min-width: 1024px) 480px, 90vw"
            className="object-cover [object-position:50%_35%]"
            priority
          />
        </ArchFrame>
      </section>

      <div className="container-page">
        <CelestialDivider />
      </div>

      {/* 2. Valores */}
      <section className="container-page py-20 sm:py-28">
        <SectionHeading
          eyebrow="O que nos define"
          title="Sabedoria, criatividade e individualidade"
          align="center"
          className="mx-auto"
        />
        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          {values.map((value, i) => (
            <div
              key={value.key}
              className="card-parchment bg-grain group relative space-y-3 rounded-sm p-8 shadow-elevated transition-transform duration-300 hover:-translate-y-1.5"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-ink/40 to-transparent"
              />
              <h3 className="font-display text-2xl">{value.title}</h3>
              <p className="font-serif leading-relaxed">{value.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Alunos em destaque */}
      {students.data.length > 0 && (
        <section className="border-t border-bronze/15 bg-navy/40 py-20 backdrop-blur-[2px] sm:py-28">
          <div className="container-page">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading eyebrow="Rostos da casa" title="Alguns de nossos alunos" />
              <LinkButton href="/alunos" variant="ghost" size="sm">
                Ver todos os alunos →
              </LinkButton>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-3">
              {students.data.map((student) => (
                <StudentCard key={student.id} student={student} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Mural — últimos avisos e acontecimentos */}
      {posts.data.length > 0 && (
        <section className="py-20 sm:py-28">
          <div className="container-page">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading eyebrow="Mural da casa" title="Últimos avisos e acontecimentos" />
              <LinkButton href="/mural" variant="ghost" size="sm">
                Ver o mural completo →
              </LinkButton>
            </div>
            <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {posts.data.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. Prévia da galeria de memórias */}
      {gallery.data.length > 0 && (
        <section className="border-t border-bronze/15 bg-navy/40 py-20 backdrop-blur-[2px] sm:py-28">
          <div className="container-page">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading eyebrow="Memórias" title="Registros da nossa convivência" />
              <LinkButton href="/memorias" variant="ghost" size="sm">
                Ver a galeria completa →
              </LinkButton>
            </div>
            <GalleryPreviewGrid items={gallery.data} className="mt-12" />
          </div>
        </section>
      )}
    </>
  );
}
