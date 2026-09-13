"use client";

import { useActionState } from "react";
import { IDLE_STATE, type ActionState } from "@/lib/admin/action-state";
import { Field, TextInput, TextArea, Select, Checkbox } from "@/components/admin/inputs";
import { SubmitButton } from "@/components/admin/submit-button";
import { FormFeedback } from "@/components/admin/form-feedback";
import { STUDENT_STATUS_VALUES } from "@/lib/validations/student";
import { STUDENT_STATUS_LABELS } from "@/types/domain";
import { AVAILABLE_SCHOOL_YEARS } from "@/lib/constants";
import type { AdminStudent } from "@/lib/admin/queries";

type StudentFormAction = (state: ActionState, formData: FormData) => Promise<ActionState>;

export function StudentForm({
  student,
  action,
}: {
  student?: AdminStudent;
  action: StudentFormAction;
}) {
  const [state, formAction] = useActionState(action, IDLE_STATE);

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <FormFeedback state={state} />

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Nome" htmlFor="name" required error={state?.fieldErrors?.name}>
          <TextInput id="name" name="name" defaultValue={student?.name} required />
        </Field>
        <Field label="Slug (URL)" htmlFor="slug" required error={state?.fieldErrors?.slug}>
          <TextInput id="slug" name="slug" defaultValue={student?.slug} required />
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <Field label="Ano escolar" htmlFor="schoolYear">
          <Select id="schoolYear" name="schoolYear" defaultValue={student?.schoolYear ?? ""}>
            <option value="">Não informado</option>
            {AVAILABLE_SCHOOL_YEARS.map((y) => (
              <option key={y} value={y}>
                {y}º ano
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Situação" htmlFor="status" required>
          <Select id="status" name="status" defaultValue={student?.status ?? "aluno"}>
            {STUDENT_STATUS_VALUES.map((value) => (
              <option key={value} value={value}>
                {STUDENT_STATUS_LABELS[value]}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Cargo (opcional)" htmlFor="roleTitle">
          <TextInput id="roleTitle" name="roleTitle" defaultValue={student?.roleTitle ?? ""} />
        </Field>
      </div>

      <Field
        label="Apresentação breve"
        htmlFor="shortBio"
        description="Até 280 caracteres — aparece no topo do perfil."
        error={state?.fieldErrors?.shortBio}
      >
        <TextArea id="shortBio" name="shortBio" defaultValue={student?.shortBio ?? ""} maxLength={280} />
      </Field>

      <Field
        label="Biografia pública"
        htmlFor="biography"
        description="Suporta parágrafos, '> citação', '- listas' e **negrito**."
        error={state?.fieldErrors?.biography}
      >
        <TextArea id="biography" name="biography" defaultValue={student?.biography ?? ""} className="min-h-56" />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Interesses" htmlFor="interests" description="Um por linha.">
          <TextArea id="interests" name="interests" defaultValue={student?.interests.join("\n")} />
        </Field>
        <Field label="Habilidades narrativas" htmlFor="narrativeSkills" description="Uma por linha.">
          <TextArea
            id="narrativeSkills"
            name="narrativeSkills"
            defaultValue={student?.narrativeSkills.join("\n")}
          />
        </Field>
      </div>

      <Field label="Retrato" htmlFor="portrait" description="JPEG, PNG ou WebP, até 5 MB.">
        <TextInput id="portrait" name="portrait" type="file" accept="image/jpeg,image/png,image/webp" />
      </Field>
      {student?.portraitUrl && (
        <Checkbox name="removePortrait" label="Remover o retrato atual ao salvar" />
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <Checkbox
          name="published"
          label="Publicado (visível no site público)"
          defaultChecked={student?.published ?? true}
        />
        <Field
          label="Ordem de destaque na home"
          htmlFor="highlightOrder"
          description="Deixe em branco para não destacar."
        >
          <TextInput
            id="highlightOrder"
            name="highlightOrder"
            type="number"
            min={1}
            max={20}
            defaultValue={student?.highlightOrder ?? ""}
          />
        </Field>
      </div>

      <SubmitButton>{student ? "Salvar alterações" : "Criar aluno"}</SubmitButton>
    </form>
  );
}
