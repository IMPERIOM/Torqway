import type { Metadata } from "next";
import { Mail, Phone, MapPin } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { ContactForm } from "@/components/site/contact-form";
import { WhatsAppCTA } from "@/components/whatsapp/whatsapp-cta";
import { getSettings, getWhatsAppLink } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with BoxSpace Containers — request a quote, ask a question, or chat with us on WhatsApp.",
};

export default async function ContactPage() {
  const [settings, whatsappLink] = await Promise.all([
    getSettings(),
    getWhatsAppLink(),
  ]);

  return (
    <>
      <PageHeader
        title="Contact Us"
        description="Tell us about your project and our team will respond within one business day."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />
      <section className="py-12">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.5fr_1fr] lg:px-8">
          <div>
            <h2 className="font-heading text-2xl font-bold uppercase tracking-tight">
              Send us a message
            </h2>
            <p className="mt-2 text-muted-foreground">
              Fill in the form and we&apos;ll get back to you shortly.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="font-heading text-lg font-semibold uppercase tracking-tight">
                Reach us directly
              </h3>
              <ul className="mt-4 space-y-4 text-sm">
                {settings.contactEmail && (
                  <li className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-5 w-5 text-brand-600" />
                    <a
                      href={`mailto:${settings.contactEmail}`}
                      className="hover:text-brand-700"
                    >
                      {settings.contactEmail}
                    </a>
                  </li>
                )}
                {settings.contactPhone && (
                  <li className="flex items-start gap-3">
                    <Phone className="mt-0.5 h-5 w-5 text-brand-600" />
                    <a
                      href={`tel:${settings.contactPhone.replace(/[^0-9+]/g, "")}`}
                      className="hover:text-brand-700"
                    >
                      {settings.contactPhone}
                    </a>
                  </li>
                )}
                {settings.companyAddress && (
                  <li className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 text-brand-600" />
                    <span>{settings.companyAddress}</span>
                  </li>
                )}
              </ul>
            </div>

            <div className="rounded-lg border border-border bg-brand-50 p-6">
              <h3 className="font-heading text-lg font-semibold uppercase tracking-tight text-brand-900">
                Prefer to chat?
              </h3>
              <p className="mt-2 text-sm text-brand-800">
                Message us on WhatsApp for the fastest response.
              </p>
              <div className="mt-4">
                <WhatsAppCTA href={whatsappLink} size="lg" />
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
