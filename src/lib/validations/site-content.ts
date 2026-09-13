import { z } from "zod";

export const siteContentSchema = z.object({
  key: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9_]+$/, "Use apenas letras minúsculas, números e underscore."),
  title: z
    .string()
    .trim()
    .max(200)
    .optional()
    .transform((v) => (v ? v : null)),
  body: z
    .string()
    .trim()
    .max(20000, "O texto pode ter no máximo 20000 caracteres.")
    .optional()
    .transform((v) => (v ? v : null)),
  published: z.coerce.boolean().default(false),
});

export type SiteContentInput = z.infer<typeof siteContentSchema>;

/** Chaves conhecidas, editadas por formulários dedicados no /admin. Novas
 * chaves podem ser criadas livremente — esta lista só orienta a UI. */
export const KNOWN_SITE_CONTENT_KEYS = [
  { key: "home_intro", label: "Início — introdução editorial" },
  { key: "value_sabedoria", label: "Início — valor: Sabedoria" },
  { key: "value_criatividade", label: "Início — valor: Criatividade" },
  { key: "value_individualidade", label: "Início — valor: Individualidade" },
  { key: "casa_historia", label: "A Casa — origem" },
  { key: "casa_rowena", label: "A Casa — Rowena Ravenclaw" },
  { key: "casa_diadema", label: "A Casa — a Dama Cinzenta e o diadema perdido" },
  { key: "casa_valores", label: "A Casa — valores, símbolos e tradições" },
  { key: "casa_sala_comunal", label: "A Casa — sala comunal" },
  { key: "casa_nosso_rpg", label: "A Casa — nossa trajetória no RPG" },
] as const;
