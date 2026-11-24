import { NextResponse } from "next/server";
import { z } from "zod";
import { adminRoute, readJson, validate, HttpError, databaseError } from "@/lib/admin/http";
import { PROJECT_BUCKET } from "@/lib/project-media";

export const DELETE = adminRoute(async (request, _context, admin) => {
  const { paths } = validate(z.object({ paths: z.array(z.string().regex(/^[0-9a-f-]{36}\/[0-9a-f-]{36}\.(png|jpe?g|webp)$/i)).min(1).max(100) }), await readJson(request));
  const { data: projects, error: queryError } = await admin.supabase.from("projects").select("images");
  if (queryError || !projects) databaseError(queryError);
  const used = new Set(projects.flatMap(project => (project.images ?? []).map((image: { storage_path: string }) => image.storage_path)));
  if (paths.some(path => used.has(path))) throw new HttpError(409, "Save the image removal before cleaning up files.");
  // Storage RLS independently prevents removing referenced originals.
  const { error } = await admin.supabase.storage.from(PROJECT_BUCKET).remove(paths);
  if (error) throw new HttpError(503, "Cleanup failed. Retry when storage is available.");
  return NextResponse.json({ success: true, message: "Unused files removed." });
});
