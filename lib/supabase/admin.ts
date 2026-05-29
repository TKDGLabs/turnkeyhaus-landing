import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";

let cachedAdminClient: SupabaseClient | null = null;

export function createSupabaseAdminClient(): SupabaseClient {
  if (cachedAdminClient) return cachedAdminClient;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  cachedAdminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  return cachedAdminClient;
}

export function getBearerToken(request: Request): string | null {
  const authorization = request.headers.get("authorization") || request.headers.get("Authorization");
  if (!authorization?.startsWith("Bearer ")) return null;
  return authorization.slice("Bearer ".length).trim() || null;
}

export async function getAuthenticatedUser(request: Request): Promise<User | null> {
  const token = getBearerToken(request);
  if (!token) return null;

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) return null;
  return data.user;
}
