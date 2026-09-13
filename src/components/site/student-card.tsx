import Link from "next/link";
import { PortraitFrame } from "@/components/visual/portrait-frame";
import { STUDENT_STATUS_LABELS, type Student } from "@/types/domain";

export function StudentCard({ student }: { student: Student }) {
  return (
    <Link
      href={`/alunos/${student.slug}`}
      className="group block focus-visible:outline-2 focus-visible:outline-bronze-soft"
    >
      <PortraitFrame
        src={student.portraitUrl}
        alt={`Retrato de ${student.name}`}
        name={student.name}
        className="aspect-3/4 w-full shadow-soft transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-elevated"
      />
      <div className="mt-4 space-y-1">
        <h3 className="font-display text-xl text-ivory group-hover:text-bronze-soft">
          {student.name}
        </h3>
        <p className="font-sans text-xs tracking-wide text-muted-foreground uppercase">
          {[
            student.schoolYear ? `${student.schoolYear}º ano` : null,
            STUDENT_STATUS_LABELS[student.status],
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
        {student.roleTitle && (
          <p className="font-sans text-sm text-bronze-soft">{student.roleTitle}</p>
        )}
      </div>
    </Link>
  );
}
