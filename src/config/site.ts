/**
 * Static site configuration: brand identity, navigation, and the mapping from
 * public category routes to category slugs in the database.
 *
 * Anything an admin needs to change without a redeploy (WhatsApp number,
 * contact details, stats) lives in the `app_settings` / `site_stats` tables —
 * NOT here.
 */
export const siteConfig = {
  name: "BoxSpace Containers",
  shortName: "BoxSpace",
  tagline: "Transforming Steel Into Space",
  description:
    "Global supplier of new & used shipping containers, container homes, container offices and modular buildings. Premium quality, delivered worldwide.",
  // Fallback only — runtime values come from the app_settings table.
  fallbackWhatsApp: "15551234567",
  fallbackWhatsAppMessage: "Hello BoxSpace! I am interested in your containers.",
} as const;

export type NavItem = {
  label: string;
  href: string;
  /** Render as a highlighted call-to-action (e.g. Request Quote). */
  cta?: boolean;
};

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Containers", href: "/containers" },
  { label: "Container Homes", href: "/container-homes" },
  { label: "Container Offices", href: "/container-offices" },
  { label: "Modular Buildings", href: "/modular-buildings" },
  { label: "Projects", href: "/projects" },
  { label: "About Us", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
  { label: "Request Quote", href: "/quote", cta: true },
];

/**
 * Which category slugs feed each public listing route. A single route can
 * aggregate several categories (e.g. /containers shows all container types).
 */
export const categoryRoutes: Record<
  string,
  { title: string; description: string; slugs: string[] }
> = {
  containers: {
    title: "Shipping Containers",
    description:
      "New and used shipping containers, storage units and refrigerated reefers — delivered worldwide.",
    slugs: [
      "new-containers",
      "used-containers",
      "storage-units",
      "refrigerated-containers",
      "custom-fabrication",
    ],
  },
  "container-homes": {
    title: "Container Homes",
    description:
      "Turnkey container homes — from compact studios to multi-module family residences.",
    slugs: ["container-homes"],
  },
  "container-offices": {
    title: "Container Offices",
    description:
      "Portable, insulated office spaces ready to deploy on any site.",
    slugs: ["container-offices"],
  },
  "modular-buildings": {
    title: "Modular Buildings",
    description:
      "Scalable modular classrooms, clinics and accommodation blocks.",
    slugs: ["modular-buildings"],
  },
};

export type SiteConfig = typeof siteConfig;
