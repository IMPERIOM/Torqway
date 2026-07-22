# Spec sourcing report — data/products.json

Updated 2026-07-18 (expanded to 20 products per category, 80 total).
Updated again 2026-07-22 (second research pass targeting the `weightKg`/
`maxLoadKg` gaps in container-offices, container-homes and modular-buildings —
found CONTAINEX's official technical-description PDFs, which resolved 20 of
the 24 CONTAINEX weight gaps and surfaced official floor-load design ratings
in kg/m² for every CONTAINEX cabin line; corrected two prior CONTAINEX figures
that turned out to be generic marketing-range numbers rather than per-size
data-sheet values; also filled 4 container-home weights). Numeric specs only
were taken from the sources below; no images, marketing copy, reviews or other
written material was pulled from any manufacturer or retailer site. `image`
and `rating` remain intentionally `null` (from own assets / from real store
reviews later — see the note on images below). `description` has been filled
with original copy for all 80 products, written from the specs in this report
rather than copied from any manufacturer/retailer. `price` has been filled for
65 of 80 products as a **reference/starting price for review**, not a final
price — see "Pricing" section below.

⚠ On images: this catalog does not and will not contain manufacturer/retailer
product photography. Reusing another company's product photos on a commercial
site without a licence is copyright infringement regardless of whether the
site is deployed publicly — see `scripts/import-product-images.md` for the
legitimate options (own photography, licensed stock, or manufacturer press
kits with explicit reseller usage rights).

## Pricing

Reference prices researched 2026-07-22 from public market data (multiple
retailer/marketplace listings per product type — never a single competitor's
exact listing copied verbatim) to give a starting point for you to review and
adjust, not a final price. All figures are point estimates in USD; see the
per-category notes below for currency/FX assumptions and confidence.

- **New containers** (`new-containers`, 20/20 priced): new/one-trip dry
  containers ≈ $3,800–$8,500 by size/type; reefers $25,000–$32,000 (genuinely
  new units with factory refrigeration, much higher than reconditioned);
  CONTAINEX storage boxes ≈ $3,500–$7,400 (EU pricing, EUR→USD ≈1.08).
  Sourced from Conexwest, Boxhub, Dry Box, CHS Container Group, ContainerOne,
  and CONTAINEX's German/Austrian reseller network (Profishop, eBay.de,
  bauportal24h.de). Medium-to-good confidence overall; 9ft storage box and
  several specialty types (open-top, hardtop, flat-rack) are lower-confidence
  estimates where no direct new-unit listing was found.
- **Container offices** (`container-offices`, 20/20 priced): CONTAINEX doesn't
  publish list prices on containex.com/portal.containex.com (JS-rendered, no
  server-side price data); anchored on one verified genuine-CONTAINEX dealer
  sale (20ft PLUS office, Budget Shipping Containers, £14,750+VAT) and scaled
  by cabin length/line-tier (BASIC<CLASSIC<PLUS<XL) for the rest — $8,200
  (10ft CLASSIC) up to $22,200 (24ft PLUS / 20ft XL). Portable Space's own
  site still 403-blocks bots, so its 6 anti-vandal units are priced from
  comparable UK anti-vandal cabin retailers (Cabinlocator, Concept Cabins,
  Cabin Trader, JCP SA) at matching sizes — $6,200–$24,100. GBP→USD ≈1.27.
  Medium confidence where a direct anchor/listing existed, lower where
  extrapolated by size.
- **Container homes** (`container-homes`, 15 branded homes + 5 CONTAINEX
  accommodation cabins, 20/20 priced): branded expandable homes are ex-factory
  FOB China prices from manufacturer sites/Alibaba/made-in-china.com — do
  **not** include shipping, import duty, or on-site finishing, which typically
  add $3,000–$15,000+ on top. 20ft units ≈ $5,000–$8,000; 40ft units ≈
  $5,500–$22,000 (scales with bedroom count/finish level). Heshi, MIC-Tech
  and CASA BOX have high-confidence direct listings; UMD and EFH have no
  published price and were estimated by analogy to comparable-tier 20ft units
  (low confidence — flag for your own quote request before trusting). The 5
  CONTAINEX accommodation cabins reuse the matching CLASSIC/XL office-cabin
  price from the container-offices section above (same physical unit).
