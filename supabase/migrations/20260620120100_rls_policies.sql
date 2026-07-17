-- =============================================================================
-- BoxSpace Containers — Row Level Security
--   * public  : read published products/categories/projects/blog + site config
--   * customer: read/update own profile, read own quotes & invoice requests
--   * admin   : full access to everything (gated by customers.is_admin)
-- =============================================================================

-- Role helper. SECURITY DEFINER so it can read customers without tripping that
-- table's own RLS (avoids recursion in policies that call is_admin()).
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.customers
    where id = auth.uid() and is_admin = true
  );
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- Auto-create a customers profile row whenever an auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.customers (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Stop non-admins from promoting themselves to admin on profile update.
create or replace function public.prevent_admin_self_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    new.is_admin := old.is_admin;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_customers_no_escalation on public.customers;
create trigger trg_customers_no_escalation
  before update on public.customers
  for each row execute function public.prevent_admin_self_escalation();

-- Enable RLS everywhere -------------------------------------------------------
alter table public.categories        enable row level security;
alter table public.products          enable row level security;
alter table public.projects          enable row level security;
alter table public.customers         enable row level security;
alter table public.leads             enable row level security;
alter table public.quote_requests    enable row level security;
alter table public.invoice_requests  enable row level security;
alter table public.site_stats        enable row level security;
alter table public.homepage_sections enable row level security;
alter table public.testimonials      enable row level security;
alter table public.blog_posts        enable row level security;
alter table public.app_settings      enable row level security;
alter table public.analytics_events  enable row level security;

-- =============================================================================
-- PUBLIC-READ CONTENT (anon + authenticated may read published/active rows;
-- admins may do everything).
-- =============================================================================

-- categories
create policy "categories public read" on public.categories
  for select using (is_active = true);
create policy "categories admin all" on public.categories
  for all using (public.is_admin()) with check (public.is_admin());

-- products
create policy "products public read" on public.products
  for select using (is_published = true);
create policy "products admin all" on public.products
  for all using (public.is_admin()) with check (public.is_admin());

-- projects
create policy "projects public read" on public.projects
  for select using (is_published = true);
create policy "projects admin all" on public.projects
  for all using (public.is_admin()) with check (public.is_admin());

-- testimonials
create policy "testimonials public read" on public.testimonials
  for select using (is_published = true);
create policy "testimonials admin all" on public.testimonials
  for all using (public.is_admin()) with check (public.is_admin());

-- site_stats
create policy "site_stats public read" on public.site_stats
  for select using (is_active = true);
create policy "site_stats admin all" on public.site_stats
  for all using (public.is_admin()) with check (public.is_admin());

-- homepage_sections
create policy "homepage public read" on public.homepage_sections
  for select using (is_active = true);
create policy "homepage admin all" on public.homepage_sections
  for all using (public.is_admin()) with check (public.is_admin());

-- blog_posts
create policy "blog public read" on public.blog_posts
  for select using (is_published = true);
create policy "blog admin all" on public.blog_posts
  for all using (public.is_admin()) with check (public.is_admin());

-- app_settings (non-sensitive site config: whatsapp number, contact, socials)
create policy "settings public read" on public.app_settings
  for select using (true);
create policy "settings admin write" on public.app_settings
  for all using (public.is_admin()) with check (public.is_admin());

-- =============================================================================
-- CUSTOMERS (own profile; admins see all)
-- =============================================================================
create policy "customers read own" on public.customers
  for select using (id = auth.uid() or public.is_admin());
create policy "customers update own" on public.customers
  for update using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());
-- INSERT is handled by the handle_new_user() trigger (security definer);
-- no public INSERT policy is granted. Admins may insert/delete:
create policy "customers admin insert" on public.customers
  for insert with check (public.is_admin());
create policy "customers admin delete" on public.customers
  for delete using (public.is_admin());

-- =============================================================================
-- FUNNEL WRITES (anyone may submit; only owner/admin may read back)
-- =============================================================================

-- leads: public may create; only admins may read/manage
create policy "leads public insert" on public.leads
  for insert with check (true);
create policy "leads admin read" on public.leads
  for select using (public.is_admin());
create policy "leads admin write" on public.leads
  for update using (public.is_admin()) with check (public.is_admin());
create policy "leads admin delete" on public.leads
  for delete using (public.is_admin());

-- quote_requests: public may submit; customer reads own, admin reads all
create policy "quotes public insert" on public.quote_requests
  for insert with check (true);
create policy "quotes read own or admin" on public.quote_requests
  for select using (
    public.is_admin()
    or (customer_id is not null and customer_id = auth.uid())
  );
create policy "quotes admin update" on public.quote_requests
  for update using (public.is_admin()) with check (public.is_admin());
create policy "quotes admin delete" on public.quote_requests
  for delete using (public.is_admin());

-- invoice_requests: public may submit; customer reads own, admin reads all
create policy "invoices public insert" on public.invoice_requests
  for insert with check (true);
create policy "invoices read own or admin" on public.invoice_requests
  for select using (
    public.is_admin()
    or (customer_id is not null and customer_id = auth.uid())
  );
create policy "invoices admin update" on public.invoice_requests
  for update using (public.is_admin()) with check (public.is_admin());
create policy "invoices admin delete" on public.invoice_requests
  for delete using (public.is_admin());

-- =============================================================================
-- ANALYTICS (anyone may emit events; only admins may read)
-- =============================================================================
create policy "analytics public insert" on public.analytics_events
  for insert with check (true);
create policy "analytics admin read" on public.analytics_events
  for select using (public.is_admin());
create policy "analytics admin delete" on public.analytics_events
  for delete using (public.is_admin());
