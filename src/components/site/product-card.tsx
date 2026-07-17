import Image from "next/image";
import Link from "next/link";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice, STOCK_LABELS, CONDITION_LABELS } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { AddToQuoteButton } from "@/components/quote/add-to-quote-button";
import type { Product } from "@/types/database";

const stockClasses: Record<string, string> = {
  in_stock: "bg-brand-100 text-brand-800",
  limited: "bg-amber-100 text-amber-800",
  made_to_order: "bg-blue-100 text-blue-800",
  out_of_stock: "bg-muted text-muted-foreground",
};

export function ProductCard({ product }: { product: Product }) {
  const img = product.images?.[0];
  const href = `/products/${product.slug}`;

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <Link
        href={href}
        className="relative block aspect-[4/3] overflow-hidden bg-muted"
      >
        {img ? (
          <Image
            src={img}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <ImageOff className="h-10 w-10" />
          </div>
        )}
        <div className="absolute left-3 top-3 flex gap-2">
          {product.condition && (
            <span className="rounded-full bg-brand-700 px-2.5 py-1 text-xs font-semibold text-white">
              {CONDITION_LABELS[product.condition]}
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <span
          className={cn(
            "mb-2 w-fit rounded-full px-2.5 py-0.5 text-xs font-medium",
            stockClasses[product.stock_status] ?? stockClasses.in_stock,
          )}
        >
          {STOCK_LABELS[product.stock_status]}
        </span>

        <Link href={href}>
          <h3 className="font-heading text-lg font-semibold leading-tight tracking-tight transition-colors group-hover:text-brand-700">
            {product.name}
          </h3>
        </Link>

        {product.short_description && (
          <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
            {product.short_description}
          </p>
        )}

        <div className="mt-3 text-xl font-bold text-brand-700">
          {formatPrice(product.price, product.currency)}
        </div>

        <div className="mt-4 flex gap-2 pt-1">
          <Button asChild variant="outline" size="sm" className="flex-1">
            <Link href={href}>View</Link>
          </Button>
          <AddToQuoteButton product={product} size="sm" className="flex-1" />
        </div>
      </div>
    </div>
  );
}
