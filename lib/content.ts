import { normalizeProjects } from "@/lib/projects";
import { normalizeSiteIntroActions } from "@/lib/site-intro";
import { normalizeSocialLinks } from "@/lib/social-links";
import { unstable_cache } from "next/cache";
import { defaultPortfolioContent } from "@/lib/content-defaults";
import {
  createSupabasePublicClient,
  createSupabaseServerClient,
} from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type {
  AboutSection,
  BlogCategory,
  BlogLandingContent,
  BlogPost,
  BlogPostCategory,
  BlogPostWithCategories,
  BlogSettings,
  ContactSection,
  PortfolioContent,
  ProjectItem,
  SiteIntro,
  TechGroup,
  TechGroupItem,
  TrustedBrand,
} from "@/types/content";

function normalizeFeaturedProject(projects: ProjectItem[]) {
  const featured = projects.find((project) => project.is_featured);

  if (featured) {
    return projects;
  }

  return projects.map((project, index) => ({
    ...project,
    is_featured: index === 0,
  }));
}

function normalizeFeaturedBlogPost(posts: BlogPost[]) {
  const featured = posts.find((post) => post.is_featured);

  if (featured) {
    return posts;
  }

  return posts.map((post, index) => ({
    ...post,
    is_featured: index === 0,
  }));
}

function attachBlogCategories(
  posts: BlogPost[],
  categories: BlogCategory[],
  mappings: BlogPostCategory[],
): BlogPostWithCategories[] {
  return posts.map((post) => {
    const categoryIds = mappings
      .filter((mapping) => mapping.post_id === post.id)
      .map((mapping) => mapping.category_id);

    return {
      ...post,
      category_ids: categoryIds,
      categories: categories.filter((category) => categoryIds.includes(category.id)),
    };
  });
}

function stripBlogPostCategories(posts: BlogPostWithCategories[]): BlogPost[] {
  return posts.map((post) => ({
    id: post.id,
    sort_order: post.sort_order,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    cover_image: post.cover_image,
    content_markdown: post.content_markdown,
    author_name: post.author_name,
    reading_time: post.reading_time,
    published_at: post.published_at,
    seo_title: post.seo_title,
    seo_description: post.seo_description,
    is_featured: post.is_featured,
    is_published: post.is_published,
    category_ids: post.category_ids,
  }));
}

function normalizeContent(content: PortfolioContent): PortfolioContent {
  return { ...content, siteIntro: normalizeSiteIntroActions(content.siteIntro), socialLinks: normalizeSocialLinks(content.socialLinks), projects: normalizeProjects(content.projects), contactSection: { ...content.contactSection, whatsapp_number: content.contactSection.whatsapp_number ?? null } };
}

type QueryResult = { data: unknown; error: { code?: string } | null };
function checked<T>(table: string, result: QueryResult, singleton = false): T {
  if (result.error || result.data === null || (!singleton && !Array.isArray(result.data))) {
    console.error("Portfolio content query failed", { table, code: result.error?.code ?? "missing-data" });
    throw new Error("Portfolio content is temporarily unavailable.");
  }
  return result.data as T;
}

