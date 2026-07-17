import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { env } from "@/lib/env";

/**
 * Anonymous, session-less Supabase client for reading PUBLIC content
 * (products, categories, projects, blog, settings…).
 *
 * Unlike the cookie-based server client this never touches `cookies()`, so it
 * is safe to call from `generateStaticParams` and during static rendering.
 * RLS still applies — it reads as the `anon` role.
 */
export function createPublicClient() {
  return createClient<Database>(env.supabaseUrl, env.supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
