#!/usr/bin/env node
/**
 * Import data/products.json into the Supabase `products` table.
 *
 * Usage:
 *   node scripts/import-products.mjs            # upsert into Supabase
 *   node scripts/import-products.mjs --dry-run  # validate + print plan only
 *
 * Reads NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from the
 * environment, falling back to .env.local (service role bypasses RLS — this
 * script is server/CLI only).
 *
 * Mapping (JSON schema -> products table):
 *   slug        -> slug (upsert key)
 *   name        -> name
 *   category    -> category_id (resolved by category slug; created if missing)
 *   brand       -> specs.brand
 *   weightKg    -> specs.weight_kg   (0 = not published by manufacturer)
 *   maxLoadKg   -> specs.max_load_kg (0 = not published by manufacturer)
 *   price       -> price        (only when non-null — never clobbers manual pricing)
 *   image       -> images[0]    (only when non-null)
 *   description -> description  (only when non-null)
 *   rating      -> specs.rating (only when non-null)
 */

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DRY_RUN = process.argv.includes("--dry-run");

// --- env ---------------------------------------------------------------------
function loadEnvLocal() {
  const file = path.join(root, ".env.local");
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !(m[1] in process.env)) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
}
loadEnvLocal();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!DRY_RUN && (!SUPABASE_URL || !SERVICE_KEY)) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY (set in env or .env.local).",
  );
  process.exit(1);
}

// --- load + validate ---------------------------------------------------------
const dataFile = path.join(root, "data", "products.json");
const products = JSON.parse(readFileSync(dataFile, "utf8"));

const REQUIRED_KEYS = [
  "slug", "name", "brand", "category",
  "weightKg", "maxLoadKg", "price", "image", "description", "rating",
];

const errors = [];
const seenSlugs = new Set();
products.forEach((p, i) => {
  const label = p?.slug || `#${i}`;
  for (const k of REQUIRED_KEYS) {
    if (!(k in p)) errors.push(`${label}: missing key "${k}"`);
  }
  if (typeof p.slug !== "string" || !/^[a-z0-9-]+$/.test(p.slug)) {
    errors.push(`${label}: slug must be kebab-case`);
  }
  if (seenSlugs.has(p.slug)) errors.push(`${label}: duplicate slug`);
  seenSlugs.add(p.slug);
  if (typeof p.name !== "string" || !p.name) errors.push(`${label}: name required`);
  if (typeof p.category !== "string" || !p.category) errors.push(`${label}: category required`);
  if (typeof p.weightKg !== "number" || p.weightKg < 0) errors.push(`${label}: weightKg must be a number >= 0`);
  if (typeof p.maxLoadKg !== "number" || p.maxLoadKg < 0) errors.push(`${label}: maxLoadKg must be a number >= 0`);
  for (const k of ["price", "rating"]) {
    if (p[k] !== null && typeof p[k] !== "number") errors.push(`${label}: ${k} must be number or null`);
  }
  for (const k of ["image", "description"]) {
    if (p[k] !== null && typeof p[k] !== "string") errors.push(`${label}: ${k} must be string or null`);
  }
});
if (errors.length) {
  console.error("products.json failed validation:\n  - " + errors.join("\n  - "));
  process.exit(1);
}
console.log(`Validated ${products.length} products in data/products.json`);

if (DRY_RUN) {
  for (const p of products) {
    console.log(
      `  [${p.category}] ${p.slug}  weight=${p.weightKg}kg maxLoad=${p.maxLoadKg}kg` +
        (p.price === null ? " (price unset)" : ` price=${p.price}`),
    );
  }
  console.log("Dry run — nothing written.");
  process.exit(0);
}

// --- import ------------------------------------------------------------------
const sb = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

function titleFromSlug(slug) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

async function resolveCategories(slugs) {
  const { data, error } = await sb.from("categories").select("id, slug");
  if (error) throw new Error(`fetch categories: ${error.message}`);
  const bySlug = new Map(data.map((c) => [c.slug, c.id]));
  for (const slug of slugs) {
    if (bySlug.has(slug)) continue;
    const { data: created, error: insErr } = await sb
      .from("categories")
      .insert({ slug, name: titleFromSlug(slug) })
      .select("id")
      .single();
    if (insErr) throw new Error(`create category "${slug}": ${insErr.message}`);
    console.log(`  created missing category: ${slug}`);
    bySlug.set(slug, created.id);
  }
  return bySlug;
}

async function main() {
  const categoryIds = await resolveCategories([...new Set(products.map((p) => p.category))]);

  const { data: existingRows, error: exErr } = await sb
    .from("products")
    .select("id, slug, specs")
    .in("slug", products.map((p) => p.slug));
  if (exErr) throw new Error(`fetch existing products: ${exErr.message}`);
  const existing = new Map(existingRows.map((r) => [r.slug, r]));

  let inserted = 0;
  let updated = 0;

  for (const p of products) {
    const specPatch = {
      brand: p.brand,
      weight_kg: p.weightKg,
      max_load_kg: p.maxLoadKg,
      ...(p.rating !== null ? { rating: p.rating } : {}),
    };
    const row = existing.get(p.slug);

    if (row) {
      // Update spec-derived fields only; keep manually-managed fields
      // (price, images, description, rating) unless the JSON provides them.
      const patch = {
        name: p.name,
        category_id: categoryIds.get(p.category),
        specs: { ...row.specs, ...specPatch },
      };
      if (p.price !== null) patch.price = p.price;
      if (p.description !== null) patch.description = p.description;
      if (p.image !== null) patch.images = [p.image];
      const { error } = await sb.from("products").update(patch).eq("id", row.id);
      if (error) throw new Error(`update ${p.slug}: ${error.message}`);
      updated += 1;
    } else {
      const { error } = await sb.from("products").insert({
        slug: p.slug,
        name: p.name,
        category_id: categoryIds.get(p.category),
        specs: specPatch,
        price: p.price,
        description: p.description,
        images: p.image ? [p.image] : [],
        condition: "new",
        stock_status: "made_to_order",
        // Imported rows start unpublished: price/images/description are still
        // null and must be filled in before the product goes live.
        is_published: false,
      });
      if (error) throw new Error(`insert ${p.slug}: ${error.message}`);
      inserted += 1;
    }
    console.log(`  ${row ? "updated " : "inserted"} ${p.slug}`);
  }

  console.log(`Done: ${inserted} inserted, ${updated} updated.`);
}

main().catch((e) => {
  console.error(e.message ?? e);
  process.exit(1);
});
