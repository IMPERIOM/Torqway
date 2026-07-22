-- ============================================================================
-- BoxSpace — Containers catalogue seed (ORIGINAL CONTENT)
-- ----------------------------------------------------------------------------
-- Covers the three container categories: new-containers, used-containers,
-- refrigerated-containers.
--
-- * All names, short_descriptions and descriptions are original BoxSpace copy.
-- * `specs` are factual, non-copyrightable industry-standard container data.
-- * `price` values are placeholder GBP figures — adjust to your real pricing.
-- * `images` use picsum placeholders. Replace each URL with your OWN or
--   properly-licensed photography (or Supabase Storage public URLs). See
--   scripts/import-product-images.md for a drop-in workflow.
--
-- Safe to re-run: upserts on the unique `slug`.
-- ============================================================================

insert into public.products
  (category_id, name, slug, sku, short_description, description, specs, price, currency, condition, stock_status, images, is_featured, sort_order)
select c.id, p.name, p.slug, p.sku, p.short_description, p.description, p.specs::jsonb, p.price, 'GBP',
       p.condition::public.product_condition, p.stock_status::public.stock_status, p.images, p.is_featured, p.sort_order
from (values
  -- ------------------------------------------------------------------ NEW ---
  ('new-containers', '10ft Standard Container (New)', '10ft-standard-new', 'BSC-NC-10S',
    'Compact one-trip 10ft container — pristine and site-ready.',
    'Our 10ft new (one-trip) container is the ideal compact steel store for tight yards, gardens and small sites. Manufactured to CSC standard from Corten weathering steel, fitted with lockbox and marine-grade plywood floor, and delivered wind- and water-tight straight from its single voyage.',
    '{"length":"10ft","width":"8ft","height":"8ft 6in","internal_volume":"563 cu ft","tare_weight":"1,300 kg","max_payload":"10,000 kg","doors":"Double cargo doors","floor":"28mm marine plywood","grade":"One-trip"}',
    2450, 'new', 'in_stock',
    array[
      'https://picsum.photos/seed/bsc-10ft-new-1/1200/800',
      'https://picsum.photos/seed/bsc-10ft-new-2/1200/800',
      'https://picsum.photos/seed/bsc-10ft-new-3/1200/800'
    ], false, 1),

  ('new-containers', '20ft Standard Container (New)', '20ft-standard-new', 'BSC-NC-20S',
    'One-trip 20ft standard container — pristine condition.',
    'The 20ft standard new (one-trip) container is BoxSpace''s most popular steel box — a versatile, secure and fully weatherproof unit ideal for storage, shipping or conversion projects. CSC-plated, lockbox-fitted and ready for immediate nationwide delivery.',
    '{"length":"20ft","width":"8ft","height":"8ft 6in","internal_volume":"1,172 cu ft","tare_weight":"2,180 kg","max_payload":"28,200 kg","doors":"Double cargo doors","floor":"28mm marine plywood","grade":"One-trip"}',
    2950, 'new', 'in_stock',
    array[
      'https://picsum.photos/seed/bsc-20ft-new-1/1200/800',
      'https://picsum.photos/seed/bsc-20ft-new-2/1200/800',
      'https://picsum.photos/seed/bsc-20ft-new-3/1200/800',
      'https://picsum.photos/seed/bsc-20ft-new-4/1200/800'
    ], true, 2),

  ('new-containers', '20ft High Cube Container (New)', '20ft-high-cube-new', 'BSC-NC-20HC',
    'Extra headroom 20ft high-cube — one-trip.',
    'A 20ft high-cube new container adds a full foot of internal height over the standard unit, making it perfect for palletised goods, machinery and conversions where headroom matters. Delivered one-trip with lockbox and cargo doors.',
    '{"length":"20ft","width":"8ft","height":"9ft 6in","internal_volume":"1,322 cu ft","tare_weight":"2,340 kg","max_payload":"28,000 kg","doors":"Double cargo doors","floor":"28mm marine plywood","grade":"One-trip"}',
    3350, 'new', 'in_stock',
    array[
      'https://picsum.photos/seed/bsc-20hc-new-1/1200/800',
      'https://picsum.photos/seed/bsc-20hc-new-2/1200/800',
      'https://picsum.photos/seed/bsc-20hc-new-3/1200/800'
    ], false, 3),

  ('new-containers', '40ft Standard Container (New)', '40ft-standard-new', 'BSC-NC-40S',
    'Classic 40ft new container for high-volume storage.',
    'A brand-new 40ft standard container delivering excellent capacity and durability for shipping, bulk storage and modification. Corten steel construction, twin cargo doors and a full-length marine plywood floor as standard.',
    '{"length":"40ft","width":"8ft","height":"8ft 6in","internal_volume":"2,390 cu ft","tare_weight":"3,750 kg","max_payload":"28,800 kg","doors":"Double cargo doors","floor":"28mm marine plywood","grade":"One-trip"}',
    4200, 'new', 'in_stock',
    array[
      'https://picsum.photos/seed/bsc-40ft-new-1/1200/800',
      'https://picsum.photos/seed/bsc-40ft-new-2/1200/800',
      'https://picsum.photos/seed/bsc-40ft-new-3/1200/800'
    ], false, 4),

  ('new-containers', '40ft High Cube Container (New)', '40ft-high-cube-new', 'BSC-NC-40HC',
    'Spacious 40ft high-cube — extra foot of headroom.',
    'The 40ft high-cube new container provides the maximum internal volume in our standard range, with an additional foot of height over the 40ft standard. The go-to choice for bulky cargo, workshops and premium conversions. Supplied one-trip and site-ready.',
    '{"length":"40ft","width":"8ft","height":"9ft 6in","internal_volume":"2,694 cu ft","tare_weight":"3,980 kg","max_payload":"28,600 kg","doors":"Double cargo doors","floor":"28mm marine plywood","grade":"One-trip"}',
    4850, 'new', 'in_stock',
    array[
      'https://picsum.photos/seed/bsc-40hc-new-1/1200/800',
      'https://picsum.photos/seed/bsc-40hc-new-2/1200/800',
      'https://picsum.photos/seed/bsc-40hc-new-3/1200/800',
      'https://picsum.photos/seed/bsc-40hc-new-4/1200/800'
    ], true, 5),

  -- ----------------------------------------------------------------- USED ---
  ('used-containers', '20ft Used Container (Wind & Watertight)', '20ft-used-wwt', 'BSC-UC-20W',
    'Certified wind- and water-tight 20ft used container.',
    'A cost-effective 20ft used container, inspected and certified wind- and water-tight (WWT). Expect honest cosmetic wear — surface rust and paint patches — on a structurally sound, cargo-worthy unit that keeps its contents dry. Ideal for on-site storage on a budget.',
    '{"length":"20ft","width":"8ft","height":"8ft 6in","internal_volume":"1,172 cu ft","tare_weight":"2,180 kg","max_payload":"28,200 kg","doors":"Double cargo doors","grade":"WWT (wind & watertight)","age":"8–14 years"}',
    1650, 'used', 'in_stock',
    array[
      'https://picsum.photos/seed/bsc-20ft-used-1/1200/800',
      'https://picsum.photos/seed/bsc-20ft-used-2/1200/800',
      'https://picsum.photos/seed/bsc-20ft-used-3/1200/800'
    ], true, 1),

  ('used-containers', '20ft Used Container (Grade A)', '20ft-used-grade-a', 'BSC-UC-20A',
    'Premium refurbished 20ft — best-of-used condition.',
    'Our Grade A 20ft used containers are the pick of the fleet: minimal denting, sound doors and seals, and a tidy repaint available on request. A smart middle ground between budget WWT stock and one-trip pricing.',
    '{"length":"20ft","width":"8ft","height":"8ft 6in","internal_volume":"1,172 cu ft","tare_weight":"2,180 kg","max_payload":"28,200 kg","doors":"Double cargo doors","grade":"Grade A refurbished","age":"5–10 years"}',
    2150, 'used', 'in_stock',
    array[
      'https://picsum.photos/seed/bsc-20ga-used-1/1200/800',
      'https://picsum.photos/seed/bsc-20ga-used-2/1200/800',
      'https://picsum.photos/seed/bsc-20ga-used-3/1200/800'
    ], false, 2),

  ('used-containers', '40ft Used High Cube Container', '40ft-used-high-cube', 'BSC-UC-40HC',
    'Great-value 40ft used high-cube with extra headroom.',
    'A 40ft used high-cube container offering maximum volume at used-unit value. Certified wind- and water-tight with the usual cosmetic wear, and structurally sound throughout — a workhorse for large-scale storage and conversion projects.',
    '{"length":"40ft","width":"8ft","height":"9ft 6in","internal_volume":"2,694 cu ft","tare_weight":"3,980 kg","max_payload":"28,600 kg","doors":"Double cargo doors","grade":"WWT (wind & watertight)","age":"8–14 years"}',
    2750, 'used', 'in_stock',
    array[
      'https://picsum.photos/seed/bsc-40hc-used-1/1200/800',
      'https://picsum.photos/seed/bsc-40hc-used-2/1200/800',
      'https://picsum.photos/seed/bsc-40hc-used-3/1200/800'
    ], true, 3),

  ('used-containers', '10ft Used Container (Wind & Watertight)', '10ft-used-wwt', 'BSC-UC-10W',
    'Compact, affordable 10ft used store.',
    'A 10ft used container certified wind- and water-tight — the most affordable secure steel store in our range. Perfect where space is tight and budgets are tighter, with cosmetic wear only on a sound, lockable unit.',
    '{"length":"10ft","width":"8ft","height":"8ft 6in","internal_volume":"563 cu ft","tare_weight":"1,300 kg","max_payload":"10,000 kg","doors":"Double cargo doors","grade":"WWT (wind & watertight)","age":"8–14 years"}',
    1450, 'used', 'in_stock',
    array[
      'https://picsum.photos/seed/bsc-10ft-used-1/1200/800',
      'https://picsum.photos/seed/bsc-10ft-used-2/1200/800'
    ], false, 4),

  -- ---------------------------------------------------------- REFRIGERATED ---
  ('refrigerated-containers', '20ft Refrigerated Reefer', '20ft-reefer', 'BSC-RC-20',
    'Temperature-controlled 20ft reefer for cold-chain storage.',
    'A 20ft refrigerated container (reefer) with an integral electric refrigeration unit holding anywhere from deep-freeze to chilled set-points. Fully insulated stainless-steel interior, T-bar floor for airflow, and a three-phase power connection — ideal for on-site cold storage of food, pharma and horticulture.',
    '{"length":"20ft","width":"8ft","height":"8ft 6in","internal_volume":"1,000 cu ft","temperature_range":"-25°C to +25°C","power":"3-phase 400V","refrigeration":"Integral electric unit","insulation":"Polyurethane foam","interior":"Stainless steel, T-bar floor"}',
    6950, 'used', 'in_stock',
    array[
      'https://picsum.photos/seed/bsc-20reefer-1/1200/800',
      'https://picsum.photos/seed/bsc-20reefer-2/1200/800',
      'https://picsum.photos/seed/bsc-20reefer-3/1200/800'
    ], true, 1),

  ('refrigerated-containers', '40ft Refrigerated Reefer', '40ft-reefer', 'BSC-RC-40',
    'High-capacity 40ft reefer with extra headroom.',
    'A 40ft high-cube refrigerated container delivering large-scale cold-chain capacity with precise temperature control. Integral electric refrigeration, heavy-duty insulation and a stainless-steel interior make it the workhorse for bulk chilled and frozen storage.',
    '{"length":"40ft","width":"8ft","height":"9ft 6in","internal_volume":"2,040 cu ft","temperature_range":"-25°C to +25°C","power":"3-phase 400V","refrigeration":"Integral electric unit","insulation":"Polyurethane foam","interior":"Stainless steel, T-bar floor"}',
    9450, 'used', 'in_stock',
    array[
      'https://picsum.photos/seed/bsc-40reefer-1/1200/800',
      'https://picsum.photos/seed/bsc-40reefer-2/1200/800',
      'https://picsum.photos/seed/bsc-40reefer-3/1200/800',
      'https://picsum.photos/seed/bsc-40reefer-4/1200/800'
    ], true, 2),

  ('refrigerated-containers', '20ft Freezer Container (New)', '20ft-freezer-new', 'BSC-RC-20F',
    'Brand-new 20ft deep-freeze container down to -25°C.',
    'A one-trip 20ft freezer container built for reliable deep-freeze storage. New refrigeration machinery, fresh insulation and a hygienic stainless interior mean lower running costs and dependable set-points for demanding cold-chain applications.',
    '{"length":"20ft","width":"8ft","height":"8ft 6in","internal_volume":"1,000 cu ft","temperature_range":"-25°C to +12°C","power":"3-phase 400V","refrigeration":"New integral electric unit","insulation":"Polyurethane foam","interior":"Stainless steel, T-bar floor","grade":"One-trip"}',
    11500, 'new', 'in_stock',
    array[
      'https://picsum.photos/seed/bsc-20freezer-1/1200/800',
      'https://picsum.photos/seed/bsc-20freezer-2/1200/800',
      'https://picsum.photos/seed/bsc-20freezer-3/1200/800'
    ], false, 3)
) as p(category_slug, name, slug, sku, short_description, description, specs, price, condition, stock_status, images, is_featured, sort_order)
join public.categories c on c.slug = p.category_slug
on conflict (slug) do update set
  category_id       = excluded.category_id,
  name              = excluded.name,
  sku               = excluded.sku,
  short_description = excluded.short_description,
  description       = excluded.description,
  specs             = excluded.specs,
  price             = excluded.price,
  currency          = excluded.currency,
  condition         = excluded.condition,
  stock_status      = excluded.stock_status,
  images            = excluded.images,
  is_featured       = excluded.is_featured,
  sort_order        = excluded.sort_order,
  updated_at        = now();
