import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { contentSecurityPolicy } from "@/lib/security";

export async function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.getRandomValues(new Uint8Array(18))).toString("base64");
  const policy = contentSecurityPolicy(nonce);
  const headers = new Headers(request.headers);
  headers.set("Content-Security-Policy", policy);
  headers.set("x-nonce", nonce);
  let response = NextResponse.next({ request: { headers } });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && key) {
    const supabase = createServerClient(url, key, { cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookies) {
        cookies.forEach(({ name, value }) => request.cookies.set(name, value));
        headers.set("cookie", request.cookies.toString());
        const next = NextResponse.next({ request: { headers } });
        // Preserve previous cookie chunks if the SDK emits more than one update.
        response.cookies.getAll().forEach(cookie => next.cookies.set(cookie));
        cookies.forEach(({ name, value, options }) => next.cookies.set(name, value, options));
        response = next;
      },
    } });
    try { await supabase.auth.getUser(); }
    catch { /* Handlers still verify authorization and return a recoverable service error. */ }
  }
  response.headers.set("Content-Security-Policy", policy);
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
