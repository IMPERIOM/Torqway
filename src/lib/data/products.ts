import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import { hasSupabaseEnv } from "@/lib/env";
import type { Product, ProductCondition, StockStatus } from "@/types/database";

type Client = ReturnType<typeof createPublicClient>;

export type ProductSort = "featured" | "price_asc" | "price_desc" | "newest";

export type ProductFilters = {
  /** Top-level category slugs; descendants are included automatically. */
  categorySlugs?: string[];
  /** Narrow to a single subcategory slug (overrides categorySlugs scope). */
  subcategorySlug?: string;
  condition?: ProductCondition;
  stockStatus?: StockStatus;
  sort?: ProductSort;
  featured?: boolean;
  limit?: number;
};

/** Resolve category slugs to their ids, including one level of children. */
async function resolveCategoryIds(
  sb: Client,
  slugs: string[],
): Promise<string[]> {
  const { data, error } = await sb
    .from("categories")
    .select("id, slug, parent_id");
  if (error) throw error;
  const cats = data ?? [];
  const directIds = cats.filter((c) => slugs.includes(c.slug)).map((c) => c.id);
  const childIds = cats
    .filter((c) => c.parent_id && directIds.includes(c.parent_id))
    .map((c) => c.id);
  return [...new Set([...directIds, ...childIds])];
}

export async function getProducts(
  filters: ProductFilters = {},
): Promise<Product[]> {
  if (!hasSupabaseEnv()) return [];
  try {
    const sb = createPublicClient();
    let q = sb.from("products").select("*").eq("is_published", true);

    if (filters.featured) q = q.eq("is_featured", true);
    if (filters.condition) q = q.eq("condition", filters.condition);
    if (filters.stockStatus) q = q.eq("stock_status", filters.stockStatus);

    const scopeSlugs = filters.subcategorySlug
      ? [filters.subcategorySlug]
      : filters.categorySlugs;
    if (scopeSlugs?.length) {
      const ids = await resolveCategoryIds(sb, scopeSlugs);
      if (ids.length === 0) return [];
      q = q.in("category_id", ids);
    }

    switch (filters.sort) {
      case "price_asc":
        q = q.order("price", { ascending: true, nullsFirst: false });
        break;
      case "price_desc":
        q = q.order("price", { ascending: false, nullsFirst: false });
        break;
      case "newest":
        q = q.order("created_at", { ascending: false });
        break;
      default:
        q = q
          .order("is_featured", { ascending: false })
          .order("sort_order", { ascending: true });
    }

    if (filters.limit) q = q.limit(filters.limit);

    const { data, error } = await q;
    if (error) throw error;
    return data ?? [];
  } catch (e) {
    console.error("getProducts:", e);
    return [];
  }
}

export function getFeaturedProducts(limit = 6): Promise<Product[]> {
  return getProducts({ featured: true, limit });
}

export const getProductBySlug = cache(
  async (slug: string): Promise<Product | null> => {
    if (!hasSupabaseEnv()) return null;
    try {
      const sb = createPublicClient();
      const { data, error } = await sb
        .from("products")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    } catch (e) {
      console.error("getProductBySlug:", e);
      return null;
    }
  },
);

export async function getAllProductSlugs(): Promise<string[]> {
  if (!hasSupabaseEnv()) return [];
  try {
    const sb = createPublicClient();
    const { data, error } = await sb
      .from("products")
      .select("slug")
      .eq("is_published", true);
    if (error) throw error;
    return (data ?? []).map((r) => r.slug);
  } catch (e) {
    console.error("getAllProductSlugs:", e);
    return [];
  }
}

export async function getRelatedProducts(
  product: Pick<Product, "id" | "category_id">,
  limit = 4,
): Promise<Product[]> {
  if (!hasSupabaseEnv() || !product.category_id) return [];
  try {
    const sb = createPublicClient();
    const { data, error } = await sb
      .from("products")
      .select("*")
      .eq("is_published", true)
      .eq("category_id", product.category_id)
      .neq("id", product.id)
      .order("is_featured", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data ?? [];
  } catch (e) {
    console.error("getRelatedProducts:", e);
    return [];
  }
}
