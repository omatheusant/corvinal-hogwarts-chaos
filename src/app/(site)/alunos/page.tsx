import type { Metadata } from "next";
import { SectionHeading } from "@/components/site/section-heading";
import { StudentFilters } from "@/components/site/student-filters";
import { StudentCard } from "@/components/site/student-card";
import { EmptyState } from "@/components/site/empty-state";
import { getStudents } from "@/lib/data/students";
import type { StudentStatus } from "@/types/domain";

export const metadata: Metadata = {
  title: "Alunos",
  description: "Diretório de alunos e ex-alunos da Casa Corvinal.",
};

function isStudentStatus(value: string | undefined): value is StudentStatus {
  return value === "aluno" || value === "ex-aluno";
}

export default async function AlunosPage(props: PageProps<"/alunos">) {
  const searchParams = await props.searchParams;
  const q = typeof searchParams.q === "string" ? searchParams.q : undefined;
  const yearRaw = typeof searchParams.year === "string" ? searchParams.year : undefined;
  const statusRaw = typeof searchParams.status === "string" ? searchParams.status : undefined;

  const year = yearRaw ? Number(yearRaw) : undefined;
  const status = isStudentStatus(statusRaw) ? statusRaw : undefined;

  const { data: students } = await getStudents({ query: q, year, status });

  return (
    <div className="container-page py-20 sm:py-28">
      <SectionHeading
        eyebrow="Quem somos"
        title="Alunos da Corvinal"
        description="Estudantes e ex-alunos que já passaram pela nossa casa — cada um com seus próprios interesses e caminhos."
      />

      <div className="mt-10">
        <StudentFilters query={q} year={yearRaw} status={statusRaw} />
      </div>

      {students.length === 0 ? (
        <EmptyState
          title="Nenhum aluno encontrado"
          description="Tente ajustar a busca ou os filtros de ano e situação."
        />
      ) : (
        <div className="mt-14 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
          {students.map((student) => (
            <StudentCard key={student.id} student={student} />
          ))}
        </div>
      )}
    </div>
  );
}
