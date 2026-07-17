-- =============================================================================
-- BoxSpace Containers — Initial schema
-- Phase 1: core data model (products, categories, projects, quotes, invoices,
-- customers, leads) + site config, homepage builder, blog, analytics.
-- =============================================================================

-- Extensions ------------------------------------------------------------------
create extension if not exists "pgcrypto";   -- gen_random_uuid()
create extension if not exists "citext";      -- case-insensitive email

-- Enums -----------------------------------------------------------------------
do $$ begin
  create type public.stock_status as enum ('in_stock', 'limited', 'made_to_order', 'out_of_stock');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.product_condition as enum ('new', 'used', 'refurbished');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.quote_status as enum ('new', 'reviewing', 'quoted', 'won', 'lost', 'archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.invoice_type as enum ('proforma', 'commercial', 'bulk');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.invoice_request_status as enum ('new', 'processing', 'invoiced', 'paid', 'cancelled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.lead_source as enum ('web_form', 'whatsapp', 'quote_cart', 'invoice_request', 'phone', 'email', 'referral', 'other');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.lead_status as enum ('new', 'contacted', 'qualified', 'converted', 'lost');
exception when duplicate_object then null; end $$;

-- Shared helpers --------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =============================================================================
-- categories  (self-referential for subcategory support)
-- =============================================================================
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  parent_id   uuid references public.categories(id) on delete set null,
  name        text not null,
  slug        text not null unique,
  description text,
  icon        text,                      -- lucide icon name for category cards
  image_url   text,
  sort_order  integer not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists categories_parent_id_idx on public.categories(parent_id);
create index if not exists categories_active_idx on public.categories(is_active);

create trigger trg_categories_updated_at
  before update on public.categories
  for each row execute function public.set_updated_at();

-- =============================================================================
-- products
-- =============================================================================
create table if not exists public.products (
  id                uuid primary key default gen_random_uuid(),
  category_id       uuid references public.categories(id) on delete set null,
  name              text not null,
  slug              text not null unique,
  sku               text,
  short_description text,
  description       text,
  specs             jsonb not null default '{}'::jsonb,   -- {"size":"40ft","condition":"new",...}
  price             numeric(12,2),
  currency          text not null default 'USD',
  condition         public.product_condition,
  stock_status      public.stock_status not null default 'in_stock',
  images            text[] not null default '{}',         -- Supabase Storage public URLs
  videos            text[] not null default '{}',
  is_featured       boolean not null default false,
  is_published      boolean not null default true,
  sort_order        integer not null default 0,
  view_count        integer not null default 0,
  meta_title        text,
  meta_description  text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index if not exists products_category_id_idx on public.products(category_id);
create index if not exists products_published_idx on public.products(is_published);
create index if not exists products_featured_idx on public.products(is_featured);
create index if not exists products_specs_idx on public.products using gin (specs);

create trigger trg_products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- =============================================================================
-- projects  (showcase)
-- =============================================================================
create table if not exists public.projects (
  id                 uuid primary key default gen_random_uuid(),
  title              text not null,
  slug               text not null unique,
  type               text,                       -- e.g. "Container Home", "Office Park"
  summary            text,
  description        text,
  images             text[] not null default '{}',
  videos             text[] not null default '{}',
  testimonial        text,
  testimonial_author text,
  specs              jsonb not null default '{}'::jsonb,
  location           text,
  completed_at       date,
  is_featured        boolean not null default false,
  is_published       boolean not null default true,
  sort_order         integer not null default 0,
  meta_title         text,
  meta_description   text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
create index if not exists projects_published_idx on public.projects(is_published);
create index if not exists projects_featured_idx on public.projects(is_featured);

create trigger trg_projects_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

-- =============================================================================
-- customers  (1:1 profile for an auth.users row; powers the customer portal)
-- is_admin gates the /admin panel — set manually for the first admin.
-- =============================================================================
create table if not exists public.customers (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       citext,
  full_name   text,
  phone       text,
  company     text,
  country     text,
  address     text,
  avatar_url  text,
  is_admin    boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists customers_is_admin_idx on public.customers(is_admin);

create trigger trg_customers_updated_at
  before update on public.customers
  for each row execute function public.set_updated_at();

-- =============================================================================
-- leads  (source tracking across every funnel entry point)
-- =============================================================================
create table if not exists public.leads (
  id                  uuid primary key default gen_random_uuid(),
  customer_id         uuid references public.customers(id) on delete set null,
  name                text,
  email               citext,
  phone               text,
  company             text,
  country             text,
  source              public.lead_source not null default 'web_form',
  status              public.lead_status not null default 'new',
  message             text,
  product_id          uuid references public.products(id) on delete set null,
  quote_request_id    uuid,
  invoice_request_id  uuid,
  metadata            jsonb not null default '{}'::jsonb,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
create index if not exists leads_source_idx on public.leads(source);
create index if not exists leads_status_idx on public.leads(status);
create index if not exists leads_created_at_idx on public.leads(created_at desc);

create trigger trg_leads_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();

-- =============================================================================
-- quote_requests  (quote cart submissions; line items stored as jsonb)
-- items: [{ "product_id","name","slug","quantity","custom_specs","notes" }]
-- =============================================================================
create table if not exists public.quote_requests (
  id            uuid primary key default gen_random_uuid(),
  customer_id   uuid references public.customers(id) on delete set null,
  full_name     text not null,
  email         citext not null,
  phone         text,
  company       text,
  country       text,
  items         jsonb not null default '[]'::jsonb,
  custom_specs  jsonb not null default '{}'::jsonb,
  notes         text,
  status        public.quote_status not null default 'new',
  total_estimate numeric(12,2),
  source        public.lead_source not null default 'quote_cart',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists quote_requests_status_idx on public.quote_requests(status);
create index if not exists quote_requests_customer_idx on public.quote_requests(customer_id);
create index if not exists quote_requests_created_at_idx on public.quote_requests(created_at desc);

create trigger trg_quote_requests_updated_at
  before update on public.quote_requests
  for each row execute function public.set_updated_at();

-- =============================================================================
-- invoice_requests
-- =============================================================================
create table if not exists public.invoice_requests (
  id               uuid primary key default gen_random_uuid(),
  customer_id      uuid references public.customers(id) on delete set null,
  full_name        text not null,
  company_name     text,
  email            citext not null,
  phone            text,
  country          text,
  product_id       uuid references public.products(id) on delete set null,
  product_name     text,
  quantity         integer not null default 1 check (quantity > 0),
  delivery_address text,
  invoice_type     public.invoice_type not null default 'proforma',
  status           public.invoice_request_status not null default 'new',
  notes            text,
  invoice_number   text,
  invoice_url      text,                 -- admin-uploaded PDF (Supabase Storage)
  issued_at        timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index if not exists invoice_requests_status_idx on public.invoice_requests(status);
create index if not exists invoice_requests_customer_idx on public.invoice_requests(customer_id);
create index if not exists invoice_requests_created_at_idx on public.invoice_requests(created_at desc);

create trigger trg_invoice_requests_updated_at
  before update on public.invoice_requests
  for each row execute function public.set_updated_at();

-- Deferred FKs from leads -> quote/invoice requests (created after those tables)
alter table public.leads
  add constraint leads_quote_request_fk
  foreign key (quote_request_id) references public.quote_requests(id) on delete set null;
alter table public.leads
  add constraint leads_invoice_request_fk
  foreign key (invoice_request_id) references public.invoice_requests(id) on delete set null;

-- =============================================================================
-- site_stats  (animated homepage counters; editable in admin)
-- =============================================================================
create table if not exists public.site_stats (
  id          uuid primary key default gen_random_uuid(),
  key         text not null unique,
  label       text not null,
  value       numeric not null default 0,
  suffix      text,                       -- '+', '%', 'k'
  prefix      text,
  icon        text,
  sort_order  integer not null default 0,
  is_active   boolean not null default true,
  updated_at  timestamptz not null default now()
);

create trigger trg_site_stats_updated_at
  before update on public.site_stats
  for each row execute function public.set_updated_at();

-- =============================================================================
-- homepage_sections  (structured homepage builder — no raw HTML)
-- =============================================================================
create table if not exists public.homepage_sections (
  id          uuid primary key default gen_random_uuid(),
  section_key text not null unique,       -- 'hero', 'stats', 'featured', 'cta'...
  title       text,
  subtitle    text,
  body        text,
  media_url   text,
  content     jsonb not null default '{}'::jsonb,   -- flexible per-section payload
  is_active   boolean not null default true,
  sort_order  integer not null default 0,
  updated_at  timestamptz not null default now()
);

create trigger trg_homepage_sections_updated_at
  before update on public.homepage_sections
  for each row execute function public.set_updated_at();

-- =============================================================================
-- testimonials
-- =============================================================================
create table if not exists public.testimonials (
  id              uuid primary key default gen_random_uuid(),
  author_name     text not null,
  author_role     text,
  author_company  text,
  content         text not null,
  rating          integer check (rating between 1 and 5),
  avatar_url      text,
  is_published    boolean not null default true,
  sort_order      integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create trigger trg_testimonials_updated_at
  before update on public.testimonials
  for each row execute function public.set_updated_at();

-- =============================================================================
-- blog_posts  (simple CMS-backed blog)
-- =============================================================================
create table if not exists public.blog_posts (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  slug             text not null unique,
  excerpt          text,
  content          text,                  -- markdown
  cover_image      text,
  author           text,
  tags             text[] not null default '{}',
  is_published     boolean not null default false,
  published_at     timestamptz,
  meta_title       text,
  meta_description text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index if not exists blog_posts_published_idx on public.blog_posts(is_published, published_at desc);

create trigger trg_blog_posts_updated_at
  before update on public.blog_posts
  for each row execute function public.set_updated_at();

-- =============================================================================
-- app_settings  (key/value config: WhatsApp number, contact info, socials)
-- =============================================================================
create table if not exists public.app_settings (
  key         text primary key,
  value       jsonb not null default '{}'::jsonb,
  description text,
  updated_at  timestamptz not null default now()
);

create trigger trg_app_settings_updated_at
  before update on public.app_settings
  for each row execute function public.set_updated_at();

-- =============================================================================
-- analytics_events  (lightweight event counting for the admin dashboard)
-- =============================================================================
create table if not exists public.analytics_events (
  id          bigint generated always as identity primary key,
  event_type  text not null,             -- 'page_view','whatsapp_click','product_view','quote_submit','invoice_submit'
  path        text,
  product_id  uuid references public.products(id) on delete set null,
  referrer    text,
  session_id  text,
  metadata    jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);
create index if not exists analytics_events_type_idx on public.analytics_events(event_type);
create index if not exists analytics_events_created_at_idx on public.analytics_events(created_at desc);
create index if not exists analytics_events_product_idx on public.analytics_events(product_id);
