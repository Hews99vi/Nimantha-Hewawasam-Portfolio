import { z } from "zod";
import { projectImagesSchema } from "@/lib/project-media";
import { normalizePublicAssetPath } from "@/lib/asset-path";
import { allowedIconKeys } from "@/lib/icons";
import { normalizeDateTimeInput, slugify } from "@/lib/slug";
import { internationalPhonePattern, normalizeWhatsAppNumber } from "@/lib/whatsapp";
import { isActionHref, isWebUrl } from "@/lib/links";

const nonEmpty = z.string().trim().min(1).max(100000);
const actionHref = z.string().trim().max(2048).refine(isActionHref, "Use a complete http(s) URL, an internal /path or #section, or a mailto: address.");
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
  .refine((value) => !value || /T.*(?:Z|[+-]\d{2}:\d{2})$/i.test(value) && Boolean(normalizeDateTimeInput(value)), "Use an ISO date with an explicit timezone.")
  .transform((value) => normalizeDateTimeInput(value));

export const siteIntroSchema = z.object({
  eyebrow: nonEmpty,
  headline_line_1: nonEmpty,
  headline_line_2: nonEmpty,
  intro_label: nonEmpty,
  intro_heading: nonEmpty,
  intro_body: nonEmpty,
  cta_label: nonEmpty,
  cta_href: actionHref,
  work_link_label: nonEmpty,
  work_link_href: actionHref,
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
  email: z.string().trim().email(),
  whatsapp_number: z.string().max(80).transform(normalizeWhatsAppNumber)
    .refine((value) => !value || internationalPhonePattern.test(value),
      "Enter a WhatsApp number with + and country code, for example +94 77 123 4567. Use 7–15 digits; omit the local leading zero.")
    .nullable().optional(),
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
  href: z.string().trim().max(2048).refine((value) => isWebUrl(value) || /^mailto:/i.test(value) && isActionHref(value), "Use a complete http(s) profile URL without a leading #, or a valid mailto: address."),
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
  images: projectImagesSchema.optional(),
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
  url: optionalNullableString.refine((value) => !value || value === "#" || isWebUrl(value), "Use a complete http(s) URL or leave this empty."),
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
    category_ids: z.array(z.uuid()).max(100).refine((ids) => new Set(ids).size === ids.length, "Choose each category only once.").default([]),
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
      id: z.uuid(),
      sort_order: z.number().int().nonnegative(),
    }),
  ).max(1000).refine((items) => new Set(items.map((item) => item.id)).size === items.length, "Each item must appear only once."),
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
