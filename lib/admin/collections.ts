import type { ZodSchema } from "zod";
import {
  aboutStatSchema,
  blogCategorySchema,
  processStepSchema,
  projectSchema,
  serviceSchema,
  socialLinkSchema,
  techGroupItemSchema,
  techGroupSchema,
  testimonialSchema,
  trustedBrandSchema,
  whyWorkItemSchema,
} from "@/lib/admin/schemas";

export const collectionMap = {
  "social-links": { table: "social_links", schema: socialLinkSchema },
  "about-stats": { table: "about_stats", schema: aboutStatSchema },
  services: { table: "services", schema: serviceSchema },
  projects: { table: "projects", schema: projectSchema },
  "blog-categories": { table: "blog_categories", schema: blogCategorySchema },
  "tech-groups": { table: "tech_groups", schema: techGroupSchema },
  "tech-group-items": { table: "tech_group_items", schema: techGroupItemSchema },
  "process-steps": { table: "process_steps", schema: processStepSchema },
  "why-work-items": { table: "why_work_items", schema: whyWorkItemSchema },
  testimonials: { table: "testimonials", schema: testimonialSchema },
  "trusted-brands": { table: "trusted_brands", schema: trustedBrandSchema },
} satisfies Record<string, { table: string; schema: ZodSchema }>;

export type CollectionKey = keyof typeof collectionMap;

export function getCollectionConfig(collection: string) {
  return collectionMap[collection as CollectionKey] ?? null;
}
