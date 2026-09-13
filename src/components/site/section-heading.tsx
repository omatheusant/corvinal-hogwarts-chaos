import type { ReactNode } from "react";
import { CelestialDivider } from "@/components/visual/celestial-divider";

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  divider?: boolean;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  divider = false,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={`max-w-2xl space-y-4 ${align === "center" ? "mx-auto text-center" : ""} ${className ?? ""}`}
    >
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="text-balance text-3xl text-ivory sm:text-4xl">{title}</h2>
      {description && (
        <p className="text-balance font-serif text-base leading-relaxed text-muted sm:text-lg">
          {description}
        </p>
      )}
      {divider && <CelestialDivider className={align === "center" ? "mx-auto max-w-xs" : "max-w-xs"} />}
    </div>
  );
}
