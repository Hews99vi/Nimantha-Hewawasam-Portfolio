import { NextResponse } from "next/server";
import { adminRoute, readJson, validate, databaseError } from "@/lib/admin/http";
import { revalidateAdminPaths } from "@/lib/admin/revalidate";
import { blogSettingsSchema } from "@/lib/admin/schemas";

export const PUT = adminRoute(async (request, _context, admin) => {
  const data = validate(blogSettingsSchema, await readJson(request));
  const { error } = await admin.supabase.from("blog_settings").upsert({ id: "blog-settings", ...data }, { onConflict: "id" });
  if (error) databaseError(error);
  revalidateAdminPaths();
  return NextResponse.json({ success: true, message: "Blog settings updated.", data });
});
