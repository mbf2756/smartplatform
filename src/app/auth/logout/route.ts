import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              try { (cookieStore as any).set(name, value, options); } catch {}
            });
          },
        },
      }
    );
    await supabase.auth.signOut();
  } catch (e) {
    // Even if signOut fails, redirect to home and clear client-side session
  }
  const response = NextResponse.redirect(new URL("/", request.url));
  // Clear Supabase auth cookies manually as fallback
  ["sb-access-token","sb-refresh-token"].forEach(name => {
    response.cookies.set(name, "", { maxAge: 0, path: "/" });
  });
  return response;
}
