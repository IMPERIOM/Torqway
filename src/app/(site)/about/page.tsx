import type { Metadata } from "next";
import Link from "next/link";
import { Globe2, ShieldCheck, Truck, Wrench, Recycle, Headset } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/page-header";
import { StatCounter } from "@/components/site/stat-counter";
import { SectionHeading } from "@/components/site/section-heading";
import { WhatsAppCTA } from "@/components/whatsapp/whatsapp-cta";
import { getSiteStats } from "@/lib/data/site";
import { getWhatsAppLink } from "@/lib/settings";
import { siteConfig } from "@/config/site";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "About Us",
  description:
    "BoxSpace Containers is a global supplier of shipping containers, container homes, offices and modular buildings. Learn our story and values.",
};

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Certified Quality",
    body: "Every unit is inspected and certified before it leaves our yard.",
  },
  {
    icon: Globe2,
    title: "Global Delivery",
    body: "We ship to dozens of countries with reliable end-to-end logistics.",
  },
  {
    icon: Wrench,
    title: "Custom Fabrication",
    body: "From homes to pop-up shops, we build to your exact specification.",
  },
  {
    icon: Truck,
    title: "Fast Turnaround",
    body: "In-stock units dispatched quickly; modular builds on tight timelines.",
  },
  {
    icon: Recycle,
    title: "Sustainable",
    body: "Repurposing steel into durable, long-lasting spaces.",
  },
  {
    icon: Headset,
    title: "Expert Support",
    body: "Specialists guide you from first enquiry to final delivery.",
  },
];

export default async function AboutPage() {
  const [stats, whatsappLink] = await Promise.all([
    getSiteStats(),
    getWhatsAppLink(),
  ]);

  return (
    <>
      <PageHeader
        title="About BoxSpace"
        description={siteConfig.tagline}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About Us" }]}
      />

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Our story" title="Steel, reimagined" />
          <div className="mt-6 space-y-4 text-left text-foreground/80">
            <p>
              BoxSpace Containers began with a simple idea: that the humble
              shipping container could become almost anything — a home, an
              office, a classroom, a clinic, a shop. Today we supply new and
              used containers and design complete modular spaces for customers
              around the world.
            </p>
            <p>
              We combine an extensive inventory with in-house fabrication, so
              whether you need a single 20ft box for storage or a multi-module
              building delivered to a remote site, we can make it happen — on
              time and on budget.
            </p>
          </div>
        </div>
      </section>

      {stats.length > 0 && (
        <section className="border-y border-border bg-muted/40 py-14">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-10 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
            {stats.map((s) => (
              <StatCounter
                key={s.id}
                value={Number(s.value)}
                label={s.label}
                suffix={s.suffix}
                prefix={s.prefix}
                icon={s.icon}
              />
            ))}
          </div>
        </section>
      )}

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Why choose us" title="Built on Trust" />
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="rounded-lg border border-border bg-card p-6"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
                  <v.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-heading text-lg font-semibold">
                  {v.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-700 py-16 text-white">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 text-center sm:px-6">
          <h2 className="font-heading text-3xl font-bold uppercase tracking-tight sm:text-4xl">
            Let&apos;s build something
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="bg-white text-brand-800 hover:bg-brand-50">
              <Link href="/quote">Request a Quote</Link>
            </Button>
            <WhatsAppCTA href={whatsappLink} size="lg" />
          </div>
        </div>
      </section>
    </>
  );
}
