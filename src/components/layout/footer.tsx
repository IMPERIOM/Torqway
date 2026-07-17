import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { Logo } from "./logo";
import { WhatsAppCTA } from "@/components/whatsapp/whatsapp-cta";
import { siteConfig, mainNav } from "@/config/site";
import type { SiteSettings } from "@/lib/settings";

const productLinks = [
  { label: "Containers", href: "/containers" },
  { label: "Container Homes", href: "/container-homes" },
  { label: "Container Offices", href: "/container-offices" },
  { label: "Modular Buildings", href: "/modular-buildings" },
];

export function Footer({
  settings,
  whatsappLink,
}: {
  settings: SiteSettings;
  whatsappLink: string;
}) {
  const companyLinks = mainNav.filter((i) =>
    ["/projects", "/about", "/blog", "/contact"].includes(i.href),
  );

  return (
    <footer className="border-t border-border bg-brand-950 text-brand-100">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="space-y-4">
          <Logo light />
          <p className="text-sm text-brand-200">{siteConfig.tagline}</p>
          <p className="max-w-xs text-sm text-brand-300">
            {siteConfig.description}
          </p>
          <WhatsAppCTA href={whatsappLink} />
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-white">
            Products
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {productLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-brand-200 transition-colors hover:text-white"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-white">
            Company
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {companyLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-brand-200 transition-colors hover:text-white"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-white">
            Contact
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            {settings.contactEmail && (
              <li className="flex items-center gap-2 text-brand-200">
                <Mail className="h-4 w-4 shrink-0" />
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="hover:text-white"
                >
                  {settings.contactEmail}
                </a>
              </li>
            )}
            {settings.contactPhone && (
              <li className="flex items-center gap-2 text-brand-200">
                <Phone className="h-4 w-4 shrink-0" />
                <a
                  href={`tel:${settings.contactPhone.replace(/[^0-9+]/g, "")}`}
                  className="hover:text-white"
                >
                  {settings.contactPhone}
                </a>
              </li>
            )}
            {settings.companyAddress && (
              <li className="flex items-start gap-2 text-brand-200">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{settings.companyAddress}</span>
              </li>
            )}
          </ul>
          {Object.keys(settings.socialLinks).length > 0 && (
            <div className="mt-5 flex gap-4 text-sm capitalize">
              {Object.entries(settings.socialLinks).map(([name, url]) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-300 transition-colors hover:text-white"
                >
                  {name}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-6 text-center text-xs text-brand-300 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
