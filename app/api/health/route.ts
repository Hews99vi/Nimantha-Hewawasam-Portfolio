import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";
import { validateEnvironment } from "@/lib/environment";
export const dynamic = "force-dynamic";
export async function GET() {
  const headers = { "Cache-Control": "no-store, max-age=0" };
  try {
    const { supabaseUrl, anonKey } = validateEnvironment();
    const revision = process.env.PORTFOLIO_REVISION ?? (await readFile(join(process.cwd(), "DEPLOYED_SHA"), "utf8")).trim();
    if (!/^[a-f0-9]{40}$/.test(revision)) throw new Error("Release identity missing");
    const response = await fetch(`${supabaseUrl}/rest/v1/site_intro?select=id&id=eq.site-intro&limit=1`, { headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` }, cache: "no-store", signal: AbortSignal.timeout(5000) });
    const rows: unknown = await response.json();
    if (!response.ok || !Array.isArray(rows) || rows[0]?.id !== "site-intro") throw new Error("Content service unavailable");
    return NextResponse.json({ status: "ok", revision }, { headers });
  } catch {
    return NextResponse.json({ status: "unavailable" }, { status: 503, headers });
  }
}
