import { describe, expect, it, vi } from "vitest";
import {
  MAX_IMAGE_BYTES,
  ownsImagePath,
  projectImagesSchema,
  validateUpload,
} from "@/lib/project-media";
import { normalizeProjects, publicProjects } from "@/lib/projects";
import { defaultPortfolioContent } from "@/lib/content-defaults";
import { validateStoredImages } from "@/lib/admin/project-images";
import type { SupabaseClient } from "@supabase/supabase-js";
const id = "11111111-1111-4111-8111-111111111111";
const image = {
  storage_path: `${id}/22222222-2222-4222-8222-222222222222.png`,
  alt: "Dashboard showing room availability",
  caption: "",
  width: 3200,
  height: 1800,
  size: 1024,
};
describe("original image boundaries", () => {
  it("accepts supported originals up to 20 MB and rejects empty, oversized and unsupported files", () => {
    expect(
      validateUpload({ type: "image/png", size: MAX_IMAGE_BYTES }),
    ).toBeNull();
    expect(
      validateUpload({ type: "image/png", size: MAX_IMAGE_BYTES + 1 }),
    ).toBeTruthy();
    expect(validateUpload({ type: "image/jpeg", size: 0 })).toBeTruthy();
    expect(validateUpload({ type: "image/svg+xml", size: 100 })).toBeTruthy();
  });
  it("requires accessible, bounded, unique metadata", () => {
    expect(projectImagesSchema.safeParse([image]).success).toBe(true);
    for (const images of [
      [{ ...image, alt: " " }],
      [image, image],
      Array.from({ length: 11 }, (_, i) => ({
        ...image,
        storage_path: `${id}/${String(i).padStart(36, "0")}.png`,
      })),
    ])
      expect(projectImagesSchema.safeParse(images).success).toBe(false);
    expect(ownsImagePath(id, image.storage_path)).toBe(true);
    expect(
      ownsImagePath("33333333-3333-4333-8333-333333333333", image.storage_path),
    ).toBe(false);
    expect(ownsImagePath(id, `${id}/../secret.png`)).toBe(false);
  });
  it("rejects cross-project references before contacting storage", async () => {
    const client = { storage: { from: vi.fn() } } as unknown as SupabaseClient;
    expect(
      await validateStoredImages(
        client,
        "33333333-3333-4333-8333-333333333333",
        [image],
      ),
    ).toContain("belong");
    expect(client.storage.from).not.toHaveBeenCalled();
  });
  it("checks that the uploaded original exists with matching size and format", async () => {
    const list = vi.fn().mockResolvedValue({
      data: [
        {
          name: image.storage_path.split("/")[1],
          metadata: { size: 1024, mimetype: "image/png" },
        },
      ],
      error: null,
    });
    const client = {
      storage: { from: () => ({ list }) },
    } as unknown as SupabaseClient;
    expect(await validateStoredImages(client, id, [image])).toBeNull();
    expect(
      await validateStoredImages(client, id, [{ ...image, size: 2048 }]),
    ).toContain("missing");
    list.mockResolvedValue({ data: null, error: { message: "offline" } });
    expect(await validateStoredImages(client, id, [image])).toContain(
      "could not be checked",
    );
  });
});
describe("project navigation", () => {
  it("keeps existing slugs stable and normalizes pre-migration rows", () => {
    const project = defaultPortfolioContent.projects[0];
    expect(normalizeProjects([{ ...project, title: "Renamed" }])[0].slug).toBe(
      project.slug,
    );
    expect(
      normalizeProjects([
        {
          ...project,
          slug: "",
          images: undefined,
        } as unknown as typeof project,
      ])[0].images,
    ).toEqual([]);
  });
  it("excludes inactive work and leads with the featured project", () => {
    const projects = defaultPortfolioContent.projects;
    const result = publicProjects([
      { ...projects[0], is_active: false },
      { ...projects[1], is_featured: false },
      { ...projects[2], is_featured: true },
    ]);
    expect(result.map((p) => p.id)).toEqual([projects[2].id, projects[1].id]);
  });
  it("never ships placeholder testimonials as fallback public content", () =>
    expect(defaultPortfolioContent.testimonials).toEqual([]));
});
