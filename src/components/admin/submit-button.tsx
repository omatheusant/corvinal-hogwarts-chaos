"use client";

import { useFormStatus } from "react-dom";
import { cn } from "@/lib/cn";

export function SubmitButton({
  children,
  className,
  pendingLabel = "Salvando…",
}: {
  children: React.ReactNode;
  className?: string;
  pendingLabel?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "border border-bronze bg-bronze px-6 py-2.5 font-sans text-sm text-ink transition-colors hover:bg-bronze-soft disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
