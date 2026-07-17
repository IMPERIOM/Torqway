import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import { hasSupabaseEnv } from "@/lib/env";
import type { BlogPost } from "@/types/database";

export async function getPosts(limit?: number): Promise<BlogPost[]> {
  if (!hasSupabaseEnv()) return [];
  try {
    const sb = createPublicClient();
    let q = sb
      .from("blog_posts")
      .select("*")
      .eq("is_published", true)
      .order("published_at", { ascending: false, nullsFirst: false });
    if (limit) q = q.limit(limit);
    const { data, error } = await q;
    if (error) throw error;
    return data ?? [];
  } catch (e) {
    console.error("getPosts:", e);
    return [];
  }
}

export const getPostBySlug = cache(
  async (slug: string): Promise<BlogPost | null> => {
    if (!hasSupabaseEnv()) return null;
    try {
      const sb = createPublicClient();
      const { data, error } = await sb
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    } catch (e) {
      console.error("getPostBySlug:", e);
      return null;
    }
  },
);

export async function getAllPostSlugs(): Promise<string[]> {
  if (!hasSupabaseEnv()) return [];
  try {
    const sb = createPublicClient();
    const { data, error } = await sb
      .from("blog_posts")
      .select("slug")
      .eq("is_published", true);
    if (error) throw error;
    return (data ?? []).map((r) => r.slug);
  } catch (e) {
    console.error("getAllPostSlugs:", e);
    return [];
  }
}
