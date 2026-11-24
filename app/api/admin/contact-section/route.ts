import { NextResponse } from "next/server";
import { adminRoute, readJson, validate, databaseError, HttpError } from "@/lib/admin/http";
import { revalidateAdminPaths } from "@/lib/admin/revalidate";
import { contactSectionSchema } from "@/lib/admin/schemas";

export const PUT = adminRoute(async (request, _context, admin) => {
  const data = validate(contactSectionSchema, await readJson(request));
  const { error } = await admin.supabase.from("contact_section").upsert({ id: "contact-section", ...data }, { onConflict: "id" });
  if (error) {
    if (["PGRST204", "42703"].includes(error.code) && error.message.includes("whatsapp_number"))
      throw new HttpError(503, "Apply supabase/migrations/202611240001_contact_whatsapp.sql before saving the WhatsApp field. Your edits have been kept.");
    databaseError(error);
  }
  revalidateAdminPaths();
  return NextResponse.json({ success: true, message: "Contact section updated.", data });
});
