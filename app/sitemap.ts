import type { MetadataRoute } from "next";
import { getPortfolioContent } from "@/lib/content";
import { publicProjects } from "@/lib/projects";
import { getSiteUrl } from "@/lib/site";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = getSiteUrl();
  if (!origin) return [];
  const content = await getPortfolioContent();
  return [
    "",
    "/work",
    "/about",
    "/services",
    "/blog",
    "/contact",
    ...publicProjects(content.projects).map((p) => `/work/${p.slug}`),
    ...content.blogPosts
      .filter((p) => p.is_published)
      .map((p) => `/blog/${p.slug}`),
  ].map((path) => ({ url: `${origin}${path}` }));
}
