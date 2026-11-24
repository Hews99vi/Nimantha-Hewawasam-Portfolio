import { NextResponse } from "next/server";
import { getCollectionConfig } from "@/lib/admin/collections";
import { adminRoute, readJson, validate, databaseError, HttpError } from "@/lib/admin/http";
import { revalidateAdminPaths } from "@/lib/admin/revalidate";
import { z } from "zod";

export const GET = adminRoute<{ collection: string }>(async (_request, context, admin) => {
  const config = getCollectionConfig((await context.params).collection);
  if (!config) throw new HttpError(404, "Unknown collection.");
  const { data, error } = await admin.supabase.from(config.table).select("*").order("sort_order");
  if (error) databaseError(error);
  return NextResponse.json({ success: true, message: "Collection loaded.", data });
});

export const POST = adminRoute<{ collection: string }>(async (request, context, admin) => {
  const config = getCollectionConfig((await context.params).collection);
  if (!config) throw new HttpError(404, "Unknown collection.");
  const raw = validate(z.record(z.string(), z.unknown()), await readJson(request));
  const payload = config.table === "projects" && typeof raw.tags === "string" ? { ...raw, tags: raw.tags.split(",").map(t => t.trim()).filter(Boolean) } : raw;
  const parsed = validate(config.schema as z.ZodType<Record<string, unknown>>, payload);
  if (config.table === "projects" && Array.isArray(parsed.images) && parsed.images.length)
    throw new HttpError(400, "Save the project before adding images.");
  const { data, error } = await admin.supabase.from(config.table).insert(parsed).select().single();
  if (error) databaseError(error, "slug");
  revalidateAdminPaths();
  return NextResponse.json({ success: true, message: "Item created.", data });
});
