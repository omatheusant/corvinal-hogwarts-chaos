import type { PostCategory, StudentStatus } from "./database";

export type { PostCategory, StudentStatus };

/** Forma "de exibição" das entidades, já com URLs de imagem resolvidas
 * (path do Storage → URL pública) e um marcador de origem (dados reais do
 * Supabase vs. conteúdo de demonstração local). */

export type Student = {
  id: string;
  slug: string;
  name: string;
  schoolYear: number | null;
  roleTitle: string | null;
  status: StudentStatus;
  shortBio: string | null;
  biography: string | null;
  interests: string[];
  narrativeSkills: string[];
  portraitUrl: string | null;
  highlightOrder: number | null;
};

export type Post = {
  id: string;
  slug: string;
  category: PostCategory;
  title: string;
  excerpt: string | null;
  body: string;
  coverUrl: string | null;
  authorLabel: string | null;
  eventDate: string | null;
  publishedAt: string | null;
  highlightOrder: number | null;
};

export type GalleryItem = {
  id: string;
  title: string;
  caption: string | null;
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
  takenAt: string | null;
  highlightOrder: number | null;
  students: Pick<Student, "id" | "slug" | "name">[];
};

export type SiteContent = {
  key: string;
  title: string | null;
  body: string | null;
};

/** Envelope de origem dos dados: permite à UI mostrar um aviso discreto de
 * "conteúdo de demonstração" sem confundir exemplos com registros reais. */
export type DataEnvelope<T> = {
  data: T;
  isDemo: boolean;
};

export const POST_CATEGORY_LABELS: Record<PostCategory, string> = {
  aviso: "Aviso",
  evento: "Evento",
  conquista: "Conquista",
  cronica: "Crônica",
};

export const STUDENT_STATUS_LABELS: Record<StudentStatus, string> = {
  aluno: "Aluno(a)",
  "ex-aluno": "Ex-aluno(a)",
};
