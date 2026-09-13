import { z } from "zod";

const optionalDate = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use o formato AAAA-MM-DD.")
  .optional()
  .or(z.literal(""))
  .transform((v) => (v ? v : null));

export const galleryItemSchema = z.object({
  title: z.string().trim().min(2, "Informe um título para a memória."),
  caption: z
    .string()
    .trim()
    .max(400, "A legenda pode ter no máximo 400 caracteres.")
    .optional()
    .transform((v) => (v ? v : null)),
  takenAt: optionalDate,
  published: z.coerce.boolean().default(false),
  highlightOrder: z
    .union([z.coerce.number().int().min(1).max(20), z.null()])
    .optional()
    .transform((v) => v ?? null),
  studentIds: z.array(z.string().uuid()).max(30).default([]),
});

export type GalleryItemInput = z.infer<typeof galleryItemSchema>;
