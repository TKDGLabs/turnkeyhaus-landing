import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "@/lib/supabase/shared";

export function createSupabaseBrowserClient(): SupabaseClient | null {
  const config = getSupabaseEnv();
  if (!config) return null;
  return createBrowserClient(config.url, config.key);
}
