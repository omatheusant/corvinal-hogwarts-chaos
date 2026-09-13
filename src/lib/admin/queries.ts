import "server-only";
import { createClient } from "@/lib/supabase/server";
import { signedMediaUrl } from "@/lib/supabase/storage";
import type { PostCategory, StudentStatus } from "@/types/database";

/**
 * Leituras usadas exclusivamente pelo /admin — ao contrário de
 * `src/lib/data/*`, aqui não filtramos por `published` (o admin precisa
 * ver e editar rascunhos) e nunca caímos em dados de demonstração: estas
 * páginas só são alcançáveis quando o layout do dashboard já confirmou
 * Supabase configurado e o usuário autorizado.
 */

export type AdminStudent = {
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
  published: boolean;
  highlightOrder: number | null;
};

export async function listAdminStudents(): Promise<AdminStudent[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("students").select("*").order("name");
  if (error) throw error;

  return Promise.all(
    (data ?? []).map(async (row) => ({
      id: row.id,
      slug: row.slug,
      name: row.name,
      schoolYear: row.school_year,
      roleTitle: row.role_title,
      status: row.status,
      shortBio: row.short_bio,
      biography: row.biography,
      interests: row.interests ?? [],
      narrativeSkills: row.narrative_skills ?? [],
      portraitUrl: await signedMediaUrl(supabase, row.portrait_path),
      published: row.published,
      highlightOrder: row.highlight_order,
    })),
  );
}

export async function getAdminStudentById(id: string): Promise<AdminStudent | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("students").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    slug: data.slug,
    name: data.name,
    schoolYear: data.school_year,
    roleTitle: data.role_title,
    status: data.status,
    shortBio: data.short_bio,
    biography: data.biography,
    interests: data.interests ?? [],
    narrativeSkills: data.narrative_skills ?? [],
    portraitUrl: await signedMediaUrl(supabase, data.portrait_path),
    published: data.published,
    highlightOrder: data.highlight_order,
  };
}

export type AdminPost = {
  id: string;
  slug: string;
  category: PostCategory;
  title: string;
  excerpt: string | null;
  body: string;
  coverUrl: string | null;
  authorLabel: string | null;
  eventDate: string | null;
  published: boolean;
  publishedAt: string | null;
  highlightOrder: number | null;
};

export async function listAdminPosts(): Promise<AdminPost[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;

  return Promise.all(
    (data ?? []).map(async (row) => ({
      id: row.id,
      slug: row.slug,
      category: row.category,
      title: row.title,
      excerpt: row.excerpt,
      body: row.body,
      coverUrl: await signedMediaUrl(supabase, row.cover_path),
      authorLabel: row.author_label,
      eventDate: row.event_date,
      published: row.published,
      publishedAt: row.published_at,
      highlightOrder: row.highlight_order,
    })),
  );
}

export async function getAdminPostById(id: string): Promise<AdminPost | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("posts").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    slug: data.slug,
    category: data.category,
    title: data.title,
    excerpt: data.excerpt,
    body: data.body,
    coverUrl: await signedMediaUrl(supabase, data.cover_path),
    authorLabel: data.author_label,
    eventDate: data.event_date,
    published: data.published,
    publishedAt: data.published_at,
    highlightOrder: data.highlight_order,
  };
}

export type AdminGalleryItem = {
  id: string;
  title: string;
  caption: string | null;
  imageUrl: string | null;
  takenAt: string | null;
  published: boolean;
  highlightOrder: number | null;
  studentIds: string[];
};

export async function listAdminGalleryItems(): Promise<AdminGalleryItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("gallery_items")
    .select("*, gallery_item_students(student_id)")
    .order("created_at", { ascending: false });
  if (error) throw error;

  return Promise.all(
    (data ?? []).map(async (row) => ({
      id: row.id,
      title: row.title,
      caption: row.caption,
      imageUrl: await signedMediaUrl(supabase, row.image_path),
      takenAt: row.taken_at,
      published: row.published,
      highlightOrder: row.highlight_order,
      studentIds: (
        (row as unknown as { gallery_item_students: { student_id: string }[] }).gallery_item_students ?? []
      ).map((j) => j.student_id),
    })),
  );
}

export async function getAdminGalleryItemById(id: string): Promise<AdminGalleryItem | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("gallery_items")
    .select("*, gallery_item_students(student_id)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    title: data.title,
    caption: data.caption,
    imageUrl: await signedMediaUrl(supabase, data.image_path),
    takenAt: data.taken_at,
    published: data.published,
    highlightOrder: data.highlight_order,
    studentIds: (
      (data as unknown as { gallery_item_students: { student_id: string }[] }).gallery_item_students ?? []
    ).map((j) => j.student_id),
  };
}

export type AdminSiteContent = {
  key: string;
  title: string | null;
  body: string | null;
  published: boolean;
};

export async function listAdminSiteContent(): Promise<AdminSiteContent[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("site_content").select("*").order("key");
  if (error) throw error;
  return data ?? [];
}

export async function getAdminSiteContentByKey(key: string): Promise<AdminSiteContent | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_content")
    .select("*")
    .eq("key", key)
    .maybeSingle();
  if (error) throw error;
  return data ?? null;
}
