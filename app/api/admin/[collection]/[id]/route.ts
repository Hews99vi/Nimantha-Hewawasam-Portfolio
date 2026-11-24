import { NextResponse } from "next/server";
import { z } from "zod";
import { validateStoredImages, cleanupImages } from "@/lib/admin/project-images";
import type { ProjectImage } from "@/types/content";
import { getCollectionConfig } from "@/lib/admin/collections";
import { adminRoute, readJson, validate, databaseError, HttpError } from "@/lib/admin/http";
import { revalidateAdminPaths } from "@/lib/admin/revalidate";

export const PUT = adminRoute<{ collection: string; id: string }>(async (request, context, admin) => {
  const { collection, id } = await context.params;
  validate(z.uuid(), id);
  const config = getCollectionConfig(collection);
  if (!config) throw new HttpError(404, "Unknown collection.");
  const raw = validate(z.record(z.string(), z.unknown()), await readJson(request));
  const payload = config.table === "projects" && typeof raw.tags === "string" ? { ...raw, tags: raw.tags.split(",").map(t => t.trim()).filter(Boolean) } : raw;
  const parsed = validate(config.schema as z.ZodType<Record<string, unknown>>, payload);
  let oldImages: ProjectImage[] = [];
  if (config.table === "projects") {
    const { data: old, error } = await admin.supabase.from("projects").select("images").eq("id", id).maybeSingle();
    if (error) databaseError(error);
    if (!old) throw new HttpError(404, "Project not found.");
    oldImages = old.images ?? [];
    if ("images" in parsed) {
      const message = await validateStoredImages(admin.supabase, id, parsed.images);
      if (message) throw new HttpError(400, message);
    }
  }
  const { data, error } = await admin.supabase.from(config.table).update(parsed).eq("id", id).select().maybeSingle();
  if (error) databaseError(error, "slug");
  if (!data) throw new HttpError(404, "Item not found.");
  revalidateAdminPaths();
  const detached = config.table === "projects" ? oldImages.filter(image => !(data.images ?? []).some((current: ProjectImage) => current.storage_path === image.storage_path)) : [];
  const cleanupFailed = await cleanupImages(admin.supabase, detached).catch(() => true);
  return NextResponse.json({ success: true, message: cleanupFailed ? "Project saved. Some detached files could not be removed; retry cleanup below." : "Item updated.", data, cleanupPaths: cleanupFailed ? detached.map(image => image.storage_path) : [] });
});

export const DELETE = adminRoute<{ collection: string; id: string }>(async (_request, context, admin) => {
  const { collection, id } = await context.params;
  validate(z.uuid(), id);
  const config = getCollectionConfig(collection);
  if (!config) throw new HttpError(404, "Unknown collection.");
  const { data, error } = await admin.supabase.from(config.table).delete().eq("id", id).select().maybeSingle();
  if (error) databaseError(error);
  if (!data) throw new HttpError(404, "Item not found.");
  revalidateAdminPaths();
  const images = config.table === "projects" ? data.images ?? [] : [];
  const cleanupFailed = await cleanupImages(admin.supabase, images).catch(() => true);
  return NextResponse.json({ success: true, message: cleanupFailed ? "Item deleted. Some unused images could not be removed." : "Item deleted.", cleanupPaths: cleanupFailed ? images.map((image: ProjectImage) => image.storage_path) : [] });
});
