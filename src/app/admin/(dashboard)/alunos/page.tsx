import Link from "next/link";
import { listAdminStudents } from "@/lib/admin/queries";
import { STUDENT_STATUS_LABELS } from "@/types/domain";

export default async function AdminStudentsPage() {
  const students = await listAdminStudents();

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl text-ivory">Alunos</h1>
        <Link
          href="/admin/alunos/novo"
          className="border border-bronze bg-bronze px-5 py-2 font-sans text-sm text-ink hover:bg-bronze-soft"
        >
          + Novo aluno
        </Link>
      </div>

      {students.length === 0 ? (
        <p className="font-sans text-sm text-muted">Nenhum aluno cadastrado ainda.</p>
      ) : (
        <div className="overflow-x-auto border border-border">
          <table className="w-full min-w-[640px] text-left font-sans text-sm">
            <thead className="border-b border-border bg-navy/60 text-xs tracking-wide text-muted uppercase">
              <tr>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Ano</th>
                <th className="px-4 py-3">Situação</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-ivory">{student.name}</td>
                  <td className="px-4 py-3 text-muted">{student.schoolYear ? `${student.schoolYear}º ano` : "—"}</td>
                  <td className="px-4 py-3 text-muted">{STUDENT_STATUS_LABELS[student.status]}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        student.published
                          ? "border border-emerald-400/40 px-2 py-0.5 text-xs text-emerald-300"
                          : "border border-border-strong px-2 py-0.5 text-xs text-muted"
                      }
                    >
                      {student.published ? "Publicado" : "Rascunho"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/alunos/${student.id}`} className="text-bronze-soft hover:underline">
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
