import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import { hasSupabaseEnv } from "@/lib/env";
import type { Project } from "@/types/database";

export async function getProjects(opts?: {
  featured?: boolean;
  limit?: number;
}): Promise<Project[]> {
  if (!hasSupabaseEnv()) return [];
  try {
    const sb = createPublicClient();
    let q = sb
      .from("projects")
      .select("*")
      .eq("is_published", true)
      .order("sort_order");
    if (opts?.featured) q = q.eq("is_featured", true);
    if (opts?.limit) q = q.limit(opts.limit);
    const { data, error } = await q;
    if (error) throw error;
    return data ?? [];
  } catch (e) {
    console.error("getProjects:", e);
    return [];
  }
}

export function getFeaturedProjects(limit = 6): Promise<Project[]> {
  return getProjects({ featured: true, limit });
}

export const getProjectBySlug = cache(
  async (slug: string): Promise<Project | null> => {
    if (!hasSupabaseEnv()) return null;
    try {
      const sb = createPublicClient();
      const { data, error } = await sb
        .from("projects")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    } catch (e) {
      console.error("getProjectBySlug:", e);
      return null;
    }
  },
);

export async function getAllProjectSlugs(): Promise<string[]> {
  if (!hasSupabaseEnv()) return [];
  try {
    const sb = createPublicClient();
    const { data, error } = await sb
      .from("projects")
      .select("slug")
      .eq("is_published", true);
    if (error) throw error;
    return (data ?? []).map((r) => r.slug);
  } catch (e) {
    console.error("getAllProjectSlugs:", e);
    return [];
  }
}
