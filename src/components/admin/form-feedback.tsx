import type { ActionState } from "@/lib/admin/action-state";

export function FormFeedback({ state }: { state: ActionState }) {
  if (!state || !state.message) return null;

  return (
    <p
      role="status"
      className={
        state.status === "error"
          ? "border border-red-400/40 bg-red-950/40 px-4 py-3 font-sans text-sm text-red-200"
          : "border border-emerald-400/40 bg-emerald-950/30 px-4 py-3 font-sans text-sm text-emerald-200"
      }
    >
      {state.message}
    </p>
  );
}
