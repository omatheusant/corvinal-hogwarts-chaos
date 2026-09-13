import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { signedMediaUrl } from "@/lib/supabase/storage";
import { isSupabaseConfigured } from "@/lib/env";
import { DEMO_GALLERY } from "@/lib/demo-data/gallery";
import type { DataEnvelope, GalleryItem } from "@/types/domain";

export type GalleryItemWithIllustration = GalleryItem & {
  illustrationVariant?: "tower" | "telescope" | "library" | "common-room" | "map";
};

type GalleryRow = {
  id: string;
  title: string;
  caption: string | null;
  image_path: string;
  image_width: number | null;
  image_height: number | null;
  taken_at: string | null;
  highlight_order: number | null;
  gallery_item_students: { students: { id: string; slug: string; name: string } | null }[] | null;
};

async function mapGalleryRow(supabase: SupabaseClient, row: GalleryRow): Promise<GalleryItem> {
  return {
    id: row.id,
    title: row.title,
    caption: row.caption,
    imageUrl: (await signedMediaUrl(supabase, row.image_path)) ?? "",
    imageWidth: row.image_width ?? 4,
    imageHeight: row.image_height ?? 3,
    takenAt: row.taken_at,
    highlightOrder: row.highlight_order,
    students: (row.gallery_item_students ?? [])
      .map((join) => join.students)
      .filter((s): s is { id: string; slug: string; name: string } => Boolean(s)),
  };
}

export async function getGalleryItems(): Promise<DataEnvelope<GalleryItemWithIllustration[]>> {
  if (!isSupabaseConfigured()) {
    const sorted = [...DEMO_GALLERY].sort((a, b) => {
      const aOrder = a.highlightOrder ?? Number.MAX_SAFE_INTEGER;
      const bOrder = b.highlightOrder ?? Number.MAX_SAFE_INTEGER;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return (b.takenAt ?? "").localeCompare(a.takenAt ?? "");
    });
    return { data: sorted, isDemo: true };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("gallery_items")
    .select("*, gallery_item_students(students(id, slug, name))")
    .eq("published", true)
    .order("taken_at", { ascending: false });
  if (error) throw error;

  const rows = (data ?? []) as unknown as GalleryRow[];
  return { data: await Promise.all(rows.map((row) => mapGalleryRow(supabase, row))), isDemo: false };
}

export async function getFeaturedGalleryItems(
  limit = 4,
): Promise<DataEnvelope<GalleryItemWithIllustration[]>> {
  const { data, isDemo } = await getGalleryItems();
  const featured = data.filter((item) => item.highlightOrder !== null).slice(0, limit);
  return { data: featured.length > 0 ? featured : data.slice(0, limit), isDemo };
}

/** Memórias associadas a um aluno específico, usadas na página de perfil. */
export async function getGalleryItemsForStudent(
  studentId: string,
): Promise<DataEnvelope<GalleryItemWithIllustration[]>> {
  const { data, isDemo } = await getGalleryItems();
  return { data: data.filter((item) => item.students.some((s) => s.id === studentId)), isDemo };
}
