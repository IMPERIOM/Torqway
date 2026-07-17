/** Map a category slug to the public listing route that shows it. */
const DEDICATED: Record<string, string> = {
  "container-homes": "/container-homes",
  "container-offices": "/container-offices",
  "modular-buildings": "/modular-buildings",
};

export function categoryHref(slug: string): string {
  if (DEDICATED[slug]) return DEDICATED[slug];
  // Everything else is a container type shown on /containers.
  return `/containers?category=${slug}`;
}
