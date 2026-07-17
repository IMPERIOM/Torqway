import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Boxes, BadgeCheck } from "lucide-react";
import {
  getProductBySlug,
  getAllProductSlugs,
  getRelatedProducts,
} from "@/lib/data/products";
import { getCategoryById } from "@/lib/data/categories";
import { getWhatsAppLink } from "@/lib/settings";
import { formatPrice, STOCK_LABELS, CONDITION_LABELS } from "@/lib/format";
import { ProductGallery } from "@/components/site/product-gallery";
import { ProductCard } from "@/components/site/product-card";
import { AddToQuoteButton } from "@/components/quote/add-to-quote-button";
import { WhatsAppCTA } from "@/components/whatsapp/whatsapp-cta";
import { Separator } from "@/components/ui/separator";
import { categoryHref } from "@/lib/category-link";
import { env } from "@/lib/env";

export const revalidate = 60;

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  const description =
    product.meta_description ?? product.short_description ?? undefined;
  return {
    title: product.meta_title ?? product.name,
    description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: product.name,
      description,
      images: product.images?.[0] ? [{ url: product.images[0] }] : undefined,
    },
  };
}

function humanize(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [category, related, waLink] = await Promise.all([
    product.category_id
      ? getCategoryById(product.category_id)
      : Promise.resolve(null),
    getRelatedProducts(product),
    getWhatsAppLink(
      `Hi BoxSpace, I'm interested in the "${product.name}". Could you share availability and pricing?`,
    ),
  ]);

  const specs =
    product.specs && typeof product.specs === "object" && !Array.isArray(product.specs)
      ? (product.specs as Record<string, unknown>)
      : {};
  const specEntries = Object.entries(specs).filter(
    ([, v]) => v !== null && v !== undefined && v !== "",
  );

  // JSON-LD product structured data (deepened further in Phase 5).
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.short_description ?? product.description ?? undefined,
    image: product.images,
    sku: product.sku ?? undefined,
    offers: product.price
      ? {
          "@type": "Offer",
          price: product.price,
          priceCurrency: product.currency,
          availability:
            product.stock_status === "out_of_stock"
              ? "https://schema.org/OutOfStock"
              : "https://schema.org/InStock",
          url: `${env.siteUrl}/products/${product.slug}`,
        }
      : undefined,
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        {category ? (
          <>
            <Link href={categoryHref(category.slug)} className="hover:text-foreground">
              {category.name}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
          </>
        ) : null}
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} alt={product.name} />

        <div>
          <div className="flex flex-wrap items-center gap-2">
            {product.condition && (
              <span className="rounded-full bg-brand-700 px-2.5 py-1 text-xs font-semibold text-white">
                {CONDITION_LABELS[product.condition]}
              </span>
            )}
            <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
              {STOCK_LABELS[product.stock_status]}
            </span>
            {product.sku && (
              <span className="text-xs text-muted-foreground">
                SKU: {product.sku}
              </span>
            )}
          </div>

          <h1 className="mt-3 font-heading text-3xl font-bold uppercase tracking-tight sm:text-4xl">
            {product.name}
          </h1>

          {product.short_description && (
            <p className="mt-3 text-muted-foreground">
              {product.short_description}
            </p>
          )}

          <div className="mt-5 text-3xl font-bold text-brand-700">
            {formatPrice(product.price, product.currency)}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <AddToQuoteButton product={product} size="lg" />
            <WhatsAppCTA href={waLink} size="lg" label="Ask on WhatsApp" />
          </div>

          {specEntries.length > 0 && (
            <div className="mt-8 rounded-lg border border-border">
              <div className="flex items-center gap-2 border-b border-border px-4 py-3 text-sm font-semibold">
                <Boxes className="h-4 w-4 text-brand-600" /> Key Specifications
              </div>
              <dl className="divide-y divide-border">
                {specEntries.map(([k, v]) => (
                  <div
                    key={k}
                    className="flex justify-between gap-4 px-4 py-2.5 text-sm"
                  >
                    <dt className="text-muted-foreground">{humanize(k)}</dt>
                    <dd className="text-right font-medium">{String(v)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <BadgeCheck className="h-4 w-4 text-brand-600" />
            Worldwide delivery · Inspected & certified · Trade & bulk pricing
          </div>
        </div>
      </div>

      {product.description && (
        <div className="mt-12 max-w-3xl">
          <h2 className="font-heading text-2xl font-bold uppercase tracking-tight">
            Description
          </h2>
          <p className="mt-4 whitespace-pre-line leading-relaxed text-foreground/80">
            {product.description}
          </p>
        </div>
      )}

      {product.videos && product.videos.length > 0 && (
        <div className="mt-12 max-w-3xl">
          <h2 className="font-heading text-2xl font-bold uppercase tracking-tight">
            Video
          </h2>
          <video
            controls
            className="mt-4 w-full rounded-lg"
            src={product.videos[0]}
          />
        </div>
      )}

      {related.length > 0 && (
        <div className="mt-16">
          <Separator className="mb-10" />
          <h2 className="font-heading text-2xl font-bold uppercase tracking-tight">
            Related Products
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
