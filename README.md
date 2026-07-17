# BoxSpace Containers

**Transforming Steel Into Space** — a global supplier of new & used shipping
containers, container homes, container offices and modular buildings.

Full-stack platform built with **Next.js 15**, **Supabase**, **Tailwind v4** and
**shadcn/ui**, designed to deploy on a **Hostinger VPS**.

## Quick start

```bash
npm install
cp .env.example .env.local   # then fill in your Supabase keys
npm run dev                  # http://localhost:3000
```

See **[SETUP.md](./SETUP.md)** for environment variables, database migrations,
the first-admin bootstrap, and the list of decisions to review.

## Build status

- **Phase 1 — Data model & scaffolding ✅** (schema, RLS, storage, seed, theme)
- Phase 2 — Public site _(next)_
- Phase 3 — Quote & invoice flows
- Phase 4 — Admin panel
- Phase 5 — SEO & performance
