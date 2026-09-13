"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin/authorize";
import { uploadMedia, deleteMedia } from "@/lib/admin/upload";
import { galleryItemSchema } from "@/lib/validations/gallery";
import { errorState, successState, type ActionState } from "@/lib/admin/action-state";

function readGalleryForm(formData: FormData) {
  return galleryItemSchema.safeParse({
    title: formData.get("title"),
    caption: formData.get("caption") ?? "",
    takenAt: formData.get("takenAt") ?? "",
    published: formData.get("published") === "on",
    highlightOrder: formData.get("highlightOrder") || null,
    studentIds: formData.getAll("studentIds"),
  });
}

function revalidateGalleryPaths(id?: string) {
  revalidatePath("/admin/galeria");
  revalidatePath("/memorias");
  revalidatePath("/");
  revalidatePath("/alunos/[slug]", "page");
  if (id) revalidatePath(`/admin/galeria/${id}`);
}

async function syncGalleryStudents(
  supabase: Awaited<ReturnType<typeof createClient>>,
  galleryItemId: string,
  studentIds: string[],
) {
  await supabase.from("gallery_item_students").delete().eq("gallery_item_id", galleryItemId);
  if (studentIds.length > 0) {
    await supabase
      .from("gallery_item_students")
      .insert(studentIds.map((student_id) => ({ gallery_item_id: galleryItemId, student_id })));
  }
}

export async function createGalleryItem(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = readGalleryForm(formData);
  if (!parsed.success) {
    return errorState("Verifique os campos destacados.", parsed.error.flatten().fieldErrors);
  }

  const image = formData.get("image");
  if (!(image instanceof File) || image.size === 0) {
    return errorState("Selecione uma imagem para esta memória.");
  }

  const supabase = await createClient();
  let imagePath: string;
  try {
    imagePath = await uploadMedia(supabase, "gallery", image);
  } catch (error) {
    return errorState(error instanceof Error ? error.message : "Falha ao enviar a imagem.");
  }

  const { data, error } = await supabase
    .from("gallery_items")
    .insert({
      title: parsed.data.title,
      caption: parsed.data.caption,
      taken_at: parsed.data.takenAt,
      published: parsed.data.published,
      highlight_order: parsed.data.highlightOrder,
      image_path: imagePath,
    })
    .select("id")
    .single();

  if (error || !data) {
    return errorState(`Erro ao salvar: ${error?.message ?? "tente novamente."}`);
  }

  await syncGalleryStudents(supabase, data.id, parsed.data.studentIds);
  revalidateGalleryPaths();
  redirect("/admin/galeria");
}

export async function updateGalleryItem(
  id: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const parsed = readGalleryForm(formData);
  if (!parsed.success) {
    return errorState("Verifique os campos destacados.", parsed.error.flatten().fieldErrors);
  }

  const supabase = await createClient();
  const image = formData.get("image");

  const { data: existing } = await supabase
    .from("gallery_items")
    .select("image_path")
    .eq("id", id)
    .maybeSingle();

  let imagePath = existing?.image_path;

  if (image instanceof File && image.size > 0) {
    try {
      const newPath = await uploadMedia(supabase, "gallery", image);
      await deleteMedia(supabase, imagePath);
      imagePath = newPath;
    } catch (error) {
      return errorState(error instanceof Error ? error.message : "Falha ao enviar a imagem.");
    }
  }

  const { data: updated, error } = await supabase
    .from("gallery_items")
    .update({
      title: parsed.data.title,
      caption: parsed.data.caption,
      taken_at: parsed.data.takenAt,
      published: parsed.data.published,
      highlight_order: parsed.data.highlightOrder,
      image_path: imagePath,
    })
    .eq("id", id)
    .select("id");

  if (error) {
    return errorState(`Erro ao salvar: ${error.message}`);
  }

  if (!updated || updated.length === 0) {
    return errorState(
      "Nada foi salvo: esta memória não foi encontrada ou você não tem permissão para editá-la.",
    );
  }

  await syncGalleryStudents(supabase, id, parsed.data.studentIds);
  revalidateGalleryPaths(id);
  return successState("Alterações salvas.");
}

export async function deleteGalleryItem(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("gallery_items")
    .select("image_path")
    .eq("id", id)
    .maybeSingle();

  await supabase.from("gallery_items").delete().eq("id", id);
  if (existing?.image_path) await deleteMedia(supabase, existing.image_path);

  revalidateGalleryPaths();
  redirect("/admin/galeria");
}