- **Modular buildings** (`modular-buildings`, 5/20 priced): the 5 CONTAINEX
  modular modules reuse the matching CLASSIC/XL office-cabin price (same
  physical unit, consistent with the weight-data convention elsewhere in this
  report). The **15 Portakabin Konstructa modules are intentionally left
  `null`** — Portakabin's own procurement guide confirms Konstructa pricing is
  bespoke quote-only, not publicly listed. A rough UK modular-classroom
  cost-per-m² industry benchmark (~$20,700–$69,000 per module) was found but
  is a generic construction-cost figure, not Portakabin's price for a specific
  module — entering it as this product's `price` would misrepresent a rough
  benchmark as a real number, so it was deliberately not applied.

Conventions:

- `weightKg` — tare (empty) weight of the unit.
- `maxLoadKg` — max payload (ISO containers: max gross minus tare; CONTAINEX
  storage boxes: the manufacturer's published payload).
- **`0` means the manufacturer does not publish this number** — flagged here,
  never guessed. Fill from supplier quotes before relying on it.

## Sources

| # | Source | Role |
|---|--------|------|
| S1 | Hapag-Lloyd *Container Specification* handbook (official operator spec book PDF, hapag-lloyd.com) | Primary for all ISO container tare/payload |
| S2 | CONTAINEX official site (containex.com — storage container, 10ft/20ft container, portable office cabin, modular building pages) | Primary for storage boxes, cabins, modules |
| S3 | Portakabin official site (portakabin.com — Konstructa Modular Range PDF + Allspace weight FAQ) | Primary for Konstructa modules |
| S4 | portablespace.co.uk listings (numeric values from listing snippets only; site 403-blocks automated access incl. its PDF data sheets) | Retailer cross-check + own-brand cabin range |
| S5 | Public logistics spec pages (icontainers.com, alconet-containers.com, cargostore.com etc.) | Secondary cross-check for sizes S1 doesn't cover (10ft, 20ft HC) |
| S6 | Container-home manufacturer sites (grande-house.com, china-container-house.com [Heshi], wzhhouse.com, casaboxcontainerhouse.com, umdhouse.com, efhhouse.com, glamni.com, MIC-Tech listing on made-in-china.com) | Primary for expandable homes — few publish weights |
| S7 | CONTAINEX official technical-description PDFs (catalog.containex.com — "Technical description CLASSIC Line Standard frame" v.30.06.2025, "PLUS LINE" v.30.10.2023, "CLASSIC Line XL" v.21.11.2023) | Primary for CONTAINEX cabin weights + floor-load design ratings (kg/m²) — supersedes S2's marketing-page ranges where the two conflict |
| S8 | umdcontainer.com (UMD House official site), efhhouse.com (official product page), glamni.com (official spec table), a Heshi listing on Alibaba (spec-table field, not description prose) | Secondary pass for container-home weights S6 missed |

## Containers (`new-containers`, 20 products)

ISO container payloads are quoted from S1's published tare/payload pairs. S1
lists two gross-weight ratings across its fleet — classic ISO 30,480 kg and
newer 32,500 kg (34,000+ for reefers/flatracks) — the basis used per product is
noted below. ⚠ Mixed bases are inherent to the source data; normalise before
displaying comparisons.

| Product | weightKg | maxLoadKg | Basis / flags |
|---|---|---|---|
| 10ft standard | 1,300 | 8,860 | ⚠ Not in S1. S5 tare 1,250–1,300; payload 8,860–10,420 quoted across sources. 10,160 gross basis. |
| 20ft standard | 2,300 | 28,180 | 30,480 basis. S1 tare 2,250–2,570 by series. ⚠ S4 states "2.1 tonnes" — below S1's range, unresolved. |
| 20ft high cube | 2,340 | 28,140 | ⚠ S5 only (not in S1's book). 30,480 basis. |
| 40ft standard | 3,780 | 26,700 | 30,480 basis (S1 pair). S1 tare range 3,700–3,780. |
| 40ft high cube | 3,900 | 26,580 | 30,480 basis. S1 tare 3,830–4,300. |
| 45ft high cube | 4,700 | 27,800 | ⚠ 32,500 basis only (S1 publishes no 30,480 series; second series 5,050/27,450). |
| 20ft open top | 2,450 | 30,050 | ⚠ 32,500 basis (S1 pair; variant tare 2,300/2,500). |
| 40ft open top | 3,850 | 26,630 | 30,480 basis (S1 pair; 32,500-basis variant 4,050/28,450). |
| 20ft hardtop | 2,700 | 27,780 | 30,480 basis (S1; 32,500-basis variant 2,850/29,650). Removable roof ≈450 kg. |
| 40ft hardtop | 4,700 | 25,780 | 30,480 basis (S1). |
| 20ft flat rack | 2,740 | 31,260 | ⚠ 34,000 basis (S1; heavy-duty variants to 45,000 gross / 42,100 payload). |
| 40ft flat rack (HC) | 5,950 | 44,050 | ⚠ 50,000 basis (S1; variants to 60,000 payload). |
| 20ft reefer | 2,900 | 27,580 | 30,480 basis (S1 series 2,770–3,030 tare). |
| 40ft HC reefer | 4,300 | 29,700 | ⚠ 34,000 basis (S1 series tare 4,300–4,800 / payload 29,200–29,700). |
| CTX 6ft storage box | 0 ⚠ | 2,000 | Payload official (S2); tare not published. |
| CTX 8ft storage box | 0 ⚠ | 3,500 | Payload official (S2); tare not published. |
| CTX 9ft storage box | 0 ⚠ | 8,500 | Payload official (S2) — ⚠ oddly higher than the 15ft's 5,000; verify with CONTAINEX. Tare not published. |
| CTX 10ft storage box | 1,300 | 10,000 | Payload official (S2). ⚠ S2's 10ft page gives weight 1,300–1,500 — low end used. |
| CTX 15ft storage box | 0 ⚠ | 5,000 | Payload official (S2); tare not published. |
| CTX 20ft storage box | 1,270 | 10,000 | Both official (S2: 20ft page tare 1,270; storage page payload 10,000). |

## Container offices (`container-offices`, 20 products)

`weightKg` now sourced from S7 (CONTAINEX's own technical-description PDFs)
for every CLASSIC/PLUS/XL size. ⚠ `maxLoadKg = 0` remains for every cabin:
CONTAINEX's data sheets publish **floor-load design ratings in kg/m²**, not a
total payload in kg, and per this report's no-guessing rule those are not
converted into a total kg figure (area × kg/m² would be an estimate, not a
sourced number). The kg/m² ratings are recorded below for reference. Portable
Space (S4) was re-checked in a second, deeper pass (Wayback Machine, five
comparable-brand sites) — confirmed no genuine payload/floor-load figure
exists anywhere for these units, only mismatched tare/gross weights for
different brands' similar-size products, which are not usable substitutes.

| Product | weightKg | Flags |
|---|---|---|
| CTX 10ft CLASSIC office (BM/mineral-wool, std. height) | 1,300 | S7 official data sheet. BU (PU-foam) variant is lighter: 1,200 kg. Taller-frame (CAH 2,960mm) variant: 1,400/1,300 kg. Floor load: 200 kg/m² standard, 400 or 800 kg/m² w/ reinforcement option, 150 kg/m² upper floors. |
| CTX 16ft CLASSIC office | 1,750 | S7 official — **confirms 16ft is a real CONTAINEX SKU** (previously unverified). BU variant 1,600 kg. Same floor-load table as 10ft. |
| CTX 20ft CLASSIC office | 2,050 | S7 official (BM/mineral-wool). ⚠ BU (PU-foam) variant is 1,850 kg — matches the old figure exactly, so the old figure was the BU variant, not BM; both are real, reported here as BM to be consistent with the 10/16/24ft rows above. |
| CTX 24ft CLASSIC office | 2,350 | ⚠ **Corrected from 2,710.** S7's official data sheet tops out at 2,350 kg (BM, std. height) / 2,550 kg (BM, tall frame) — the old 2,710 figure was an assumed "top of a generic office-cabin range" from S2's marketing copy, not tied to a specific size in a data sheet. BU variant: 2,150–2,250 kg. |
| CTX 20ft BASIC office | 1,850 | ⚠ Still unconfirmed as a BASIC-specific figure — no dedicated BASIC data sheet found in either pass. containex.com's BASIC page quotes identical external dims to CLASSIC-Standard 20ft, so the CLASSIC 20ft BU figure (1,850) is used as the closest cross-reference. |
| CTX 10ft PLUS office | 1,500 | S7 official "Technical description PLUS LINE" PDF. Floor load: 400 kg/m² ground, 300 kg/m² top floors. |
| CTX 16ft PLUS office | 2,400 | S7 official, same PDF. |
| CTX 20ft PLUS office | 2,900 | S7 official, same PDF. |
| CTX 24ft PLUS office | 3,500 | S7 official, same PDF. Floor load: 400/300 kg/m², 2nd floor "upon request" (no number given). |
| CTX 20ft XL office (wide-body, 2,989mm) | 2,650 | S7 official "CLASSIC Line XL" PDF; cross-checked against a CONTAINEX sales-portal listing showing the same 2,650 kg. Floor load: 300 kg/m² ground, 200 kg/m² upper. |
| CTX 10ft sanitary | 1,500 | S7 official data sheet (SU variant). |
| CTX 16ft sanitary | 0 ⚠ | S7's official data-sheet table has this cell **blank** — not just "not published," CONTAINEX's own sheet omits it, suggesting 16ft may not be a stocked sanitary-line SKU. |
| CTX 20ft sanitary | 2,500 | S7 official — confirms prior figure exactly. |
| CTX 24ft sanitary | 0 ⚠ | Same blank-cell situation as 16ft sanitary. |
| PS 12ft/16ft/20ft anti-vandal offices, 24ft canteen, 32ft office, 32ft office/canteen | 0 ⚠ | Real S4 fleet sizes (12×7'6", 20×8, 24×9, 32×10). S4's own PDF data sheets still 403-block automated access. Second pass tried Wayback Machine (blocked by the fetch tool itself) and 5 comparable UK portable-building brands (Algeco, Nixon Hire, Wernick, Elliott, Vp) — found only mismatched tare/gross weights for *different brands'* similar-size units (e.g. Algeco 24ft = "4000kg **gross**", Nixon Hire 32ft = "4400kg **tare**"), never a genuine Portable Space figure or a real payload/floor-load number for any brand at these sizes. Confirmed not usable — check S4's PDFs manually in a browser, or request from Portable Space directly. |

## Container homes (`container-homes`, 20 products)

The weakest category for published numbers — most manufacturers (including all
Western brands checked, e.g. Portakabin group) do not publish finished-home
weights. Entries are real manufacturer model families; weights only where a
number was actually published.

| Product | weightKg | Flags |
|---|---|---|
| Grande House 20ft expandable (studio / 1-bed / 2-bed) | 2,500 | S6 official figure for the 20ft expandable shell (5,860×2,280×2,500 folded; ~35 m² expanded). ⚠ Figure is size-level — Grande does not publish per-layout weights; all three layouts share it. |
| Grande House 40ft expandable | 0 ⚠ | Still not found after a second, targeted pass — checked grande-house.com's 40ft/74m² collapsible-home pages and Alibaba/made-in-china.com for a Grande-branded 40ft listing specifically; only unrelated third-party 40ft listings turned up (2,500–10,000 kg range) and were **not** substituted in since they aren't confirmably Grande's product. |
| Heshi House 20ft expandable | 2,500 | S8: Alibaba listing for Heshi (Hebei) Integrated Housing states "single gross weight 2500.000 kg." Medium confidence — china-container-house.com's own 20ft page (matching dims) doesn't state weight, so the exact SKU match to this Alibaba figure isn't fully confirmed. |
| Heshi House 40ft granny flat / 40ft 5-bed | 0 ⚠ | Still not found — china-container-house.com confirms dims (11,800×6,240×2,480 expanded) but no weight field on either product page. |
| WZH House 20ft (WZHKZX20) | 0 ⚠ | Still not found on wzhhouse.com. |
| WZH House 40ft luxury | 0 ⚠ | Weight still not found, but wzhhouse.com's series-250 page does publish genuine load specs: **roof load 250 kg/m², floor load 400 kg/m²** — not a total weight, so not entered in `weightKg`, but recorded here since it's real sourced data. |
| CASA BOX 20ft expandable | 0 ⚠ | Still not found — casaboxcontainerhouse.com's product page has no weight field. Alibaba search found conflicting weights (500/1,200/2,500/2,600 kg) across different CASA BOX-branded listings for apparently different SKUs/sizes — too ambiguous to assign to this specific product. |
| UMD House 20ft expandable | 3,500 | S8: umdcontainer.com official site states "Total weight (kg): 3500–4500" across multiple product pages. High confidence (official, consistent across pages). Low end of the range used per this report's convention; full range noted here rather than averaged. |
| EFH House 20ft expandable | 3,600 | S8: efhhouse.com official product page, "Net Weight: 3.6 tons." High confidence — clean official spec table. |
| MIC-Tech 40ft expandable granny flat | 8,000 | ⚠⚠ **Low confidence, unchanged.** A second pass found the same "~8 tonnes" figure repeated across several made-in-china.com listings, but all from the same seller account on the same marketplace — not independent corroboration. No official MIC-Tech site found. Verify with supplier. |
| GLAMNI expandable house | 2,800 | S8: glamni.com official spec table, 20ft model. High confidence. Same page lists 30ft = 3,800 kg and 40ft = 4,500 kg as size variants of this line (not separate SKUs in our catalog). |
| GLAMNI capsule house | 0 ⚠ | Genuinely ambiguous, not just unpublished: glamni.com hosts 8 distinct capsule SKUs (G30, W6, X50, X60, U50, L50, G70, R50) ranging ~4,500–9,000 kg, and this catalog's slug is generic (doesn't specify which). Even the G30 page itself shows two conflicting figures (4.5t vs. 7t "alternate specification"). Flagged as ambiguous rather than guessed. |
| CTX 10/16/20/24ft + 20ft XL accommodation cabins | 1,300 / 1,750 / 2,050 / 2,350 / 2,650 | Same physical cabins as the CLASSIC/XL office line (S7) used as accommodation — see container-offices section above for full sourcing + floor-load kg/m² figures. `maxLoadKg` still 0 for the same reason (only kg/m² design ratings published, no total kg payload). |

## Modular buildings (`modular-buildings`, 20 products)

| Product | weightKg | Flags |
|---|---|---|
| Portakabin Konstructa KM073 modules ×8 (middle, left end, right end, corridor+toilet, corridor+drying, corridor+utility, toilet+corridor+utility, balcony) | 0 ⚠ | Module types and dimensions are official (S3 PDF: 7,300×2,820×3,130 mm; 19.15–20.10 m²). **Portakabin explicitly does not publish weights** (S3 FAQ: "depends on size, ask our team" — no numeric value). Re-checked in a second pass for weight leaking into crane-lift, structural/foundation, or planning-application documents — found nothing. Confirmed not available from any public source. |
| Portakabin Konstructa KM093 modules ×7 (middle, left end, right end, corridor+toilet, corridor+drying, corridor+shower, mess+toilet+corridor) | 0 ⚠ | Official dimensions 9,700×2,820×3,130 mm; 25.62–26.9 m². Same confirmation as KM073 above — not published anywhere. |
| CTX 10/16/20/24ft + 20ft XL modular modules | 1,300 / 1,750 / 2,050 / 2,350 / 2,650 | CONTAINEX modular buildings assemble from the same CLASSIC/XL cabins — see container-offices section above (S7) for full sourcing + floor-load kg/m² figures. `maxLoadKg` still 0 (only kg/m² design ratings published, not total kg payload). |
