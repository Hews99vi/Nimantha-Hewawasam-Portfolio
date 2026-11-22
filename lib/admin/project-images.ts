import type { SupabaseClient } from "@supabase/supabase-js";
import {
  ownsImagePath,
  PROJECT_BUCKET,
  projectImagesSchema,
  IMAGE_TYPES,
} from "@/lib/project-media";
import type { ProjectImage } from "@/types/content";

export async function validateStoredImages(
  supabase: SupabaseClient,
  id: string,
  value: unknown,
): Promise<string | null> {
  const parsed = projectImagesSchema.safeParse(value);
  if (!parsed.success) return "Invalid image metadata.";
  if (parsed.data.some((image) => !ownsImagePath(id, image.storage_path)))
    return "Images must belong to this project.";
  if (!parsed.data.length) return null;
  const { data, error } = await supabase.storage
    .from(PROJECT_BUCKET)
    .list(id, { limit: 1000 });
  if (error)
    return "Image storage could not be checked. Check the gallery migration and retry.";
  for (const image of parsed.data) {
    const file = data.find(
      (file) => `${id}/${file.name}` === image.storage_path,
    );
    if (
      !file ||
      Number(file.metadata?.size) !== image.size ||
      !IMAGE_TYPES.includes(file.metadata?.mimetype ?? "")
    )
      return "An image is missing or its metadata changed. Upload it again before saving.";
  }
  return null;
}
export async function cleanupImages(
  supabase: SupabaseClient,
  images: ProjectImage[],
) {
  if (!images.length) return false;
  const { error } = await supabase.storage
    .from(PROJECT_BUCKET)
    .remove(images.map((image) => image.storage_path));
  return Boolean(error);
}
