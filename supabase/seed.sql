-- =============================================================================
-- BoxSpace Containers — Seed data
-- Idempotent: safe to run multiple times (ON CONFLICT guards).
-- Placeholder media uses picsum.photos / a sample MP4 — swap in real uploads
-- via the admin panel later.
-- Run automatically by `supabase db reset`, or manually:
--   psql "$DATABASE_URL" -f supabase/seed.sql
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Categories (8 top-level — see "decisions to override" note in SETUP.md)
-- ---------------------------------------------------------------------------
insert into public.categories (name, slug, description, icon, image_url, sort_order) values
  ('New Containers',          'new-containers',          'Brand-new, one-trip shipping containers in 20ft, 40ft and high-cube sizes.', 'container',  'https://picsum.photos/seed/new-containers/1200/800', 1),
  ('Used Containers',         'used-containers',         'Certified wind- and water-tight used containers at unbeatable value.',       'package',    'https://picsum.photos/seed/used-containers/1200/800', 2),
  ('Container Homes',         'container-homes',         'Turnkey container homes — from studios to multi-unit family residences.',    'home',       'https://picsum.photos/seed/container-homes/1200/800', 3),
  ('Container Offices',       'container-offices',       'Portable, insulated office spaces ready to deploy on any site.',             'briefcase',  'https://picsum.photos/seed/container-offices/1200/800', 4),
  ('Modular Buildings',       'modular-buildings',       'Scalable modular classrooms, clinics and accommodation blocks.',             'building-2', 'https://picsum.photos/seed/modular-buildings/1200/800', 5),
  ('Storage Units',           'storage-units',           'Secure on-site and self-storage container units of every size.',             'warehouse',  'https://picsum.photos/seed/storage-units/1200/800', 6),
  ('Refrigerated Containers', 'refrigerated-containers', 'Temperature-controlled reefer containers for cold-chain storage.',           'snowflake',  'https://picsum.photos/seed/reefer/1200/800', 7),
  ('Custom Fabrication',      'custom-fabrication',      'Bespoke container conversions — pop-up shops, cafes, workshops and more.',   'wrench',     'https://picsum.photos/seed/custom-fab/1200/800', 8)
on conflict (slug) do nothing;

-- A few subcategories to demonstrate parent/child support
insert into public.categories (name, slug, description, parent_id, sort_order)
select v.name, v.slug, v.description, c.id, v.sort_order
from (values
  ('20ft Standard',     '20ft-standard',     'New 20ft standard dry containers', 'new-containers', 1),
  ('40ft High Cube',    '40ft-high-cube',    'New 40ft high-cube containers',     'new-containers', 2),
  ('Studio Homes',      'studio-homes',      'Compact single-module homes',       'container-homes', 1),
  ('Family Homes',      'family-homes',      'Multi-module family residences',     'container-homes', 2),
  ('Site Offices',      'site-offices',      'On-site portable offices',          'container-offices', 1)
) as v(name, slug, description, parent_slug, sort_order)
join public.categories c on c.slug = v.parent_slug
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- Products (~12 across categories)
-- ---------------------------------------------------------------------------
insert into public.products
  (category_id, name, slug, sku, short_description, description, specs, price, condition, stock_status, images, is_featured, sort_order)
