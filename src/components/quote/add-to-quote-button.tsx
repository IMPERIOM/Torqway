"use client";

import { Check, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useQuoteCart } from "./quote-cart-provider";
import type { Product } from "@/types/database";

type MinimalProduct = Pick<
  Product,
  "id" | "slug" | "name" | "price" | "currency" | "images"
>;

export function AddToQuoteButton({
  product,
  size = "default",
  variant = "default",
  className,
  fullWidth = false,
}: {
  product: MinimalProduct;
  size?: "default" | "sm" | "lg";
  variant?: "default" | "outline" | "secondary";
  className?: string;
  fullWidth?: boolean;
}) {
  const { addItem, isInCart } = useQuoteCart();
  const inCart = isInCart(product.id);

  return (
    <Button
      type="button"
      size={size}
      variant={variant}
      className={className}
      style={fullWidth ? { width: "100%" } : undefined}
      onClick={() => {
        addItem({
          productId: product.id,
          slug: product.slug,
          name: product.name,
          image: product.images?.[0] ?? null,
          price: product.price,
          currency: product.currency,
        });
        toast.success(`${product.name} added to your quote`, {
          description: "Review your items and submit a quote request.",
        });
      }}
    >
      {inCart ? (
        <>
          <Check className="h-4 w-4" /> Add another
        </>
      ) : (
        <>
          <Plus className="h-4 w-4" /> Add to Quote
        </>
      )}
    </Button>
  );
}
