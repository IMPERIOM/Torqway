"use server";

import { z } from "zod";
import { createPublicClient } from "@/lib/supabase/public";
import { hasSupabaseEnv } from "@/lib/env";

const itemSchema = z.object({
  product_id: z.string().nullable().optional(),
  name: z.string(),
  slug: z.string().nullable().optional(),
  quantity: z.number().int().min(1),
  custom_specs: z.string().optional(),
  notes: z.string().optional(),
});

const quoteSchema = z.object({
  full_name: z.string().min(2, "Please enter your name."),
  email: z.string().email("Please enter a valid email."),
  phone: z.string().optional(),
  company: z.string().optional(),
  country: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(itemSchema).min(1, "Add at least one product to your quote."),
});

export type QuoteState = { ok: boolean; error?: string };

/**
 * Quote cart submission → writes a `quote_requests` row + a `leads` row.
 * Anonymous insert is permitted by RLS. Admin notification email is added in
 * Phase 3; the admin can already see the row in the dashboard (Phase 4).
 */
export async function submitQuote(
  input: unknown,
): Promise<QuoteState> {
  const parsed = quoteSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Please check the form.",
    };
  }

  if (!hasSupabaseEnv()) {
    return { ok: true };
  }

  const d = parsed.data;
  try {
    const sb = createPublicClient();

    const { error: quoteError } = await sb.from("quote_requests").insert({
      full_name: d.full_name,
      email: d.email,
      phone: d.phone || null,
      company: d.company || null,
      country: d.country || null,
      notes: d.notes || null,
      items: d.items,
      source: "quote_cart",
    });
    if (quoteError) throw quoteError;

    // Best-effort lead capture (don't fail the submission if this errors).
    await sb.from("leads").insert({
      name: d.full_name,
      email: d.email,
      phone: d.phone || null,
      company: d.company || null,
      country: d.country || null,
      source: "quote_cart",
      message: d.notes || null,
      metadata: { item_count: d.items.length },
    });

    return { ok: true };
  } catch (e) {
    console.error("submitQuote:", e);
    return {
      ok: false,
      error: "Could not submit your quote. Please try again or use WhatsApp.",
    };
  }
}
