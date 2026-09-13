"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/admin/login/actions";
import { IDLE_STATE } from "@/lib/admin/action-state";
import { Field, TextInput } from "@/components/admin/inputs";
import { SubmitButton } from "@/components/admin/submit-button";
import { FormFeedback } from "@/components/admin/form-feedback";

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const [state, action] = useActionState(loginAction, IDLE_STATE);

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="redirectTo" value={redirectTo ?? ""} />
      <FormFeedback state={state} />

      <Field label="E-mail" htmlFor="email" required error={state?.fieldErrors?.email}>
        <TextInput id="email" name="email" type="email" autoComplete="username" required />
      </Field>

      <Field label="Senha" htmlFor="password" required error={state?.fieldErrors?.password}>
        <TextInput id="password" name="password" type="password" autoComplete="current-password" required />
      </Field>

      <SubmitButton pendingLabel="Entrando…" className="w-full">
        Entrar
      </SubmitButton>
    </form>
  );
}
