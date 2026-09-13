"use client";

import { useActionState } from "react";
import { IDLE_STATE, type ActionState } from "@/lib/admin/action-state";
import { SubmitButton } from "@/components/admin/submit-button";
import { FormFeedback } from "@/components/admin/form-feedback";

type HighlightItem = { id: string; label: string; highlightOrder: number | null };

export function HighlightList({
  title,
  items,
  action,
}: {
  title: string;
  items: HighlightItem[];
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
}) {
  const [state, formAction] = useActionState(action, IDLE_STATE);

  return (
    <section className="space-y-4 border border-border bg-navy/40 p-6">
      <h2 className="font-display text-xl text-ivory">{title}</h2>
      <p className="font-sans text-xs text-muted-foreground">
        Defina um número (1, 2, 3…) para destacar na home, na ordem desejada. Deixe em branco para
        não destacar.
      </p>
      <form action={formAction} className="space-y-3">
        <FormFeedback state={state} />
        {items.length === 0 ? (
          <p className="font-sans text-sm text-muted">Nada publicado ainda.</p>
        ) : (
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-4">
                <span className="font-sans text-sm text-ivory/90">{item.label}</span>
                <input
                  type="number"
                  name={`highlight_${item.id}`}
                  min={1}
                  max={20}
                  defaultValue={item.highlightOrder ?? ""}
                  className="w-20 border border-border-strong bg-ink px-2 py-1 font-sans text-sm text-ivory"
                />
              </li>
            ))}
          </ul>
        )}
        {items.length > 0 && <SubmitButton className="px-4 py-2 text-xs">Salvar</SubmitButton>}
      </form>
    </section>
  );
}
