"use client";

import { useActionState } from "react";
import { IDLE_STATE, type ActionState } from "@/lib/admin/action-state";
import { Field, TextInput, TextArea, Checkbox } from "@/components/admin/inputs";
import { SubmitButton } from "@/components/admin/submit-button";
import { FormFeedback } from "@/components/admin/form-feedback";
import type { AdminSiteContent } from "@/lib/admin/queries";

type Action = (state: ActionState, formData: FormData) => Promise<ActionState>;

export function SiteContentForm({
  content,
  action,
}: {
  content: AdminSiteContent | null;
  action: Action;
}) {
  const [state, formAction] = useActionState(action, IDLE_STATE);

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <FormFeedback state={state} />

      <Field label="Título" htmlFor="title">
        <TextInput id="title" name="title" defaultValue={content?.title ?? ""} />
      </Field>

      <Field
        label="Texto"
        htmlFor="body"
        description="Suporta parágrafos, '> citação', '- listas' e **negrito**."
        error={state?.fieldErrors?.body}
      >
        <TextArea id="body" name="body" defaultValue={content?.body ?? ""} className="min-h-64" />
      </Field>

      <Checkbox name="published" label="Publicado (visível no site público)" defaultChecked={content?.published ?? true} />

      <SubmitButton>Salvar texto</SubmitButton>
    </form>
  );
}
