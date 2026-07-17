import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { env } from "@/lib/env";

/**
 * Service-role client. BYPASSES Row Level Security — use ONLY in trusted
 * server contexts (Route Handlers, Server Actions, Edge Functions) for
 * operations that legitimately need elevated access (e.g. admin notifications,
 * issuing invoices). Never import this into a Client Component.
 */
export function createAdminClient() {
  if (!env.supabaseServiceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set.");
  }
  return createClient<Database>(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
