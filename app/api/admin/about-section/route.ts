import { NextResponse } from "next/server";
import { adminRoute, readJson, validate, databaseError } from "@/lib/admin/http";
import { revalidateAdminPaths } from "@/lib/admin/revalidate";
import { aboutSectionSchema } from "@/lib/admin/schemas";

export const PUT = adminRoute(async (request, _context, admin) => {
  const data = validate(aboutSectionSchema, await readJson(request));
  const { error } = await admin.supabase.from("about_section").upsert({ id: "about-section", ...data }, { onConflict: "id" });
  if (error) databaseError(error);
  revalidateAdminPaths();
  return NextResponse.json({ success: true, message: "About section updated.", data });
});
