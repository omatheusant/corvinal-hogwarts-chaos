import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const fieldClasses =
  "w-full rounded-sm border border-border-strong bg-ink px-3 py-2 font-sans text-sm text-ivory placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-bronze-soft disabled:opacity-50";

type FieldProps = {
  label: string;
  htmlFor: string;
  description?: string;
  error?: string[];
  required?: boolean;
  children: ReactNode;
};

export function Field({ label, htmlFor, description, error, required, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block font-sans text-sm font-medium text-ivory">
        {label} {required && <span className="text-bronze">*</span>}
      </label>
      {children}
      {description && <p className="font-sans text-xs text-muted-foreground">{description}</p>}
      {error && error.length > 0 && (
        <p role="alert" className="font-sans text-xs text-red-300">
          {error[0]}
        </p>
      )}
    </div>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(fieldClasses, props.className)} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(fieldClasses, "min-h-32", props.className)} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn(fieldClasses, props.className)} />;
}

export function Checkbox({
  label,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="flex items-center gap-2 font-sans text-sm text-ivory">
      <input type="checkbox" {...props} className="h-4 w-4 accent-bronze" />
      {label}
    </label>
  );
}