async function fetchContent(admin = false): Promise<PortfolioContent> {
  const supabase = admin ? await createSupabaseServerClient() : createSupabasePublicClient();
  const list = (table: string, visibility?: string) => {
    let query = supabase.from(table).select("*");
    if (!admin && visibility) query = query.eq(visibility, true);
    return query.order("sort_order");
  };
  const [intro, about, contact, social, stats, services, projects, groups, items, process, principles, feedback, brands, settings, categories, posts, mappings] = await Promise.all([
    supabase.from("site_intro").select("*").eq("id", "site-intro").maybeSingle(),
    supabase.from("about_section").select("*").eq("id", "about-section").maybeSingle(),
    supabase.from("contact_section").select("*").eq("id", "contact-section").maybeSingle(),
    list("social_links", "is_active"), list("about_stats", "is_active"), list("services", "is_active"), list("projects", "is_active"), list("tech_groups", "is_active"), list("tech_group_items"), list("process_steps", "is_active"), list("why_work_items", "is_active"), list("testimonials", "is_active"), list("trusted_brands", "is_active"),
    supabase.from("blog_settings").select("*").eq("id", "blog-settings").maybeSingle(),
    list("blog_categories", "is_active"), list("blog_posts", "is_published"), supabase.from("blog_post_categories").select("*"),
  ]);
  const techItems = checked<TechGroupItem[]>("tech_group_items", items);
  const blogCategories = checked<BlogCategory[]>("blog_categories", categories);
  const blogPosts = attachBlogCategories(normalizeFeaturedBlogPost(checked<BlogPost[]>("blog_posts", posts)), blogCategories, checked<BlogPostCategory[]>("blog_post_categories", mappings));
  return normalizeContent({
    siteIntro: checked<SiteIntro>("site_intro", intro, true), aboutSection: checked<AboutSection>("about_section", about, true), contactSection: checked<ContactSection>("contact_section", contact, true),
    socialLinks: checked<PortfolioContent["socialLinks"]>("social_links", social), aboutStats: checked<PortfolioContent["aboutStats"]>("about_stats", stats), services: checked<PortfolioContent["services"]>("services", services), projects: normalizeFeaturedProject(checked<ProjectItem[]>("projects", projects)),
    techGroups: checked<Omit<TechGroup, "items">[]>("tech_groups", groups).map(group => ({ ...group, items: techItems.filter(item => item.tech_group_id === group.id) })),
    processSteps: checked<PortfolioContent["processSteps"]>("process_steps", process), whyWorkItems: checked<PortfolioContent["whyWorkItems"]>("why_work_items", principles), testimonials: checked<PortfolioContent["testimonials"]>("testimonials", feedback), trustedBrands: checked<TrustedBrand[]>("trusted_brands", brands), blogSettings: checked<BlogSettings>("blog_settings", settings, true), blogCategories, blogPosts: stripBlogPostCategories(blogPosts),
  });
}

// Throwing preserves Next's last successful ISR entry instead of caching sample content.
const getCachedPortfolioContent = unstable_cache(() => fetchContent(), ["portfolio-content-v5"], { revalidate: 120, tags: ["portfolio-content"] });
export async function getPortfolioContent(): Promise<PortfolioContent> {
  if (!isSupabaseConfigured()) {
    if (process.env.NODE_ENV === "development") return defaultPortfolioContent;
    throw new Error("Supabase environment variables are missing.");
  }
  return getCachedPortfolioContent();
}

export async function getBlogLandingContent(): Promise<BlogLandingContent> {
  const content = await getPortfolioContent();
  const activeCategories = (content.blogCategories ?? defaultPortfolioContent.blogCategories)
    .filter((category) => category.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);
  const publishedPosts = normalizeFeaturedBlogPost(
    (content.blogPosts ?? defaultPortfolioContent.blogPosts)
      .filter((post) => post.is_published)
      .sort((a, b) => a.sort_order - b.sort_order),
  );
  const postsWithCategories = attachBlogCategories(
    publishedPosts,
    activeCategories,
    publishedPosts.flatMap((post) =>
      post.category_ids.map((category_id) => ({ post_id: post.id, category_id })),
    ),
  );
  const featuredPost = postsWithCategories.find((post) => post.is_featured) ?? postsWithCategories[0] ?? null;

  return {
    settings: content.blogSettings,
    categories: activeCategories,
    featuredPost,
    posts: postsWithCategories,
  };
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPostWithCategories | null> {
  const landing = await getBlogLandingContent();
  return landing.posts.find((post) => post.slug === slug) ?? null;
}

export async function getAdminBootstrapData(): Promise<PortfolioContent> {
  if (!isSupabaseConfigured()) throw new Error("Supabase environment variables are missing.");
  return fetchContent(true);
}
