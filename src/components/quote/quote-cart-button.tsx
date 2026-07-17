"use client";

import Link from "next/link";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuoteCart } from "./quote-cart-provider";

/** "Request Quote" CTA with a live line-item count badge. */
export function QuoteCartButton({
  className,
  full = false,
}: {
  className?: string;
  full?: boolean;
}) {
  const { count } = useQuoteCart();
  return (
    <Link
      href="/quote"
      className={cn(
        "relative inline-flex items-center justify-center gap-2 rounded-md bg-brand-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-800",
        full && "w-full",
        className,
      )}
    >
      <FileText className="h-4 w-4" />
      Request Quote
      {count > 0 && (
        <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1.5 text-xs font-bold text-brand-700">
          {count}
        </span>
      )}
    </Link>
  );
}
