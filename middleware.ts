// ─────────────────────────────────────────────────────────────────────────────
// Middleware — runs on every request
// 1. Detects which domain (smartetf.com.au vs smartsuper.com.au)
//    and injects x-site header so layouts can render the right brand.
// 2. Refreshes Supabase session cookie so it doesn't expire silently.
// 3. Protects /dashboard routes — redirects unauthenticated users to /auth/login.
// ─────────────────────────────────────────────────────────────────────────────

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function middleware(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl;

  // ── Determine site from hostname ─────────────────────────────────────────
  const site: "smartetf" | "smartsuper" =
    hostname.includes("smartsuper") ? "smartsuper" : "smartetf";

  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  // ── Inject site header so Server Components can read it ──────────────────
  response.headers.set("x-site", site);

  // ── Supabase session refresh ─────────────────────────────────────────────
  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON, {
    cookies: {
      getAll() { return request.cookies.getAll(); },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({ request });
        response.headers.set("x-site", site);
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();

  // ── Protect /dashboard ────────────────────────────────────────────────────
  if (pathname.startsWith("/dashboard") && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/auth/login";
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── Redirect logged-in users away from /auth/login ───────────────────────
  if (pathname.startsWith("/auth/login") && user) {
    const dashUrl = request.nextUrl.clone();
    dashUrl.pathname = "/dashboard";
    return NextResponse.redirect(dashUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
