"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Trash2,
  Minus,
  Plus,
  CheckCircle2,
  FileText,
  ImageOff,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { useQuoteCart } from "./quote-cart-provider";
import { submitQuote } from "@/lib/actions/quote";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function QuoteClient() {
  const { items, updateQuantity, updateItem, removeItem, clear, count } =
    useQuoteCart();
  const [pending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Add at least one product to your quote.");
      return;
    }
    const contact = Object.fromEntries(
      new FormData(e.currentTarget),
    ) as Record<string, string>;

    const payload = {
      ...contact,
      items: items.map((i) => ({
        product_id: i.productId,
        name: i.name,
        slug: i.slug,
        quantity: i.quantity,
        custom_specs: i.customSpecs,
        notes: i.notes,
      })),
    };

    startTransition(async () => {
      const res = await submitQuote(payload);
      if (res.ok) {
        setSubmitted(true);
        clear();
        toast.success("Quote request submitted!");
      } else {
        toast.error(res.error ?? "Submission failed.");
      }
    });
  }

  if (submitted) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center py-24 text-center">
        <CheckCircle2 className="h-16 w-16 text-brand-600" />
        <h1 className="mt-6 font-heading text-3xl font-bold uppercase tracking-tight">
          Quote Requested
        </h1>
        <p className="mt-3 text-muted-foreground">
          Thank you! Our team will review your request and get back to you with
          a tailored quote shortly.
        </p>
        <Button asChild className="mt-8">
          <Link href="/containers">Continue browsing</Link>
        </Button>
      </div>
    );
  }

  if (count === 0) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center py-24 text-center">
        <FileText className="h-16 w-16 text-muted-foreground" />
        <h1 className="mt-6 font-heading text-3xl font-bold uppercase tracking-tight">
          Your quote list is empty
        </h1>
        <p className="mt-3 text-muted-foreground">
          Browse our products and add items to request a tailored quote.
        </p>
        <Button asChild className="mt-8">
          <Link href="/containers">
            Browse products <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
      {/* Items */}
      <div className="space-y-4">
        <h2 className="font-heading text-2xl font-bold uppercase tracking-tight">
          Your Items ({count})
        </h2>
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 sm:flex-row"
          >
            <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-md bg-muted sm:w-32">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  <ImageOff className="h-8 w-8" />
                </div>
              )}
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  {item.slug ? (
                    <Link
                      href={`/products/${item.slug}`}
                      className="font-heading text-lg font-semibold hover:text-brand-700"
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <span className="font-heading text-lg font-semibold">
                      {item.name}
                    </span>
                  )}
                  <div className="text-sm text-brand-700">
                    {formatPrice(item.price, item.currency)}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.productId)}
                  aria-label="Remove item"
                  className="text-muted-foreground transition-colors hover:text-destructive"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Qty</span>
                <div className="flex items-center rounded-md border border-border">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    className="px-2 py-1.5 hover:bg-accent"
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity - 1)
                    }
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-medium">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    className="px-2 py-1.5 hover:bg-accent"
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity + 1)
                    }
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <Input
                placeholder="Custom specs (size, colour, modifications…)"
                value={item.customSpecs ?? ""}
                onChange={(e) =>
                  updateItem(item.productId, { customSpecs: e.target.value })
                }
              />
            </div>
          </div>
        ))}
      </div>

      {/* Contact + submit */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="font-heading text-xl font-bold uppercase tracking-tight">
            Your Details
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            No payment now — we&apos;ll send a tailored quote.
          </p>
          <div className="mt-5 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="full_name">Full name *</Label>
              <Input id="full_name" name="full_name" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="country">Country</Label>
                <Input id="country" name="country" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="company">Company</Label>
              <Input id="company" name="company" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                rows={3}
                placeholder="Delivery location, timeline, anything else…"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={pending}
            >
              {pending ? "Submitting…" : "Submit Quote Request"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
