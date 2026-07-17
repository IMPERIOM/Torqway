/** Formatting helpers shared across the public site. */

export function formatPrice(
  value: number | null | undefined,
  currency = "USD",
): string {
  if (value === null || value === undefined) return "Request a quote";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export const STOCK_LABELS: Record<string, string> = {
  in_stock: "In Stock",
  limited: "Limited Stock",
  made_to_order: "Made to Order",
  out_of_stock: "Out of Stock",
};

export const CONDITION_LABELS: Record<string, string> = {
  new: "New",
  used: "Used",
  refurbished: "Refurbished",
};

/** Build a wa.me deep link from a phone number + prefilled message. */
export function buildWhatsAppLink(rawNumber: string, message: string): string {
  const digits = (rawNumber || "").replace(/[^0-9]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
