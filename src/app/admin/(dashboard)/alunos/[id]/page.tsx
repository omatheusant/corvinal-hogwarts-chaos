import { notFound } from "next/navigation";
import { StudentForm } from "@/components/admin/student-form";
import { getAdminStudentById } from "@/lib/admin/queries";
import { updateStudent, deleteStudent } from "../actions";

export default async function EditStudentPage(props: PageProps<"/admin/alunos/[id]">) {
  const { id } = await props.params;
  const student = await getAdminStudentById(id);
  if (!student) notFound();

  const boundUpdate = updateStudent.bind(null, id);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl text-ivory">Editar aluno</h1>
        <form action={deleteStudent}>
          <input type="hidden" name="id" value={id} />
          <button type="submit" className="font-sans text-sm text-red-300 hover:underline">
            Excluir aluno
          </button>
        </form>
      </div>
      <StudentForm key={student.id} student={student} action={boundUpdate} />
    </div>
  );
}
