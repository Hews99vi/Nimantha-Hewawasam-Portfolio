export type PublicEnvironment = { supabaseUrl: string; anonKey: string; siteUrl: string };
export function validateEnvironment(values: Record<string, string | undefined> = process.env): PublicEnvironment {
  const supabaseUrl = values.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const anonKey = values.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  const siteUrl = values.NEXT_PUBLIC_SITE_URL ?? "";
  for (const [name, value] of [["NEXT_PUBLIC_SUPABASE_URL", supabaseUrl], ["NEXT_PUBLIC_SITE_URL", siteUrl]]) {
    try {
      const url = new URL(value);
      if (!["http:", "https:"].includes(url.protocol) || url.username || url.password || url.search || url.hash || url.pathname !== "/") throw new Error();
    } catch { throw new Error(`${name} must be a complete http(s) origin, for example https://example.com.`); }
  }
  if (!anonKey || /YOUR_|REPLACE_/i.test(anonKey)) throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is missing or is a placeholder.");
  return { supabaseUrl, anonKey, siteUrl };
}
