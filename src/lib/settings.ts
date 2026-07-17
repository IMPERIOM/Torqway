import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import { hasSupabaseEnv } from "@/lib/env";
import { siteConfig } from "@/config/site";
import { buildWhatsAppLink } from "@/lib/format";

export type SiteSettings = {
  whatsappNumber: string;
  whatsappMessage: string;
  contactEmail: string;
  contactPhone: string;
  companyAddress: string;
  socialLinks: Record<string, string>;
};

const FALLBACK: SiteSettings = {
  whatsappNumber: siteConfig.fallbackWhatsApp,
  whatsappMessage: siteConfig.fallbackWhatsAppMessage,
  contactEmail: "",
  contactPhone: "",
  companyAddress: "",
  socialLinks: {},
};

/** Read all app_settings rows into a typed object (cached per request). */
export const getSettings = cache(async (): Promise<SiteSettings> => {
  if (!hasSupabaseEnv()) return FALLBACK;
  try {
    const sb = createPublicClient();
    const { data, error } = await sb.from("app_settings").select("key, value");
    if (error) throw error;

    const map = new Map((data ?? []).map((r) => [r.key, r.value]));
    const str = (k: string, fallback: string) => {
      const v = map.get(k);
      return typeof v === "string" && v ? v : fallback;
    };

    return {
      whatsappNumber: str("whatsapp_number", FALLBACK.whatsappNumber),
      whatsappMessage: str("whatsapp_default_message", FALLBACK.whatsappMessage),
      contactEmail: str("contact_email", ""),
      contactPhone: str("contact_phone", ""),
      companyAddress: str("company_address", ""),
      socialLinks:
        (map.get("social_links") as Record<string, string> | undefined) ?? {},
    };
  } catch (e) {
    console.error("getSettings failed:", e);
    return FALLBACK;
  }
});

/** Build a wa.me link, optionally overriding the default prefilled message. */
export async function getWhatsAppLink(message?: string): Promise<string> {
  const s = await getSettings();
  return buildWhatsAppLink(s.whatsappNumber, message ?? s.whatsappMessage);
}
