"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin/authorize";
import { uploadMedia, deleteMedia } from "@/lib/admin/upload";
import { studentSchema, parseLineList } from "@/lib/validations/student";
import { errorState, successState, type ActionState } from "@/lib/admin/action-state";

function readStudentForm(formData: FormData) {
  return studentSchema.safeParse({
    slug: formData.get("slug"),
    name: formData.get("name"),
    schoolYear: formData.get("schoolYear") || null,
    roleTitle: formData.get("roleTitle") ?? "",
    status: formData.get("status"),
    shortBio: formData.get("shortBio") ?? "",
    biography: formData.get("biography") ?? "",
    interests: parseLineList(formData.get("interests")),
    narrativeSkills: parseLineList(formData.get("narrativeSkills")),
    published: formData.get("published") === "on",
    highlightOrder: formData.get("highlightOrder") || null,
  });
}

function revalidateStudentPaths(slug?: string, id?: string) {
  revalidatePath("/admin/alunos");
  revalidatePath("/alunos");
  revalidatePath("/");
  if (slug) revalidatePath(`/alunos/${slug}`);
  // A página de edição em si também precisa ser revalidada — sem isso, o
  // cache de rotas do Next pode servir uma versão anterior dela (com o
  // valor antigo dos campos) ao navegar de volta para /admin/alunos/[id]
  // depois de salvar.
  if (id) revalidatePath(`/admin/alunos/${id}`);
}

export async function createStudent(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = readStudentForm(formData);
  if (!parsed.success) {
    return errorState("Verifique os campos destacados.", parsed.error.flatten().fieldErrors);
  }

  const supabase = await createClient();
  const portrait = formData.get("portrait");
  let portraitPath: string | null = null;

  if (portrait instanceof File && portrait.size > 0) {
    try {
      portraitPath = await uploadMedia(supabase, "students", portrait);
    } catch (error) {
      return errorState(error instanceof Error ? error.message : "Falha ao enviar o retrato.");
    }
  }

  const { error } = await supabase.from("students").insert({
    slug: parsed.data.slug,
    name: parsed.data.name,
    school_year: parsed.data.schoolYear,
    role_title: parsed.data.roleTitle,
    status: parsed.data.status,
    short_bio: parsed.data.shortBio,
    biography: parsed.data.biography,
    interests: parsed.data.interests,
    narrative_skills: parsed.data.narrativeSkills,
    published: parsed.data.published,
    highlight_order: parsed.data.highlightOrder,
    portrait_path: portraitPath,
  });

  if (error) {
    return errorState(
      error.code === "23505" ? "Já existe um aluno com esse slug." : `Erro ao salvar: ${error.message}`,
    );
  }

  revalidateStudentPaths(parsed.data.slug);
  redirect("/admin/alunos");
}

export async function updateStudent(
  id: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const parsed = readStudentForm(formData);
  if (!parsed.success) {
    return errorState("Verifique os campos destacados.", parsed.error.flatten().fieldErrors);
  }

  const supabase = await createClient();
  const portrait = formData.get("portrait");
  const removePortrait = formData.get("removePortrait") === "on";

  const { data: existing } = await supabase
    .from("students")
    .select("portrait_path")
    .eq("id", id)
    .maybeSingle();

  let portraitPath = existing?.portrait_path ?? null;

  if (portrait instanceof File && portrait.size > 0) {
    try {
      const newPath = await uploadMedia(supabase, "students", portrait);
      await deleteMedia(supabase, portraitPath);
      portraitPath = newPath;
    } catch (error) {
      return errorState(error instanceof Error ? error.message : "Falha ao enviar o retrato.");
    }
  } else if (removePortrait && portraitPath) {
    await deleteMedia(supabase, portraitPath);
    portraitPath = null;
  }

  const { data: updated, error } = await supabase
    .from("students")
    .update({
      slug: parsed.data.slug,
      name: parsed.data.name,
      school_year: parsed.data.schoolYear,
      role_title: parsed.data.roleTitle,
      status: parsed.data.status,
      short_bio: parsed.data.shortBio,
      biography: parsed.data.biography,
      interests: parsed.data.interests,
      narrative_skills: parsed.data.narrativeSkills,
      published: parsed.data.published,
      highlight_order: parsed.data.highlightOrder,
      portrait_path: portraitPath,
    })
    .eq("id", id)
    // Sem o .select(), uma atualização bloqueada por RLS (0 linhas
    // afetadas) não gera erro nenhum — pareceria "salvo" mesmo sem ter
    // mudado nada. Pedir os dados de volta é o jeito de detectar isso.
    .select("id");

  if (error) {
    return errorState(
      error.code === "23505" ? "Já existe um aluno com esse slug." : `Erro ao salvar: ${error.message}`,
    );
  }

  if (!updated || updated.length === 0) {
    return errorState(
      "Nada foi salvo: este aluno não foi encontrado ou você não tem permissão para editá-lo.",
    );
  }

  revalidateStudentPaths(parsed.data.slug, id);
  return successState("Alterações salvas.");
}

export async function deleteStudent(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("students")
    .select("portrait_path, slug")
    .eq("id", id)
    .maybeSingle();

  await supabase.from("students").delete().eq("id", id);
  if (existing?.portrait_path) await deleteMedia(supabase, existing.portrait_path);

  revalidateStudentPaths(existing?.slug);
  redirect("/admin/alunos");
}
