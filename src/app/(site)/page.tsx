import Link from "next/link";
import { ArrowRight, Quote, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Hero, type HeroCta } from "@/components/site/hero";
import { SectionHeading } from "@/components/site/section-heading";
import { StatCounter } from "@/components/site/stat-counter";
import { CategoryCard } from "@/components/site/category-card";
import { ProductCard } from "@/components/site/product-card";
import { ProjectCard } from "@/components/site/project-card";
import { WhatsAppCTA } from "@/components/whatsapp/whatsapp-cta";
import { getTopCategories } from "@/lib/data/categories";
import { getFeaturedProducts } from "@/lib/data/products";
import { getFeaturedProjects } from "@/lib/data/projects";
import { getSiteStats, getHomepageSections, getTestimonials } from "@/lib/data/site";
import { getSettings } from "@/lib/settings";
import { buildWhatsAppLink } from "@/lib/format";
import { siteConfig } from "@/config/site";

export const revalidate = 60;

const DEFAULT_CTAS: HeroCta[] = [
  { label: "Browse Products", href: "/containers", variant: "primary" },
  { label: "Request Quote", href: "/quote", variant: "secondary" },
  { label: "Chat on WhatsApp", href: "whatsapp", variant: "whatsapp" },
];

export default async function HomePage() {
  const [categories, products, projects, stats, sections, testimonials, settings] =
    await Promise.all([
      getTopCategories(),
      getFeaturedProducts(8),
      getFeaturedProjects(3),
      getSiteStats(),
      getHomepageSections(),
      getTestimonials(3),
      getSettings(),
    ]);

  const whatsappLink = buildWhatsAppLink(
    settings.whatsappNumber,
    settings.whatsappMessage,
  );

  const hero = sections.hero;
  const heroContent = (hero?.content ?? {}) as { ctas?: HeroCta[] };
  const cta = sections.cta;

  return (
    <>
      <Hero
        title={hero?.title ?? "Premium Shipping Containers & Modular Spaces"}
        subtitle={hero?.body ?? siteConfig.description}
        tagline={hero?.subtitle ?? siteConfig.tagline}
        videoUrl={hero?.media_url}
        ctas={heroContent.ctas?.length ? heroContent.ctas : DEFAULT_CTAS}
        whatsappLink={whatsappLink}
      />

      {/* Stats */}
      {stats.length > 0 && (
        <section className="border-b border-border bg-background py-16">
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

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="What we offer"
              title="Browse by Category"
              subtitle="From single containers to complete modular buildings — find the right space for your project."
            />
            <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {categories.map((c) => (
                <CategoryCard key={c.id} category={c} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured products */}
      {products.length > 0 && (
        <section className="bg-muted/40 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading
                align="left"
                eyebrow="In demand"
                title="Featured Products"
                subtitle="Our most popular containers and modular spaces."
              />
              <Button asChild variant="outline">
                <Link href="/containers">
                  View all <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading
                align="left"
                eyebrow="Our work"
                title="Project Showcase"
                subtitle="Real builds, delivered worldwide."
              />
              <Button asChild variant="outline">
                <Link href="/projects">
                  All projects <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="bg-muted/40 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Testimonials"
              title="Trusted Worldwide"
            />
            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
              {testimonials.map((t) => (
                <figure
                  key={t.id}
                  className="flex flex-col rounded-lg border border-border bg-card p-6 shadow-sm"
                >
                  <Quote className="h-8 w-8 text-brand-300" />
                  {t.rating && (
                    <div className="mt-3 flex gap-0.5 text-amber-500">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  )}
                  <blockquote className="mt-3 flex-1 text-sm text-foreground/80">
                    “{t.content}”
                  </blockquote>
                  <figcaption className="mt-4 text-sm font-semibold">
                    {t.author_name}
                    {(t.author_role || t.author_company) && (
                      <span className="block font-normal text-muted-foreground">
                        {[t.author_role, t.author_company]
                          .filter(Boolean)
                          .join(", ")}
                      </span>
                    )}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA band */}
      <section className="bg-brand-700 py-16 text-white">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 text-center sm:px-6">
          <h2 className="font-heading text-3xl font-bold uppercase tracking-tight sm:text-4xl">
            {cta?.title ?? "Ready to Transform Steel Into Space?"}
          </h2>
          <p className="max-w-2xl text-brand-100">
            {cta?.body ??
              "Tell us what you need and our team will put together a competitive quote."}
          </p>
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
