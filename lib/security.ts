export function contentSecurityPolicy(nonce?: string) {
  const dev = process.env.NODE_ENV === "development";
  const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const connections = ["'self'"];
  if (supabase) {
    const url = new URL(supabase);
    connections.push(url.origin, `${url.protocol === "https:" ? "wss:" : "ws:"}//${url.host}`);
    if (url.hostname.endsWith(".supabase.co")) connections.push(`${url.protocol}//${url.hostname.replace(".supabase.co", ".storage.supabase.co")}`);
  }
  if (dev) connections.push("ws://localhost:*", "ws://127.0.0.1:*");
  return [
    "default-src 'self'",
    `script-src 'self' ${nonce ? `'nonce-${nonce}' 'strict-dynamic'` : "'unsafe-inline'"}${dev ? " 'unsafe-eval'" : ""}`,
    "script-src-attr 'none'",
    `style-src 'self' ${nonce && !dev ? `'nonce-${nonce}'` : "'unsafe-inline'"}`,
    // Public CMS images may use external HTTPS origins; no third-party scripts are allowed.
    `img-src 'self' https: data: blob:${dev ? " http://localhost:* http://127.0.0.1:*" : ""}`,
    "font-src 'self'", `connect-src ${connections.join(" ")}`, "object-src 'none'",
    "base-uri 'self'", "form-action 'self'", "frame-ancestors 'none'",
  ].join("; ");
}

export const baselineHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
];
