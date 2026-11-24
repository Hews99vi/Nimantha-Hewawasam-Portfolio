import { slugify } from "@/lib/slug";
import { projectImagesSchema } from "@/lib/project-media";
import type { ProjectItem } from "@/types/content";

// Keeps old rows readable while the additive migration is being rolled out.
export function normalizeProjects(projects: ProjectItem[]): ProjectItem[] {
  const used = new Set<string>();
  return projects.map((project) => {
    const base = project.slug || slugify(project.title) || "project";
    let slug = base;
    if (used.has(slug)) slug = `${base}-${project.id}`;
    used.add(slug);
    const images = projectImagesSchema.safeParse(project.images ?? []);
    return { ...project, slug, images: images.success ? images.data : [] };
  });
}
export function publicProjects(projects: ProjectItem[]) {
  return normalizeProjects(projects)
    .filter((p) => p.is_active)
    .sort(
      (a, b) =>
        Number(b.is_featured) - Number(a.is_featured) ||
        a.sort_order - b.sort_order ||
        a.id.localeCompare(b.id),
    );
}
