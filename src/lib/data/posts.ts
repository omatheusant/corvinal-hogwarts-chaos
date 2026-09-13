import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { signedMediaUrl } from "@/lib/supabase/storage";
import { isSupabaseConfigured } from "@/lib/env";
import { DEMO_POSTS } from "@/lib/demo-data/posts";
import type { DataEnvelope, Post, PostCategory } from "@/types/domain";
import type { Database } from "@/types/database";

type PostRow = Database["public"]["Tables"]["posts"]["Row"];

async function mapPost(supabase: SupabaseClient, row: PostRow): Promise<Post> {
  return {
    id: row.id,
    slug: row.slug,
    category: row.category,
    title: row.title,
    excerpt: row.excerpt,
    body: row.body,
    coverUrl: await signedMediaUrl(supabase, row.cover_path),
    authorLabel: row.author_label,
    eventDate: row.event_date,
    publishedAt: row.published_at,
    highlightOrder: row.highlight_order,
  };
}

export type PostFilters = { category?: PostCategory };

function applyDemoFilters(filters: PostFilters): Post[] {
  return DEMO_POSTS.filter((post) => !filters.category || post.category === filters.category).sort(
    (a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""),
  );
}

export async function getPosts(filters: PostFilters = {}): Promise<DataEnvelope<Post[]>> {
  if (!isSupabaseConfigured()) {
    return { data: applyDemoFilters(filters), isDemo: true };
  }

  const supabase = await createClient();
  let query = supabase.from("posts").select("*").eq("published", true);
  if (filters.category) query = query.eq("category", filters.category);

  const { data, error } = await query.order("published_at", { ascending: false });
  if (error) throw error;

  return { data: await Promise.all((data ?? []).map((row) => mapPost(supabase, row))), isDemo: false };
}

export async function getFeaturedPosts(limit = 3): Promise<DataEnvelope<Post[]>> {
  if (!isSupabaseConfigured()) {
    const featured = DEMO_POSTS.filter((p) => p.highlightOrder !== null)
      .sort((a, b) => (a.highlightOrder ?? 0) - (b.highlightOrder ?? 0))
      .slice(0, limit);
    return { data: featured, isDemo: true };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .not("highlight_order", "is", null)
    .order("highlight_order", { ascending: true })
    .limit(limit);
  if (error) throw error;

  return { data: await Promise.all((data ?? []).map((row) => mapPost(supabase, row))), isDemo: false };
}

export async function getPostBySlug(slug: string): Promise<DataEnvelope<Post | null>> {
  if (!isSupabaseConfigured()) {
    const post = DEMO_POSTS.find((p) => p.slug === slug) ?? null;
    return { data: post, isDemo: true };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error) throw error;

  return { data: data ? await mapPost(supabase, data) : null, isDemo: false };
}
