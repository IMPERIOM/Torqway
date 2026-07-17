import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import { hasSupabaseEnv } from "@/lib/env";
import type { Category } from "@/types/database";

/** Top-level categories (parent_id IS NULL), active, ordered. */
export const getTopCategories = cache(async (): Promise<Category[]> => {
  if (!hasSupabaseEnv()) return [];
  try {
    const sb = createPublicClient();
    const { data, error } = await sb
      .from("categories")
      .select("*")
      .is("parent_id", null)
      .eq("is_active", true)
      .order("sort_order");
    if (error) throw error;
    return data ?? [];
  } catch (e) {
    console.error("getTopCategories:", e);
    return [];
  }
});

export const getCategoryBySlug = cache(
  async (slug: string): Promise<Category | null> => {
    if (!hasSupabaseEnv()) return null;
    try {
      const sb = createPublicClient();
      const { data, error } = await sb
        .from("categories")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data;
    } catch (e) {
      console.error("getCategoryBySlug:", e);
      return null;
    }
  },
);

export const getCategoryById = cache(
  async (id: string): Promise<Category | null> => {
    if (!hasSupabaseEnv()) return null;
    try {
      const sb = createPublicClient();
      const { data, error } = await sb
        .from("categories")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data;
    } catch (e) {
      console.error("getCategoryById:", e);
      return null;
    }
  },
);

/** Subcategories whose parent's slug is in `parentSlugs`. */
export async function getSubcategories(
  parentSlugs: string[],
): Promise<Category[]> {
  if (!hasSupabaseEnv() || parentSlugs.length === 0) return [];
  try {
    const sb = createPublicClient();
    const { data: parents, error: pErr } = await sb
      .from("categories")
      .select("id")
      .in("slug", parentSlugs);
    if (pErr) throw pErr;
    const parentIds = (parents ?? []).map((p) => p.id);
    if (parentIds.length === 0) return [];

    const { data, error } = await sb
      .from("categories")
      .select("*")
      .in("parent_id", parentIds)
      .eq("is_active", true)
      .order("sort_order");
    if (error) throw error;
    return data ?? [];
  } catch (e) {
    console.error("getSubcategories:", e);
    return [];
  }
}
