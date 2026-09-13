"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin/authorize";
import { uploadMedia, deleteMedia } from "@/lib/admin/upload";
import { postSchema } from "@/lib/validations/post";
import { errorState, successState, type ActionState } from "@/lib/admin/action-state";

function readPostForm(formData: FormData) {
  return postSchema.safeParse({
    slug: formData.get("slug"),
    category: formData.get("category"),
    title: formData.get("title"),
    excerpt: formData.get("excerpt") ?? "",
    body: formData.get("body"),
    authorLabel: formData.get("authorLabel") ?? "",
    eventDate: formData.get("eventDate") ?? "",
    published: formData.get("published") === "on",
    highlightOrder: formData.get("highlightOrder") || null,
  });
}

function revalidatePostPaths(slug?: string, id?: string) {
  revalidatePath("/admin/mural");
  revalidatePath("/mural");
  revalidatePath("/");
  if (slug) revalidatePath(`/mural/${slug}`);
  if (id) revalidatePath(`/admin/mural/${id}`);
}

export async function createPost(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = readPostForm(formData);
  if (!parsed.success) {
    return errorState("Verifique os campos destacados.", parsed.error.flatten().fieldErrors);
  }

  const supabase = await createClient();
  const cover = formData.get("cover");
  let coverPath: string | null = null;

  if (cover instanceof File && cover.size > 0) {
    try {
      coverPath = await uploadMedia(supabase, "posts", cover);
    } catch (error) {
      return errorState(error instanceof Error ? error.message : "Falha ao enviar a capa.");
    }
  }

  const { error } = await supabase.from("posts").insert({
    slug: parsed.data.slug,
    category: parsed.data.category,
    title: parsed.data.title,
    excerpt: parsed.data.excerpt,
    body: parsed.data.body,
    author_label: parsed.data.authorLabel,
    event_date: parsed.data.eventDate,
    published: parsed.data.published,
    highlight_order: parsed.data.highlightOrder,
    cover_path: coverPath,
  });

  if (error) {
    return errorState(
      error.code === "23505" ? "Já existe uma publicação com esse slug." : `Erro ao salvar: ${error.message}`,
    );
  }

  revalidatePostPaths(parsed.data.slug);
  redirect("/admin/mural");
}

export async function updatePost(
  id: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const parsed = readPostForm(formData);
  if (!parsed.success) {
    return errorState("Verifique os campos destacados.", parsed.error.flatten().fieldErrors);
  }

  const supabase = await createClient();
  const cover = formData.get("cover");
  const removeCover = formData.get("removeCover") === "on";

  const { data: existing } = await supabase.from("posts").select("cover_path").eq("id", id).maybeSingle();
  let coverPath = existing?.cover_path ?? null;

  if (cover instanceof File && cover.size > 0) {
    try {
      const newPath = await uploadMedia(supabase, "posts", cover);
      await deleteMedia(supabase, coverPath);
      coverPath = newPath;
    } catch (error) {
      return errorState(error instanceof Error ? error.message : "Falha ao enviar a capa.");
    }
  } else if (removeCover && coverPath) {
    await deleteMedia(supabase, coverPath);
    coverPath = null;
  }

  const { data: updated, error } = await supabase
    .from("posts")
    .update({
      slug: parsed.data.slug,
      category: parsed.data.category,
      title: parsed.data.title,
      excerpt: parsed.data.excerpt,
      body: parsed.data.body,
      author_label: parsed.data.authorLabel,
      event_date: parsed.data.eventDate,
      published: parsed.data.published,
      highlight_order: parsed.data.highlightOrder,
      cover_path: coverPath,
    })
    .eq("id", id)
    .select("id");

  if (error) {
    return errorState(
      error.code === "23505" ? "Já existe uma publicação com esse slug." : `Erro ao salvar: ${error.message}`,
    );
  }

  if (!updated || updated.length === 0) {
    return errorState(
      "Nada foi salvo: esta publicação não foi encontrada ou você não tem permissão para editá-la.",
    );
  }

  revalidatePostPaths(parsed.data.slug, id);
  return successState("Alterações salvas.");
}

export async function deletePost(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const supabase = await createClient();

  const { data: existing } = await supabase.from("posts").select("cover_path, slug").eq("id", id).maybeSingle();
  await supabase.from("posts").delete().eq("id", id);
  if (existing?.cover_path) await deleteMedia(supabase, existing.cover_path);

  revalidatePostPaths(existing?.slug);
  redirect("/admin/mural");
}
