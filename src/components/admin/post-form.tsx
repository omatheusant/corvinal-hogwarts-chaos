"use client";

import { useActionState } from "react";
import { IDLE_STATE, type ActionState } from "@/lib/admin/action-state";
import { Field, TextInput, TextArea, Select, Checkbox } from "@/components/admin/inputs";
import { SubmitButton } from "@/components/admin/submit-button";
import { FormFeedback } from "@/components/admin/form-feedback";
import { POST_CATEGORY_VALUES } from "@/lib/validations/post";
import { POST_CATEGORY_LABELS } from "@/types/domain";
import type { AdminPost } from "@/lib/admin/queries";

type PostFormAction = (state: ActionState, formData: FormData) => Promise<ActionState>;

export function PostForm({ post, action }: { post?: AdminPost; action: PostFormAction }) {
  const [state, formAction] = useActionState(action, IDLE_STATE);

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <FormFeedback state={state} />

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Título" htmlFor="title" required error={state?.fieldErrors?.title}>
          <TextInput id="title" name="title" defaultValue={post?.title} required />
        </Field>
        <Field label="Slug (URL)" htmlFor="slug" required error={state?.fieldErrors?.slug}>
          <TextInput id="slug" name="slug" defaultValue={post?.slug} required />
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Categoria" htmlFor="category" required>
          <Select id="category" name="category" defaultValue={post?.category ?? "aviso"}>
            {POST_CATEGORY_VALUES.map((value) => (
              <option key={value} value={value}>
                {POST_CATEGORY_LABELS[value]}
              </option>
            ))}
          </Select>
        </Field>
        <Field
          label="Data do acontecimento (opcional)"
          htmlFor="eventDate"
          description="Use para eventos com data própria, diferente da data de publicação."
        >
          <TextInput id="eventDate" name="eventDate" type="date" defaultValue={post?.eventDate ?? ""} />
        </Field>
      </div>

      <Field label="Resumo" htmlFor="excerpt" description="Até 280 caracteres.">
        <TextArea id="excerpt" name="excerpt" defaultValue={post?.excerpt ?? ""} maxLength={280} />
      </Field>

      <Field
        label="Conteúdo"
        htmlFor="body"
        required
        description="Suporta parágrafos, '> citação', '- listas' e **negrito**."
        error={state?.fieldErrors?.body}
      >
        <TextArea id="body" name="body" defaultValue={post?.body} className="min-h-64" required />
      </Field>

      <Field label="Autoria editorial" htmlFor="authorLabel" description="Ex.: Conselho da Corvinal.">
        <TextInput id="authorLabel" name="authorLabel" defaultValue={post?.authorLabel ?? ""} />
      </Field>

      <Field label="Imagem de capa" htmlFor="cover" description="JPEG, PNG ou WebP, até 5 MB.">
        <TextInput id="cover" name="cover" type="file" accept="image/jpeg,image/png,image/webp" />
      </Field>
      {post?.coverUrl && <Checkbox name="removeCover" label="Remover a capa atual ao salvar" />}

      <div className="grid gap-6 sm:grid-cols-2">
        <Checkbox name="published" label="Publicado" defaultChecked={post?.published ?? true} />
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
            defaultValue={post?.highlightOrder ?? ""}
          />
        </Field>
      </div>

      <SubmitButton>{post ? "Salvar alterações" : "Criar publicação"}</SubmitButton>
    </form>
  );
}
