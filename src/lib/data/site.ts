import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import { hasSupabaseEnv } from "@/lib/env";
import type { SiteStat, HomepageSection, Testimonial } from "@/types/database";

export const getSiteStats = cache(async (): Promise<SiteStat[]> => {
  if (!hasSupabaseEnv()) return [];
  try {
    const sb = createPublicClient();
    const { data, error } = await sb
      .from("site_stats")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");
    if (error) throw error;
    return data ?? [];
  } catch (e) {
    console.error("getSiteStats:", e);
    return [];
  }
});

/** Homepage sections keyed by section_key for easy lookup. */
export const getHomepageSections = cache(
  async (): Promise<Record<string, HomepageSection>> => {
    if (!hasSupabaseEnv()) return {};
    try {
      const sb = createPublicClient();
      const { data, error } = await sb
        .from("homepage_sections")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      if (error) throw error;
      return Object.fromEntries(
        (data ?? []).map((s) => [s.section_key, s]),
      ) as Record<string, HomepageSection>;
    } catch (e) {
      console.error("getHomepageSections:", e);
      return {};
    }
  },
);

export async function getTestimonials(limit?: number): Promise<Testimonial[]> {
  if (!hasSupabaseEnv()) return [];
  try {
    const sb = createPublicClient();
    let q = sb
      .from("testimonials")
      .select("*")
      .eq("is_published", true)
      .order("sort_order");
    if (limit) q = q.limit(limit);
    const { data, error } = await q;
    if (error) throw error;
    return data ?? [];
  } catch (e) {
    console.error("getTestimonials:", e);
    return [];
  }
}
