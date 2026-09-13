import { StudentForm } from "@/components/admin/student-form";
import { createStudent } from "../actions";

export default function NewStudentPage() {
  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl text-ivory">Novo aluno</h1>
      <StudentForm action={createStudent} />
    </div>
  );
}
