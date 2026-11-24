import { NextResponse } from "next/server";
import { adminRoute } from "@/lib/admin/http";
import { getAdminBootstrapData } from "@/lib/content";
export const GET = adminRoute(async () => NextResponse.json({ success: true, message: "Admin bootstrap loaded.", data: await getAdminBootstrapData() }, { headers: { "Cache-Control": "private, no-store" } }));
