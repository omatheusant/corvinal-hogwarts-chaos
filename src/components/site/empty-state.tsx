import type { ReactNode } from "react";
import { CelestialDivider } from "@/components/visual/celestial-divider";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="mx-auto max-w-md space-y-5 py-16 text-center">
      <CelestialDivider className="max-w-[10rem] mx-auto" />
      <h3 className="font-display text-2xl text-ivory">{title}</h3>
      {description && <p className="font-serif text-muted">{description}</p>}
      {action}
    </div>
  );
}
