import { z } from "zod";

export const POST_CATEGORY_VALUES = ["aviso", "evento", "conquista", "cronica"] as const;

const slugSchema = z
  .string()
  .trim()
  .min(2, "O slug precisa ter ao menos 2 caracteres.")
  .max(100, "O slug pode ter no máximo 100 caracteres.")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Use apenas letras minúsculas, números e hífens.",
  );

const optionalDate = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use o formato AAAA-MM-DD.")
  .optional()
  .or(z.literal(""))
  .transform((v) => (v ? v : null));

export const postSchema = z.object({
  slug: slugSchema,
  category: z.enum(POST_CATEGORY_VALUES),
  title: z.string().trim().min(3, "Informe um título."),
  excerpt: z
    .string()
    .trim()
    .max(280, "O resumo pode ter no máximo 280 caracteres.")
    .optional()
    .transform((v) => (v ? v : null)),
  body: z.string().trim().min(10, "O conteúdo precisa ter ao menos 10 caracteres."),
  authorLabel: z
    .string()
    .trim()
    .max(120)
    .optional()
    .transform((v) => (v ? v : null)),
  eventDate: optionalDate,
  published: z.coerce.boolean().default(false),
  highlightOrder: z
    .union([z.coerce.number().int().min(1).max(20), z.null()])
    .optional()
    .transform((v) => v ?? null),
});

export type PostInput = z.infer<typeof postSchema>;