select c.id, p.name, p.slug, p.sku, p.short_description, p.description, p.specs::jsonb, p.price, p.condition::public.product_condition, p.stock_status::public.stock_status, p.images, p.is_featured, p.sort_order
from (values
  ('new-containers', '20ft Standard Container (New)', '20ft-standard-new', 'BSC-NC-20S',
    'One-trip 20ft standard container — pristine condition.',
    'Our 20ft standard new (one-trip) container offers a versatile, secure and weatherproof steel box ideal for storage, shipping or conversion projects. CSC-plated and ready for immediate delivery.',
    '{"length":"20ft","width":"8ft","height":"8ft 6in","capacity":"1,172 cu ft","max_payload":"28,200 kg","doors":"Double cargo doors","grade":"One-trip"}',
    2950, 'new', 'in_stock',
    array['https://picsum.photos/seed/20ft-new-1/1200/800','https://picsum.photos/seed/20ft-new-2/1200/800'], true, 1),

  ('new-containers', '40ft High Cube Container (New)', '40ft-high-cube-new', 'BSC-NC-40HC',
    'Spacious 40ft high-cube — extra foot of headroom.',
    'The 40ft high-cube new container provides maximum internal volume with an additional foot of height over standard units. Perfect for bulky cargo, workshops and conversions.',
    '{"length":"40ft","width":"8ft","height":"9ft 6in","capacity":"2,694 cu ft","max_payload":"28,600 kg","doors":"Double cargo doors","grade":"One-trip"}',
    4850, 'new', 'in_stock',
    array['https://picsum.photos/seed/40hc-new-1/1200/800','https://picsum.photos/seed/40hc-new-2/1200/800'], true, 2),

  ('new-containers', '40ft Standard Container (New)', '40ft-standard-new', 'BSC-NC-40S',
    'Classic 40ft new container for high-volume storage.',
    'A brand-new 40ft standard container delivering excellent capacity and durability for shipping, storage and modification.',
    '{"length":"40ft","width":"8ft","height":"8ft 6in","capacity":"2,390 cu ft","max_payload":"28,800 kg","grade":"One-trip"}',
    4200, 'new', 'in_stock',
    array['https://picsum.photos/seed/40ft-new-1/1200/800'], false, 3),

  ('used-containers', '20ft Used Container (Wind & Watertight)', '20ft-used-wwt', 'BSC-UC-20W',
    'Certified wind- and water-tight 20ft used container.',
    'A cost-effective 20ft used container inspected and certified wind- and water-tight (WWT). Cosmetic wear only; structurally sound and cargo-worthy.',
    '{"length":"20ft","width":"8ft","height":"8ft 6in","capacity":"1,172 cu ft","grade":"WWT / Cargo Worthy"}',
    1650, 'used', 'in_stock',
    array['https://picsum.photos/seed/20ft-used-1/1200/800','https://picsum.photos/seed/20ft-used-2/1200/800'], true, 4),

  ('used-containers', '40ft Used High Cube Container', '40ft-used-high-cube', 'BSC-UC-40HC',
    'Roomy 40ft used high-cube at a great price.',
    'A 40ft used high-cube container offering huge capacity for storage or conversion. Inspected, WWT certified and ready to ship.',
    '{"length":"40ft","width":"8ft","height":"9ft 6in","capacity":"2,694 cu ft","grade":"WWT"}',
    2750, 'used', 'limited',
    array['https://picsum.photos/seed/40hc-used-1/1200/800'], false, 5),

  ('container-homes', 'Studio Container Home (20ft)', '20ft-studio-home', 'BSC-CH-20ST',
    'Fully finished 20ft studio home — move-in ready.',
    'A beautifully finished 20ft container studio home complete with insulation, electrics, plumbing, kitchenette and bathroom. Ideal as a guest suite, rental or off-grid retreat.',
    '{"footprint":"20ft x 8ft","bedrooms":1,"bathrooms":1,"insulation":"Spray foam","includes":"Kitchenette, bathroom, A/C, electrics"}',
    18500, 'new', 'made_to_order',
    array['https://picsum.photos/seed/studio-home-1/1200/800','https://picsum.photos/seed/studio-home-2/1200/800'], true, 6),

  ('container-homes', '2-Bedroom Container Home (40ft)', '40ft-2bed-home', 'BSC-CH-40-2B',
    'Spacious two-bedroom family home from two 40ft units.',
    'A modern two-bedroom container home built from joined 40ft modules featuring an open-plan living area, full kitchen, bathroom and two bedrooms. Customisable finishes available.',
    '{"footprint":"40ft x 16ft","bedrooms":2,"bathrooms":1,"insulation":"Spray foam","includes":"Full kitchen, living area, 2 bedrooms"}',
    52000, 'new', 'made_to_order',
    array['https://picsum.photos/seed/2bed-home-1/1200/800','https://picsum.photos/seed/2bed-home-2/1200/800'], true, 7),

  ('container-offices', 'Single Container Office (20ft)', '20ft-single-office', 'BSC-CO-20',
    'Insulated, powered 20ft portable office.',
    'A ready-to-use 20ft container office with insulation, lighting, power sockets, A/C and a personnel door with window. Deploys to any site in hours.',
    '{"footprint":"20ft x 8ft","desks":2,"includes":"A/C, lighting, sockets, window, vinyl floor"}',
    7900, 'new', 'in_stock',
    array['https://picsum.photos/seed/office-20-1/1200/800'], false, 8),

  ('container-offices', 'Double Office Unit (40ft)', '40ft-double-office', 'BSC-CO-40D',
    'Two-room 40ft site office with partition.',
    'A 40ft container office partitioned into two rooms — perfect as a site office plus meeting room. Fully insulated with electrics, A/C and durable flooring.',
    '{"footprint":"40ft x 8ft","rooms":2,"includes":"Partition, 2x A/C, lighting, sockets"}',
    12500, 'new', 'in_stock',
    array['https://picsum.photos/seed/office-40-1/1200/800','https://picsum.photos/seed/office-40-2/1200/800'], true, 9),

  ('modular-buildings', 'Modular Classroom Unit', 'modular-classroom', 'BSC-MB-CLS',
    'Bright, code-compliant modular classroom.',
    'A modular classroom building designed for schools and training centres. Insulated, naturally lit and expandable into multi-room blocks.',
    '{"footprint":"40ft x 10ft","capacity":"30 students","includes":"Windows, HVAC, whiteboard wall, dual exits"}',
    34000, 'new', 'made_to_order',
    array['https://picsum.photos/seed/classroom-1/1200/800'], false, 10),

  ('storage-units', '20ft Secure Storage Unit', '20ft-storage-unit', 'BSC-SU-20',
    'Lockable 20ft on-site storage container.',
    'A robust 20ft storage container with a high-security lockbox — perfect for tools, equipment and inventory on site or at home.',
    '{"length":"20ft","width":"8ft","height":"8ft 6in","security":"Lockbox + heavy padlock"}',
    1990, 'new', 'in_stock',
    array['https://picsum.photos/seed/storage-20-1/1200/800'], false, 11),

  ('refrigerated-containers', '40ft Refrigerated Reefer', '40ft-reefer', 'BSC-RC-40',
    'Temperature-controlled 40ft reefer container.',
    'A 40ft refrigerated container (reefer) with a digital temperature controller maintaining anything from frozen to chilled. Ideal for cold-chain storage and transport.',
    '{"length":"40ft","width":"8ft","height":"9ft 6in","temp_range":"-25C to +25C","power":"3-phase"}',
    16500, 'refurbished', 'limited',
    array['https://picsum.photos/seed/reefer-1/1200/800','https://picsum.photos/seed/reefer-2/1200/800'], true, 12)
) as p(category_slug, name, slug, sku, short_description, description, specs, price, condition, stock_status, images, is_featured, sort_order)
join public.categories c on c.slug = p.category_slug
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- Projects (showcase)
-- ---------------------------------------------------------------------------
insert into public.projects
  (title, slug, type, summary, description, images, testimonial, testimonial_author, specs, location, completed_at, is_featured, is_published, sort_order)
