# BoxSpace Containers — Setup (Phase 1)

> _Transforming Steel Into Space_

Full-stack platform: **Next.js 15** (App Router, TypeScript) · **Tailwind v4** ·
**shadcn/ui** · **Framer Motion** · **Supabase** (Postgres + Auth + Storage).
Built to deploy on a **Hostinger VPS** — no Vercel-only features; all media goes
to Supabase Storage.

This document covers what Phase 1 delivers and how to get it running.

---

## 1. What Phase 1 includes

```
.
├── src/
│   ├── app/                  # App Router (layout, globals.css, placeholder home)
│   ├── components/ui/        # shadcn/ui components
│   ├── config/site.ts        # nav, brand, category→route mapping
│   ├── lib/
│   │   ├── env.ts            # env access + guards
│   │   ├── utils.ts          # cn() helper
│   │   └── supabase/         # browser / server / admin / middleware clients
│   └── types/database.ts     # typed schema (Database type)
├── middleware.ts             # refreshes Supabase auth session
├── supabase/
│   ├── config.toml           # Supabase CLI config
│   ├── migrations/           # schema → RLS → storage (run in order)
│   └── seed.sql              # 8 categories, ~12 products, projects, settings…
├── .env.example              # copy to .env.local
└── SETUP.md
```

Database tables: `categories`, `products`, `projects`, `customers`, `leads`,
`quote_requests`, `invoice_requests`, `site_stats`, `homepage_sections`,
`testimonials`, `blog_posts`, `app_settings`, `analytics_events`.

---

## 2. Prerequisites

- Node.js 18.18+ (built/tested on Node 24)
- A Supabase project (free tier is fine)
- Optional: [Supabase CLI](https://supabase.com/docs/guides/local-development) for migrations

---

## 3. Environment variables

Copy `.env.example` → `.env.local` and fill in:

| Variable | Required | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Project URL, e.g. `https://xxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Legacy `anon` key **or** a publishable key (`sb_publishable_…`) |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ (server) | Bypasses RLS — server only, never `NEXT_PUBLIC` |
| `NEXT_PUBLIC_SITE_URL` | ✅ | `http://localhost:3000` in dev; real domain in prod |
| `RESEND_API_KEY` / `EMAIL_FROM` / `ADMIN_NOTIFICATION_EMAIL` | ⬜ | Phase 3 (email) — leave blank for now |

Find these in the Supabase dashboard → **Project Settings → API**.

The app **builds and runs without these set** (Supabase calls simply no-op /
error until configured), so you can explore the UI before wiring the database.

---

## 4. Apply the database migrations

Pick whichever fits your workflow. **Always run migrations in filename order,
then the seed.**

### Option A — Supabase CLI against your hosted project (recommended)

```bash
supabase login
supabase link --project-ref <your-project-ref>
supabase db push                      # applies everything in supabase/migrations
psql "$(supabase db remote-url)" -f supabase/seed.sql   # load sample data
```

### Option B — Dashboard SQL Editor (no CLI)

In the Supabase dashboard → **SQL Editor**, paste and run, in this order:

1. `supabase/migrations/20260620120000_initial_schema.sql`
2. `supabase/migrations/20260620120100_rls_policies.sql`
3. `supabase/migrations/20260620120200_storage_buckets.sql`
4. `supabase/seed.sql`

### Option C — Local Supabase stack (Docker)

```bash
supabase start          # boots local Postgres/Studio/etc.
supabase db reset       # applies migrations AND runs seed.sql automatically
```

> **Acceptance check:** after this, anonymous (public) reads of `products`,
> `categories` and `projects` should work, while `quote_requests`, `leads` and
> `analytics_events` reject reads unless you're an admin. Sample data is present.

---

## 5. Create the first admin

Admin access (`/admin`, Phase 4) is gated by `customers.is_admin`, **not** a
hardcoded password. After signing up a user (Auth → Users, or via the portal in
Phase 3), promote them:

```sql
update public.customers
set is_admin = true
where email = 'you@example.com';
```

A `customers` profile row is auto-created on signup by the `handle_new_user`
trigger. Non-admins cannot promote themselves (enforced by a trigger).

---

## 6. Regenerate database types (optional but recommended)

`src/types/database.ts` is hand-authored to match the migrations. Once applied,
regenerate the authoritative version:

```bash
supabase gen types typescript --project-id <ref> --schema public > src/types/database.ts
```

---

## 7. Run the app

```bash
npm install      # already done if you're reading this
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint
```

---

## 8. Decisions I made — review / override these

| Topic | What I chose | Why / how to change |
| --- | --- | --- |
| **Brand green** | Full scale anchored on **`#4B5320`** at step `700` (`--color-brand-700`) | Edit the `@theme` block in `src/app/globals.css`. `--primary` points at `brand-700`. |
| **Next.js version** | Pinned to **15** (spec said "fixed"); `create-next-app` now ships 16 | Bump `next` + `eslint-config-next` in `package.json` if you'd rather run 16. |
| **Tailwind** | **v4** (CSS-first theming via `@theme`, no `tailwind.config.ts`) | Current default; works with shadcn. |
| **Category count** | Spec listed **6** categories in the schema but the homepage wants **8 cards**. I seeded **8** by adding *Refrigerated Containers* and *Custom Fabrication*. | Edit `supabase/seed.sql` + `src/config/site.ts` to change the set. |
| **Subcategories** | Modeled as `categories` rows with a `parent_id` (self-referential), rather than a separate column | Matches "with subcategory support". |
| **Quote cart line items** | Stored as `jsonb` (`quote_requests.items`) instead of a join table | Simpler for a cart; revisit if you need per-item querying. |
| **Heading font** | **Oswald** (condensed/industrial) for headings; Geist for body | Change in `src/app/layout.tsx`. |
| **Email provider** | **Resend** assumed for Phase 3 (not yet wired) | Tell me if you prefer SendGrid/Postmark/SMTP. |
| **Placeholder media** | `picsum.photos` images + a sample MP4 for the hero | Replace via the admin panel (Phase 4) once Storage is in use. |
| **Storage buckets** | `product-media`, `project-media` (public read, admin write), 500 MB/file | Adjust limits/MIME types in the storage migration. |
| **WhatsApp config** | Placeholder number `15551234567` in `app_settings` | Update the row (or via admin in Phase 4) — no redeploy needed. |

---

## Next: Phase 2 — Public site

Homepage (hero video, animated stats, category grid, featured products, project
carousel), category listing pages with filters, product detail, projects,
about/contact/blog, the quote flow shell, sticky nav, and the floating WhatsApp
button — all reading live Supabase data.
