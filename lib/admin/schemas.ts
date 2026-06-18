import { z } from "zod";
import { normalizePublicAssetPath } from "@/lib/asset-path";
import { allowedIconKeys } from "@/lib/icons";
import { normalizeDateTimeInput, slugify } from "@/lib/slug";

const nonEmpty = z.string().trim().min(1);
const optionalNullableString = z.string().trim().nullish().transform((value) => {
  if (!value) return null;
  return value;
});
const optionalAssetPath = z
  .string()
  .trim()
  .nullish()
  .transform((value) => normalizePublicAssetPath(value));
const slugSchema = z
  .string()
  .trim()
  .min(1)
  .transform((value) => slugify(value))
  .refine((value) => value.length > 0, "Slug is required.");
const isoInputSchema = z
  .string()
  .trim()
  .nullish()
  .refine((value) => !value || Boolean(normalizeDateTimeInput(value)), "Invalid date.")
  .transform((value) => normalizeDateTimeInput(value));

export const siteIntroSchema = z.object({
  eyebrow: nonEmpty,
  headline_line_1: nonEmpty,
  headline_line_2: nonEmpty,
  intro_label: nonEmpty,
  intro_heading: nonEmpty,
  intro_body: nonEmpty,
  cta_label: nonEmpty,
  cta_href: nonEmpty,
  work_link_label: nonEmpty,
  work_link_href: nonEmpty,
});

export const aboutSectionSchema = z.object({
  eyebrow: nonEmpty,
  title: nonEmpty,
  intro: nonEmpty,
  body: nonEmpty,
});

export const contactSectionSchema = z.object({
  eyebrow: nonEmpty,
  title: nonEmpty,
  body: nonEmpty,
  email: nonEmpty,
  location: nonEmpty,
  availability: nonEmpty,
});

export const blogSettingsSchema = z.object({
  eyebrow: nonEmpty,
  title: nonEmpty,
  intro: nonEmpty,
  featured_title: nonEmpty,
  featured_intro: nonEmpty,
});

export const socialLinkSchema = z.object({
  sort_order: z.number().int().nonnegative(),
  label: nonEmpty,
  href: nonEmpty,
  icon_key: z.enum(allowedIconKeys),
  is_active: z.boolean(),
});

export const aboutStatSchema = z.object({
  sort_order: z.number().int().nonnegative(),
  label: nonEmpty,
  is_active: z.boolean(),
});

export const serviceSchema = z.object({
  sort_order: z.number().int().nonnegative(),
  title: nonEmpty,
  description: nonEmpty,
  fit: nonEmpty,
  icon_key: z.enum(allowedIconKeys),
  is_active: z.boolean(),
});

export const projectSchema = z.object({
  sort_order: z.number().int().nonnegative(),
  category: nonEmpty,
  title: nonEmpty,
  description: nonEmpty,
  role: nonEmpty,
  problem: nonEmpty,
  tags: z.array(nonEmpty),
  is_featured: z.boolean(),
  is_active: z.boolean(),
});

export const techGroupSchema = z.object({
  sort_order: z.number().int().nonnegative(),
  title: nonEmpty,
  icon_key: z.enum(allowedIconKeys),
  is_active: z.boolean(),
});

export const techGroupItemSchema = z.object({
  tech_group_id: nonEmpty,
  sort_order: z.number().int().nonnegative(),
  label: nonEmpty,
});

export const processStepSchema = z.object({
  sort_order: z.number().int().nonnegative(),
  title: nonEmpty,
  description: nonEmpty,
  is_active: z.boolean(),
});

export const whyWorkItemSchema = z.object({
  sort_order: z.number().int().nonnegative(),
  title: nonEmpty,
  description: nonEmpty,
  icon_key: z.enum(allowedIconKeys),
  is_active: z.boolean(),
});

export const testimonialSchema = z.object({
  sort_order: z.number().int().nonnegative(),
  quote: nonEmpty,
  name: nonEmpty,
  role: nonEmpty,
  is_active: z.boolean(),
});

export const trustedBrandSchema = z.object({
  sort_order: z.number().int().nonnegative(),
  name: nonEmpty,
  url: optionalNullableString,
  logo_src: optionalAssetPath,
  industry: optionalNullableString,
  is_active: z.boolean(),
});

export const blogCategorySchema = z.object({
  sort_order: z.number().int().nonnegative(),
  name: nonEmpty,
  slug: slugSchema,
  is_active: z.boolean(),
});

export const blogPostSchema = z
  .object({
    sort_order: z.number().int().nonnegative(),
    title: nonEmpty,
    slug: slugSchema,
    excerpt: nonEmpty,
    cover_image: optionalAssetPath,
    content_markdown: nonEmpty,
    author_name: nonEmpty,
    reading_time: nonEmpty,
    published_at: isoInputSchema,
    seo_title: optionalNullableString,
    seo_description: optionalNullableString,
    is_featured: z.boolean(),
    is_published: z.boolean(),
    category_ids: z.array(nonEmpty).default([]),
  })
  .superRefine((data, ctx) => {
    if (data.is_published && !data.published_at) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["published_at"],
        message: "Published date is required when the post is published.",
      });
    }
  });

export const reorderSchema = z.object({
  items: z.array(
    z.object({
      id: nonEmpty,
      sort_order: z.number().int().nonnegative(),
    }),
  ),
});

export const idSchema = z.object({
  id: nonEmpty,
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type SectionSingleton =
  | "site_intro"
  | "about_section"
  | "contact_section"
  | "blog_settings";

export const nullableStringSchema = optionalNullableString;
