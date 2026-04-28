import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseEnv } from "@/lib/supabase/shared";

type MiddlewareClientResult = {
  supabase: SupabaseClient;
  response: NextResponse;
};

export function createSupabaseMiddlewareClient(request: NextRequest): MiddlewareClientResult | null {
  const config = getSupabaseEnv();
  if (!config) return null;

  let response = NextResponse.next({ request });

  const supabase = createServerClient(config.url, config.key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        response = NextResponse.next({ request });

        cookiesToSet.forEach(({ name, value, options }: { name: string; value: string; options: CookieOptions }) => {
          response.cookies.set(name, value, options);
        });
      }
    }
  });

  return { supabase, response };
}
