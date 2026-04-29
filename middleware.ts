import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseMiddlewareClient } from "@/lib/supabase/middleware";

function buildRedirectUrl(request: NextRequest, pathname: string, nextPath?: string) {
  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = pathname;
  redirectUrl.search = "";

  if (nextPath) {
    redirectUrl.searchParams.set("next", nextPath);
  }

  return redirectUrl;
}

export async function middleware(request: NextRequest) {
  const client = createSupabaseMiddlewareClient(request);

  // Supabase 환경 변수가 없으면 인증 로직을 건너뜁니다.
  if (!client) {
    return NextResponse.next({ request });
  }

  const { supabase } = client;
  let { response } = client;

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  const isAuthPath = pathname === "/auth";

  if (isAuthPath && user) {
    const next = request.nextUrl.searchParams.get("next");
    const targetPath = next && next.startsWith("/") ? next : "/store";

    return NextResponse.redirect(buildRedirectUrl(request, targetPath));
  }

  return response;
}

export const config = {
  matcher: ["/auth"]
};
