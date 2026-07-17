import Link from "next/link";
import { PackageSearch } from "lucide-react";
import { categoryRoutes } from "@/config/site";
import {
  getProducts,
  type ProductSort,
} from "@/lib/data/products";
import { getTopCategories, getSubcategories } from "@/lib/data/categories";
import type { ProductCondition, StockStatus } from "@/types/database";
import { ProductCard } from "./product-card";
import { ProductFilters } from "./product-filters";
import { PageHeader } from "./page-header";
import { Button } from "@/components/ui/button";

type SearchParams = Record<string, string | string[] | undefined>;

const first = (v: string | string[] | undefined): string | undefined =>
  Array.isArray(v) ? v[0] : v;

export async function CategoryListing({
  routeKey,
  searchParams,
}: {
  routeKey: keyof typeof categoryRoutes | string;
  searchParams: SearchParams;
}) {
  const cfg = categoryRoutes[routeKey];
  if (!cfg) return null;

  const sort = first(searchParams.sort) as ProductSort | undefined;
  const condition = first(searchParams.condition) as
    | ProductCondition
    | undefined;
  const stock = first(searchParams.stock) as StockStatus | undefined;
  const category = first(searchParams.category);

  const products = await getProducts({
    categorySlugs: cfg.slugs,
    subcategorySlug: category || undefined,
    sort,
    condition: condition || undefined,
    stockStatus: stock || undefined,
  });

  const multi = cfg.slugs.length > 1;
  const filterCats = multi
    ? (await getTopCategories()).filter((c) => cfg.slugs.includes(c.slug))
    : await getSubcategories(cfg.slugs);
  const categoryOptions = filterCats.map((c) => ({
    value: c.slug,
    label: c.name,
  }));

  return (
    <>
      <PageHeader
        title={cfg.title}
        description={cfg.description}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: cfg.title }]}
      />
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              {products.length} product{products.length === 1 ? "" : "s"}
            </p>
            <ProductFilters
              categoryOptions={categoryOptions}
              categoryLabel={multi ? "Category" : "Type"}
            />
          </div>

          {products.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="mt-12 flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-20 text-center">
              <PackageSearch className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 font-heading text-xl font-semibold">
                No products found
              </h3>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Try adjusting your filters, or get in touch and we&apos;ll source
                exactly what you need.
              </p>
              <div className="mt-6 flex gap-3">
                <Button asChild variant="outline">
                  <Link href={`/${routeKey === "containers" ? "containers" : routeKey}`}>
                    Clear filters
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/contact">Contact us</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
