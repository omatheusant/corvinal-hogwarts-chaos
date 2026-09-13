import "server-only";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { DEMO_SITE_CONTENT } from "@/lib/demo-data/site-content";
import type { DataEnvelope, SiteContent } from "@/types/domain";

export async function getSiteContent(key: string): Promise<DataEnvelope<SiteContent | null>> {
  if (!isSupabaseConfigured()) {
    return { data: DEMO_SITE_CONTENT[key] ?? null, isDemo: true };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_content")
    .select("*")
    .eq("key", key)
    .maybeSingle();
  if (error) throw error;

  return { data: data ?? null, isDemo: false };
}

export async function getSiteContentMany(
  keys: string[],
): Promise<DataEnvelope<Record<string, SiteContent>>> {
  if (!isSupabaseConfigured()) {
    const entries = keys
      .filter((key) => DEMO_SITE_CONTENT[key])
      .map((key) => [key, DEMO_SITE_CONTENT[key]!] as const);
    return { data: Object.fromEntries(entries), isDemo: true };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.from("site_content").select("*").in("key", keys);
  if (error) throw error;

  const entries = (data ?? []).map((row) => [row.key, row] as const);
  return { data: Object.fromEntries(entries), isDemo: false };
}