values
  ('Coastal Container Home', 'coastal-container-home', 'Container Home',
    'A sustainable 3-module beachfront home with panoramic glazing.',
    'BoxSpace transformed three 40ft high-cube containers into a stunning coastal residence featuring a wraparound deck, solar power and floor-to-ceiling ocean views.',
    array['https://picsum.photos/seed/proj-coastal-1/1200/800','https://picsum.photos/seed/proj-coastal-2/1200/800'],
    'BoxSpace turned our dream of a steel beach house into reality — on time and on budget.',
    'The Avery Family',
    '{"modules":3,"area":"96 sqm","bedrooms":3,"features":"Solar, deck, glazing"}',
    'Cape Coast', '2025-11-15', true, true, 1),

  ('Tech Park Office Complex', 'tech-park-office-complex', 'Container Offices',
    'A 12-unit modular office campus delivered in 6 weeks.',
    'A fast-track office complex of 12 interconnected container units providing flexible workspace, meeting rooms and a cafeteria for a growing technology firm.',
    array['https://picsum.photos/seed/proj-techpark-1/1200/800','https://picsum.photos/seed/proj-techpark-2/1200/800'],
    'The speed of deployment was unmatched. Our team was working in their new offices within weeks.',
    'Northwind Technologies',
    '{"units":12,"area":"480 sqm","build_time":"6 weeks"}',
    'Industrial Zone', '2026-02-20', true, true, 2),

  ('Remote Mining Accommodation', 'remote-mining-accommodation', 'Modular Buildings',
    'A 40-bed worker accommodation village for a remote site.',
    'A complete modular accommodation village including sleeping quarters, ablution blocks and a mess hall, engineered to withstand harsh remote conditions.',
    array['https://picsum.photos/seed/proj-mining-1/1200/800','https://picsum.photos/seed/proj-mining-2/1200/800'],
    'Durable, comfortable and delivered to the middle of nowhere without a hitch.',
    'Granite Ridge Mining',
    '{"beds":40,"buildings":8,"includes":"Ablutions, mess hall"}',
    'Remote Site', '2025-09-30', false, true, 3)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- Testimonials
-- ---------------------------------------------------------------------------
insert into public.testimonials (author_name, author_role, author_company, content, rating, sort_order) values
  ('Sarah Mensah', 'Operations Director', 'Harbour Logistics', 'BoxSpace delivered 20 containers across three countries flawlessly. Our go-to supplier now.', 5, 1),
  ('David Okoro', 'Homeowner', null, 'My container home exceeded every expectation. Quality craftsmanship and brilliant support throughout.', 5, 2),
  ('Lena Fischer', 'Project Manager', 'BuildRight Construction', 'Reliable, fast and competitively priced. The modular offices were on site in record time.', 5, 3)
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- Site stats (animated counters)
-- ---------------------------------------------------------------------------
insert into public.site_stats (key, label, value, suffix, icon, sort_order) values
  ('containers_sold',  'Containers Sold',     12500, '+', 'container', 1),
  ('homes_delivered',  'Homes Delivered',       480, '+', 'home',      2),
  ('countries_served', 'Countries Served',       37, '',  'globe',     3),
  ('satisfaction',     'Customer Satisfaction',  98, '%', 'smile',     4)
