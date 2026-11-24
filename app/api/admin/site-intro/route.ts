import { NextResponse } from "next/server";
import { adminRoute, readJson, validate, databaseError } from "@/lib/admin/http";
import { revalidateAdminPaths } from "@/lib/admin/revalidate";
import { siteIntroSchema } from "@/lib/admin/schemas";

export const PUT = adminRoute(async (request, _context, admin) => {
  const data = validate(siteIntroSchema, await readJson(request));
  const { error } = await admin.supabase.from("site_intro").upsert({ id: "site-intro", ...data }, { onConflict: "id" });
  if (error) databaseError(error);
  revalidateAdminPaths();
  return NextResponse.json({ success: true, message: "Introduction updated.", data });
});
