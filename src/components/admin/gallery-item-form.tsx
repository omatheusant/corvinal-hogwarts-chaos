"use client";

import { useActionState } from "react";
import Image from "next/image";
import { IDLE_STATE, type ActionState } from "@/lib/admin/action-state";
import { Field, TextInput, TextArea, Checkbox } from "@/components/admin/inputs";
import { SubmitButton } from "@/components/admin/submit-button";
import { FormFeedback } from "@/components/admin/form-feedback";
import type { AdminGalleryItem } from "@/lib/admin/queries";

type GalleryFormAction = (state: ActionState, formData: FormData) => Promise<ActionState>;

export function GalleryItemForm({
  item,
  students,
  action,
}: {
  item?: AdminGalleryItem;
  students: { id: string; name: string }[];
  action: GalleryFormAction;
}) {
  const [state, formAction] = useActionState(action, IDLE_STATE);

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <FormFeedback state={state} />

      <Field label="Título" htmlFor="title" required error={state?.fieldErrors?.title}>
        <TextInput id="title" name="title" defaultValue={item?.title} required />
      </Field>

      <Field label="Legenda" htmlFor="caption" description="Até 400 caracteres.">
        <TextArea id="caption" name="caption" defaultValue={item?.caption ?? ""} maxLength={400} />
      </Field>

      <Field label="Data (opcional)" htmlFor="takenAt">
        <TextInput id="takenAt" name="takenAt" type="date" defaultValue={item?.takenAt ?? ""} />
      </Field>

      {item?.imageUrl && (
        <div className="w-40">
          <Image
            src={item.imageUrl}
            alt=""
            width={200}
            height={150}
            className="border border-border-strong object-cover"
          />
        </div>
      )}
      <Field
        label={item ? "Substituir imagem" : "Imagem"}
        htmlFor="image"
        required={!item}
        description="JPEG, PNG ou WebP, até 5 MB."
      >
        <TextInput id="image" name="image" type="file" accept="image/jpeg,image/png,image/webp" required={!item} />
      </Field>

      {students.length > 0 && (
        <fieldset className="space-y-2">
          <legend className="font-sans text-sm font-medium text-ivory">Alunos associados</legend>
          <div className="grid max-h-56 grid-cols-2 gap-2 overflow-y-auto border border-border p-3">
            {students.map((student) => (
              <label key={student.id} className="flex items-center gap-2 font-sans text-sm text-ivory/85">
                <input
                  type="checkbox"
                  name="studentIds"
                  value={student.id}
                  defaultChecked={item?.studentIds.includes(student.id)}
                  className="h-4 w-4 accent-bronze"
                />
                {student.name}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <Checkbox name="published" label="Publicado" defaultChecked={item?.published ?? true} />
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
            defaultValue={item?.highlightOrder ?? ""}
          />
        </Field>
      </div>

      <SubmitButton>{item ? "Salvar alterações" : "Adicionar memória"}</SubmitButton>
    </form>
  );
}