on conflict (key) do update set
  label = excluded.label, value = excluded.value, suffix = excluded.suffix, icon = excluded.icon;

-- ---------------------------------------------------------------------------
-- Homepage sections (structured — edited in admin, never raw HTML)
-- ---------------------------------------------------------------------------
insert into public.homepage_sections (section_key, title, subtitle, body, media_url, content, sort_order) values
  ('hero',
   'Premium Shipping Containers & Modular Spaces',
   'Transforming Steel Into Space',
   'New & used containers, container homes, offices and modular buildings — delivered worldwide.',
   'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
   '{"ctas":[{"label":"Browse Products","href":"/containers","variant":"primary"},{"label":"Request Quote","href":"/quote","variant":"secondary"},{"label":"Chat on WhatsApp","href":"whatsapp","variant":"whatsapp"}]}',
   1),
  ('featured',
   'Featured Products',
   null,
   'Our most popular containers and modular spaces.',
   null,
   '{"limit":6}',
   2),
  ('cta',
   'Ready to Transform Steel Into Space?',
   'Get a tailored quote in 24 hours',
   'Tell us what you need and our team will put together a competitive quote.',
   null,
   '{"buttons":[{"label":"Request a Quote","href":"/quote"},{"label":"Chat on WhatsApp","href":"whatsapp"}]}',
   3)
on conflict (section_key) do update set
  title = excluded.title, subtitle = excluded.subtitle, body = excluded.body,
  media_url = excluded.media_url, content = excluded.content;

-- ---------------------------------------------------------------------------
-- App settings (WhatsApp + contact config — editable in admin, no redeploy)
-- ---------------------------------------------------------------------------
insert into public.app_settings (key, value, description) values
  ('whatsapp_number',          '"15551234567"'::jsonb,                                          'WhatsApp number in international format, digits only (no +).'),
  ('whatsapp_default_message', '"Hello BoxSpace! I am interested in your containers."'::jsonb,  'Pre-filled WhatsApp chat message.'),
  ('contact_email',            '"sales@boxspacecontainers.com"'::jsonb,                         'Primary contact email.'),
  ('contact_phone',            '"+1 (555) 123-4567"'::jsonb,                                    'Primary contact phone (display format).'),
  ('company_address',          '"123 Steelworks Ave, Industrial Park"'::jsonb,                  'Company address shown in footer/contact.'),
  ('social_links',             '{"facebook":"https://facebook.com","instagram":"https://instagram.com","linkedin":"https://linkedin.com","youtube":"https://youtube.com"}'::jsonb, 'Social profile URLs.')
on conflict (key) do update set value = excluded.value, description = excluded.description;

-- ---------------------------------------------------------------------------
-- Blog posts
-- ---------------------------------------------------------------------------
insert into public.blog_posts (title, slug, excerpt, content, cover_image, author, tags, is_published, published_at) values
  ('New vs Used Shipping Containers: Which Is Right for You?', 'new-vs-used-containers',
   'A practical guide to choosing between one-trip and used containers for your project.',
   E'## New vs Used Containers\n\nChoosing between a new (one-trip) and a used container comes down to budget, appearance and intended use.\n\n### When to choose new\n- Conversions and homes where appearance matters\n- Long-term installations\n\n### When to choose used\n- Pure storage\n- Tight budgets\n\nContact BoxSpace and we will help you pick the right unit.',
   'https://picsum.photos/seed/blog-newused/1200/630', 'BoxSpace Team', array['guides','containers'], true, now() - interval '10 days'),

  ('5 Stunning Container Home Designs', 'container-home-designs',
   'From minimalist studios to multi-module family homes — inspiration for your build.',
   E'## 5 Stunning Container Home Designs\n\nContainer architecture keeps pushing boundaries. Here are five designs our clients love.\n\n1. The Off-Grid Studio\n2. The Courtyard Home\n3. The Stacked Duplex\n4. The Glass-Front Retreat\n5. The Modular Family Home\n\nReady to build yours? Request a quote today.',
   'https://picsum.photos/seed/blog-homes/1200/630', 'BoxSpace Team', array['design','homes'], true, now() - interval '3 days')
on conflict (slug) do nothing;
