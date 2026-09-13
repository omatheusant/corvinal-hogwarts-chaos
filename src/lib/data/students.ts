import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { signedMediaUrl } from "@/lib/supabase/storage";
import { isSupabaseConfigured } from "@/lib/env";
import { DEMO_STUDENTS } from "@/lib/demo-data/students";
import type { DataEnvelope, Student, StudentStatus } from "@/types/domain";
import type { Database } from "@/types/database";

type StudentRow = Database["public"]["Tables"]["students"]["Row"];

async function mapStudent(supabase: SupabaseClient, row: StudentRow): Promise<Student> {
  return {
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
    highlightOrder: row.highlight_order,
  };
}

export type StudentFilters = {
  query?: string;
  year?: number;
  status?: StudentStatus;
};

function applyDemoFilters(filters: StudentFilters): Student[] {
  return DEMO_STUDENTS.filter((student) => {
    if (filters.status && student.status !== filters.status) return false;
    if (filters.year && student.schoolYear !== filters.year) return false;
    if (filters.query) {
      const q = filters.query.toLowerCase();
      if (!student.name.toLowerCase().includes(q)) return false;
    }
    return true;
  }).sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
}

export async function getStudents(
  filters: StudentFilters = {},
): Promise<DataEnvelope<Student[]>> {
  if (!isSupabaseConfigured()) {
    return { data: applyDemoFilters(filters), isDemo: true };
  }

  const supabase = await createClient();
  let query = supabase.from("students").select("*").eq("published", true);

  if (filters.status) query = query.eq("status", filters.status);
  if (filters.year) query = query.eq("school_year", filters.year);
  if (filters.query) query = query.ilike("name", `%${filters.query}%`);

  const { data, error } = await query.order("name", { ascending: true });
  if (error) throw error;

  return { data: await Promise.all((data ?? []).map((row) => mapStudent(supabase, row))), isDemo: false };
}

export async function getFeaturedStudents(limit = 3): Promise<DataEnvelope<Student[]>> {
  if (!isSupabaseConfigured()) {
    const featured = DEMO_STUDENTS.filter((s) => s.highlightOrder !== null)
      .sort((a, b) => (a.highlightOrder ?? 0) - (b.highlightOrder ?? 0))
      .slice(0, limit);
    return { data: featured, isDemo: true };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("published", true)
    .not("highlight_order", "is", null)
    .order("highlight_order", { ascending: true })
    .limit(limit);
  if (error) throw error;

  return { data: await Promise.all((data ?? []).map((row) => mapStudent(supabase, row))), isDemo: false };
}

export async function getStudentBySlug(slug: string): Promise<DataEnvelope<Student | null>> {
  if (!isSupabaseConfigured()) {
    const student = DEMO_STUDENTS.find((s) => s.slug === slug) ?? null;
    return { data: student, isDemo: true };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error) throw error;

  return { data: data ? await mapStudent(supabase, data) : null, isDemo: false };
}
