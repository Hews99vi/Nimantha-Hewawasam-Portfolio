import { z } from "zod";

export const PROJECT_BUCKET = "project-images";
export const MAX_IMAGE_BYTES = 20 * 1024 * 1024;
export const MAX_PROJECT_IMAGES = 10;
export const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];
const objectPath = /^[0-9a-f-]{36}\/[0-9a-f-]{36}\.(png|jpe?g|webp)$/i;
export const projectImageSchema = z.object({
  storage_path: z.string().regex(objectPath, "Invalid project image path."),
  alt: z
    .string()
    .trim()
    .min(1, "Add alternative text for each image.")
    .max(500),
  caption: z.string().trim().max(2000).default(""),
  width: z.number().int().positive().max(50000),
  height: z.number().int().positive().max(50000),
  size: z.number().int().positive().max(MAX_IMAGE_BYTES),
});
export const projectImagesSchema = z
  .array(projectImageSchema)
  .max(MAX_PROJECT_IMAGES)
  .refine(
    (images) =>
      new Set(images.map((image) => image.storage_path)).size === images.length,
    "Each image may appear only once.",
  );
export function ownsImagePath(projectId: string, path: string) {
  return objectPath.test(path) && path.split("/")[0] === projectId;
}
export function validateUpload(file: { size: number; type: string }) {
  if (!IMAGE_TYPES.includes(file.type))
    return "Choose a PNG, JPEG, or WebP image.";
  if (!file.size || file.size > MAX_IMAGE_BYTES)
    return "Choose an image between 1 byte and 20 MB.";
  return null;
}
export function imageUrl(path: string) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return base
    ? `${base.replace(/\/$/, "")}/storage/v1/object/public/${PROJECT_BUCKET}/${path}`
    : "";
}
