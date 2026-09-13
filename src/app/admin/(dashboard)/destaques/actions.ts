"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin/authorize";
import { errorState, successState, type ActionState } from "@/lib/admin/action-state";

type HighlightTable = "students" | "posts" | "gallery_items";

function parseHighlights(formData: FormData) {
  const entries: { id: string; value: number | null }[] = [];
  for (const [key, value] of formData.entries()) {
    if (!key.startsWith("highlight_")) continue;
    const id = key.slice("highlight_".length);
    const raw = String(value).trim();
    entries.push({ id, value: raw ? Number(raw) : null });
  }
  return entries;
}

async function updateHighlightsFor(table: HighlightTable, _prev: ActionState, formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const entries = parseHighlights(formData);

  for (const entry of entries) {
    const { data: updated, error } = await supabase
      .from(table)
      .update({ highlight_order: entry.value })
      .eq("id", entry.id)
      .select("id");
    if (error) return errorState(`Erro ao salvar destaques: ${error.message}`);
    if (!updated || updated.length === 0) {
      return errorState("Alguns itens não foram salvos: verifique suas permissões e tente novamente.");
    }
  }

  revalidatePath("/admin/destaques");
  revalidatePath("/");
  return successState("Destaques atualizados.");
}

export async function updateStudentHighlights(prev: ActionState, formData: FormData) {
  return updateHighlightsFor("students", prev, formData);
}

export async function updatePostHighlights(prev: ActionState, formData: FormData) {
  return updateHighlightsFor("posts", prev, formData);
}

export async function updateGalleryHighlights(prev: ActionState, formData: FormData) {
  return updateHighlightsFor("gallery_items", prev, formData);
}
