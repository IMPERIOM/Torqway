"use server";

import { z } from "zod";
import { createPublicClient } from "@/lib/supabase/public";
import { hasSupabaseEnv } from "@/lib/env";

const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.string().email("Please enter a valid email."),
  phone: z.string().optional(),
  company: z.string().optional(),
  country: z.string().optional(),
  message: z.string().min(5, "Please enter a message."),
});

export type ContactState = { ok: boolean; error?: string };

/**
 * Contact form submission → creates a `leads` row (source: web_form).
 * Anonymous insert is permitted by RLS. Email notifications are wired in
 * Phase 3. Falls back to a no-op success in local dev without Supabase.
 */
export async function submitContactLead(
  input: Record<string, unknown>,
): Promise<ContactState> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Please check the form.",
    };
  }

  if (!hasSupabaseEnv()) {
    // Allow the UI to be exercised before the database is connected.
    return { ok: true };
  }

  try {
    const sb = createPublicClient();
    const { error } = await sb.from("leads").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      company: parsed.data.company || null,
      country: parsed.data.country || null,
      message: parsed.data.message,
      source: "web_form",
      metadata: { page: "contact" },
    });
    if (error) throw error;
    return { ok: true };
  } catch (e) {
    console.error("submitContactLead:", e);
    return { ok: false, error: "Something went wrong. Please try WhatsApp." };
  }
}
