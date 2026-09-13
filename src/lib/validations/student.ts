import { z } from "zod";

export const STUDENT_STATUS_VALUES = ["aluno", "ex-aluno"] as const;

const slugSchema = z
  .string()
  .trim()
  .min(2, "O slug precisa ter ao menos 2 caracteres.")
  .max(80, "O slug pode ter no máximo 80 caracteres.")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Use apenas letras minúsculas, números e hífens (ex.: iris-halloway).",
  );

export const studentSchema = z.object({
  slug: slugSchema,
  name: z.string().trim().min(2, "Informe o nome completo do aluno."),
  schoolYear: z
    .union([z.coerce.number().int().min(1).max(7), z.null()])
    .optional()
    .transform((v) => v ?? null),
  roleTitle: z
    .string()
    .trim()
    .max(120, "O cargo pode ter no máximo 120 caracteres.")
    .optional()
    .transform((v) => (v ? v : null)),
  status: z.enum(STUDENT_STATUS_VALUES),
  shortBio: z
    .string()
    .trim()
    .max(280, "A apresentação breve pode ter no máximo 280 caracteres.")
    .optional()
    .transform((v) => (v ? v : null)),
  biography: z
    .string()
    .trim()
    .max(8000, "A biografia pode ter no máximo 8000 caracteres.")
    .optional()
    .transform((v) => (v ? v : null)),
  interests: z.array(z.string().trim().min(1)).max(20, "No máximo 20 interesses.").default([]),
  narrativeSkills: z
    .array(z.string().trim().min(1))
    .max(20, "No máximo 20 habilidades narrativas.")
    .default([]),
  published: z.coerce.boolean().default(false),
  highlightOrder: z
    .union([z.coerce.number().int().min(1).max(20), z.null()])
    .optional()
    .transform((v) => v ?? null),
});

export type StudentInput = z.infer<typeof studentSchema>;

/** Converte um texto com uma linha por item em um array limpo, usado nos
 * campos de interesses/habilidades dos formulários (um textarea simples). */
export function parseLineList(raw: FormDataEntryValue | null): string[] {
  if (typeof raw !== "string") return [];
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}
