import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PortraitFrame } from "@/components/visual/portrait-frame";
import { CelestialDivider } from "@/components/visual/celestial-divider";
import { RichText } from "@/components/site/rich-text";
import { GalleryPreviewGrid } from "@/components/site/gallery-preview-grid";
import { getStudentBySlug } from "@/lib/data/students";
import { getGalleryItemsForStudent } from "@/lib/data/gallery";
import { STUDENT_STATUS_LABELS } from "@/types/domain";

export async function generateMetadata(props: PageProps<"/alunos/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const { data: student } = await getStudentBySlug(slug);
  if (!student) return { title: "Aluno não encontrado" };
  return {
    title: student.name,
    description: student.shortBio ?? `Perfil de ${student.name} na Casa Corvinal.`,
  };
}

export default async function StudentProfilePage(props: PageProps<"/alunos/[slug]">) {
  const { slug } = await props.params;
  const { data: student } = await getStudentBySlug(slug);
  if (!student) notFound();

  const { data: gallery } = await getGalleryItemsForStudent(student.id);

  const metaLine = [
    student.schoolYear ? `${student.schoolYear}º ano` : null,
    STUDENT_STATUS_LABELS[student.status],
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="pb-28">
      <div className="container-page pt-12 sm:pt-16">
        <Link href="/alunos" className="font-sans text-sm text-muted hover:text-bronze-soft">
          ← Voltar para alunos
        </Link>
      </div>

      <header className="container-page grid gap-10 py-12 sm:grid-cols-[minmax(0,16rem)_1fr] sm:items-start sm:py-16">
        <PortraitFrame
          src={student.portraitUrl}
          alt={`Retrato de ${student.name}`}
          name={student.name}
          className="aspect-3/4 w-full max-w-xs shadow-elevated"
          priority
        />

        <div className="space-y-4">
          <p className="eyebrow">{metaLine}</p>
          <h1 className="text-balance font-display text-4xl text-ivory sm:text-5xl">
            {student.name}
          </h1>
          {student.roleTitle && (
            <p className="font-sans text-base text-bronze-soft">{student.roleTitle}</p>
          )}
          {student.shortBio && (
            <p className="max-w-xl font-serif text-lg leading-relaxed text-muted">
              {student.shortBio}
            </p>
          )}
        </div>
      </header>

      <div className="container-page">
        <CelestialDivider />
      </div>

      <div className="container-page grid gap-14 py-16 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-10">
          {student.biography && (
            <section className="space-y-4">
              <h2 className="font-display text-2xl text-ivory">Biografia</h2>
              <RichText content={student.biography} />
            </section>
          )}

          {gallery.length > 0 && (
            <section className="space-y-4">
              <h2 className="font-display text-2xl text-ivory">Memórias com {student.name.split(" ")[0]}</h2>
              <GalleryPreviewGrid items={gallery} />
            </section>
          )}
        </div>

        <aside className="space-y-8">
          {student.interests.length > 0 && (
            <div>
              <h2 className="font-sans text-xs tracking-widest text-bronze uppercase">Interesses</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {student.interests.map((interest) => (
                  <li
                    key={interest}
                    className="border border-border-strong px-3 py-1 font-sans text-sm text-ivory/90"
                  >
                    {interest}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {student.narrativeSkills.length > 0 && (
            <div>
              <h2 className="font-sans text-xs tracking-widest text-bronze uppercase">
                Habilidades narrativas
              </h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {student.narrativeSkills.map((skill) => (
                  <li
                    key={skill}
                    className="border border-border-strong px-3 py-1 font-sans text-sm text-ivory/90"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
