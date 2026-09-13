import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

export const buttonStyles = cva(
  "inline-flex items-center justify-center gap-2 font-sans text-sm tracking-wide transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "border border-bronze bg-bronze px-6 py-3 text-ink hover:bg-bronze-soft hover:border-bronze-soft",
        outline:
          "border border-bronze/70 bg-transparent px-6 py-3 text-ivory hover:border-bronze hover:bg-bronze/10",
        ghost: "px-3 py-2 text-ivory/90 hover:text-bronze-soft",
      },
      size: {
        default: "",
        sm: "px-4 py-2 text-xs",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

type ButtonVariants = VariantProps<typeof buttonStyles>;

export function Button({
  className,
  variant,
  size,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & ButtonVariants) {
  return <button className={cn(buttonStyles({ variant, size }), className)} {...props} />;
}

export function LinkButton({
  className,
  variant,
  size,
  href,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & ButtonVariants & { href: string }) {
  return (
    <Link href={href} className={cn(buttonStyles({ variant, size }), className)} {...props} />
  );
}
