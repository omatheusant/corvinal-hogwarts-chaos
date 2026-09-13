"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin/authorize";
import { siteContentSchema } from "@/lib/validations/site-content";
import { errorState, successState, type ActionState } from "@/lib/admin/action-state";

export async function upsertSiteContent(
  key: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = siteContentSchema.safeParse({
    key,
    title: formData.get("title") ?? "",
    body: formData.get("body") ?? "",
    published: formData.get("published") === "on",
  });

  if (!parsed.success) {
    return errorState("Verifique os campos destacados.", parsed.error.flatten().fieldErrors);
  }

  const supabase = await createClient();
  const { data: saved, error } = await supabase
    .from("site_content")
    .upsert({
      key: parsed.data.key,
      title: parsed.data.title,
      body: parsed.data.body,
      published: parsed.data.published,
    })
    .select("key");

  if (error) return errorState(`Erro ao salvar: ${error.message}`);

  if (!saved || saved.length === 0) {
    return errorState("Nada foi salvo: você não tem permissão para editar este conteúdo.");
  }

  revalidatePath("/admin/conteudo");
  revalidatePath(`/admin/conteudo/${key}`);
  revalidatePath("/");
  revalidatePath("/a-casa");
  return successState("Texto salvo.");
}

export async function goToContentKey(formData: FormData) {
  await requireAdmin();
  const raw = String(formData.get("key") ?? "").trim().toLowerCase().replace(/[^a-z0-9_]/g, "_");
  if (!raw) redirect("/admin/conteudo");
  redirect(`/admin/conteudo/${raw}`);
}
