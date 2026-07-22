# Product image workflow (BoxSpace)

The seed files ship with `picsum.photos` **placeholder** image URLs so the site
renders during development. Before launch, replace them with images you are
legally entitled to use.

## Where images may legitimately come from

- **Your own photography** of your own stock (best — free and unambiguous).
- **Your supplier's images that you have written permission to use.**
- **Properly-licensed stock photos** (Unsplash/Pexels free licence, or a paid
  library such as Adobe Stock / Shutterstock — keep the licence receipt).
- **Manufacturer press/marketing kits** that grant reseller usage rights.

> Do **not** copy photography from another company's website without a licence.
> Product photos are copyrighted works; reusing them on a commercial site is
> infringement even if the product is identical.

## How images are stored

The `products.images` column is a `text[]` of public URLs. Two options:

### Option A — Supabase Storage (recommended for production)
1. Upload files to the `product-images` bucket (see
   `supabase/migrations/20260620120200_storage_buckets.sql`).
2. Copy each file's **public URL**.
3. Paste those URLs into the `array[...]` for the matching product in
   `supabase/seed_containers.sql`, then re-run the seed.

### Option B — External licensed URL
Paste the licensed hotlink URL directly into the product's `array[...]`.
Confirm the licence permits hotlinking.

## Bulk replace the placeholders

Each product's gallery uses a predictable seed slug, e.g.
`bsc-20ft-new-1`, `bsc-20ft-new-2`, ... Find them with:

```bash
grep -o "picsum.photos/seed/bsc-[a-z0-9-]*" supabase/seed_containers.sql | sort -u
```

Swap them one product at a time, or script a find/replace once your final
image URLs are known.
