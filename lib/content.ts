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

function withPortfolioDefaults(content: Partial<PortfolioContent>): PortfolioContent {
  return {
    ...defaultPortfolioContent,
    ...content,
    siteIntro: content.siteIntro ?? defaultPortfolioContent.siteIntro,
    aboutSection: content.aboutSection ?? defaultPortfolioContent.aboutSection,
    contactSection: content.contactSection ?? defaultPortfolioContent.contactSection,
    socialLinks: content.socialLinks ?? defaultPortfolioContent.socialLinks,
    aboutStats: content.aboutStats ?? defaultPortfolioContent.aboutStats,
    services: content.services ?? defaultPortfolioContent.services,
    projects: content.projects ?? defaultPortfolioContent.projects,
    techGroups: content.techGroups ?? defaultPortfolioContent.techGroups,
    processSteps: content.processSteps ?? defaultPortfolioContent.processSteps,
    whyWorkItems: content.whyWorkItems ?? defaultPortfolioContent.whyWorkItems,
    testimonials: content.testimonials ?? defaultPortfolioContent.testimonials,
    trustedBrands: content.trustedBrands ?? defaultPortfolioContent.trustedBrands,
    blogSettings: content.blogSettings ?? defaultPortfolioContent.blogSettings,
    blogCategories: content.blogCategories ?? defaultPortfolioContent.blogCategories,
    blogPosts: content.blogPosts ?? defaultPortfolioContent.blogPosts,
  };
}

async function fetchPortfolioContentFromSupabase(): Promise<PortfolioContent> {
  const supabase = createSupabasePublicClient();

  const [
    siteIntroResult,
    aboutResult,
    contactResult,
    socialLinksResult,
    aboutStatsResult,
    servicesResult,
    projectsResult,
    techGroupsResult,
    techItemsResult,
    processResult,
    whyWorkResult,
    testimonialsResult,
    trustedBrandsResult,
    blogSettingsResult,
    blogCategoriesResult,
    blogPostsResult,
    blogPostCategoriesResult,
  ] = await Promise.all([
    supabase.from("site_intro").select("*").limit(1).maybeSingle(),
    supabase.from("about_section").select("*").limit(1).maybeSingle(),
    supabase.from("contact_section").select("*").limit(1).maybeSingle(),
    supabase.from("social_links").select("*").eq("is_active", true).order("sort_order"),
    supabase.from("about_stats").select("*").eq("is_active", true).order("sort_order"),
    supabase.from("services").select("*").eq("is_active", true).order("sort_order"),
    supabase.from("projects").select("*").eq("is_active", true).order("sort_order"),
    supabase.from("tech_groups").select("*").eq("is_active", true).order("sort_order"),
    supabase.from("tech_group_items").select("*").order("sort_order"),
    supabase.from("process_steps").select("*").eq("is_active", true).order("sort_order"),
    supabase.from("why_work_items").select("*").eq("is_active", true).order("sort_order"),
    supabase.from("testimonials").select("*").eq("is_active", true).order("sort_order"),
    supabase.from("trusted_brands").select("*").eq("is_active", true).order("sort_order"),
    supabase.from("blog_settings").select("*").limit(1).maybeSingle(),
    supabase.from("blog_categories").select("*").eq("is_active", true).order("sort_order"),
    supabase.from("blog_posts").select("*").eq("is_published", true).order("sort_order"),
    supabase.from("blog_post_categories").select("*"),
  ]);

  const techItems = (techItemsResult.data ?? []) as TechGroupItem[];
  const techGroups = ((techGroupsResult.data ?? []) as Omit<TechGroup, "items">[]).map(
    (group) => ({
      ...group,
      items: techItems.filter((item) => item.tech_group_id === group.id),
    }),
  );

  const blogCategories =
    (blogCategoriesResult.data as BlogCategory[] | null) ??
    defaultPortfolioContent.blogCategories;
  const blogPosts = normalizeFeaturedBlogPost(
    (blogPostsResult.data as BlogPost[] | null) ?? defaultPortfolioContent.blogPosts,
  );
  const blogPostCategories =
    (blogPostCategoriesResult.data as BlogPostCategory[] | null) ??
    defaultPortfolioContent.blogPosts.flatMap((post) =>
      post.category_ids.map((category_id) => ({ post_id: post.id, category_id })),
    );
  const blogPostsWithCategories = attachBlogCategories(
    blogPosts,
    blogCategories,
    blogPostCategories,
  );

  return {
    siteIntro: ((siteIntroResult.data as SiteIntro | null) ?? defaultPortfolioContent.siteIntro),
    aboutSection:
      ((aboutResult.data as AboutSection | null) ?? defaultPortfolioContent.aboutSection),
    contactSection:
      ((contactResult.data as ContactSection | null) ??
        defaultPortfolioContent.contactSection),
    socialLinks: socialLinksResult.data ?? defaultPortfolioContent.socialLinks,
    aboutStats: aboutStatsResult.data ?? defaultPortfolioContent.aboutStats,
    services: servicesResult.data ?? defaultPortfolioContent.services,
    projects: normalizeFeaturedProject(
      (projectsResult.data as ProjectItem[] | null) ?? defaultPortfolioContent.projects,
    ),
    techGroups: techGroups.length > 0 ? techGroups : defaultPortfolioContent.techGroups,
    processSteps: processResult.data ?? defaultPortfolioContent.processSteps,
    whyWorkItems: whyWorkResult.data ?? defaultPortfolioContent.whyWorkItems,
    testimonials: testimonialsResult.data ?? defaultPortfolioContent.testimonials,
    trustedBrands:
      ((trustedBrandsResult.data as TrustedBrand[] | null) ??
        defaultPortfolioContent.trustedBrands),
    blogSettings:
      ((blogSettingsResult.data as BlogSettings | null) ??
        defaultPortfolioContent.blogSettings),
    blogCategories,
    blogPosts: stripBlogPostCategories(blogPostsWithCategories),
  };
}

const getCachedPortfolioContent = unstable_cache(
  async () => withPortfolioDefaults(await fetchPortfolioContentFromSupabase()),
  ["portfolio-content-v3"],
  { revalidate: 120 },
);

export async function getPortfolioContent(): Promise<PortfolioContent> {
  if (!isSupabaseConfigured()) {
    return defaultPortfolioContent;
  }

  try {
    return withPortfolioDefaults(await getCachedPortfolioContent());
  } catch {
    return defaultPortfolioContent;
  }
}

export async function getBlogLandingContent(): Promise<BlogLandingContent> {
  const content = withPortfolioDefaults(await getPortfolioContent());
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
  if (!isSupabaseConfigured()) {
    return defaultPortfolioContent;
  }

  const supabase = await createSupabaseServerClient();

  const [
    siteIntro,
    aboutSection,
    contactSection,
    socialLinks,
    aboutStats,
    services,
    projects,
    techGroups,
    techGroupItems,
    processSteps,
    whyWorkItems,
    testimonials,
    trustedBrands,
    blogSettings,
    blogCategories,
    blogPosts,
    blogPostCategories,
  ] = await Promise.all([
    supabase.from("site_intro").select("*").limit(1).maybeSingle(),
    supabase.from("about_section").select("*").limit(1).maybeSingle(),
    supabase.from("contact_section").select("*").limit(1).maybeSingle(),
    supabase.from("social_links").select("*").order("sort_order"),
    supabase.from("about_stats").select("*").order("sort_order"),
    supabase.from("services").select("*").order("sort_order"),
    supabase.from("projects").select("*").order("sort_order"),
    supabase.from("tech_groups").select("*").order("sort_order"),
    supabase.from("tech_group_items").select("*").order("sort_order"),
    supabase.from("process_steps").select("*").order("sort_order"),
    supabase.from("why_work_items").select("*").order("sort_order"),
    supabase.from("testimonials").select("*").order("sort_order"),
    supabase.from("trusted_brands").select("*").order("sort_order"),
    supabase.from("blog_settings").select("*").limit(1).maybeSingle(),
    supabase.from("blog_categories").select("*").order("sort_order"),
    supabase.from("blog_posts").select("*").order("sort_order"),
    supabase.from("blog_post_categories").select("*"),
  ]);

  const adminBlogCategories =
    (blogCategories.data as BlogCategory[] | null) ?? defaultPortfolioContent.blogCategories;
  const adminBlogPosts = normalizeFeaturedBlogPost(
    (blogPosts.data as BlogPost[] | null) ?? defaultPortfolioContent.blogPosts,
  );
  const adminMappings =
    (blogPostCategories.data as BlogPostCategory[] | null) ??
    defaultPortfolioContent.blogPosts.flatMap((post) =>
      post.category_ids.map((category_id) => ({ post_id: post.id, category_id })),
    );

  return {
    siteIntro: siteIntro.data ?? defaultPortfolioContent.siteIntro,
    aboutSection: aboutSection.data ?? defaultPortfolioContent.aboutSection,
    contactSection: contactSection.data ?? defaultPortfolioContent.contactSection,
    socialLinks: socialLinks.data ?? defaultPortfolioContent.socialLinks,
    aboutStats: aboutStats.data ?? defaultPortfolioContent.aboutStats,
    services: services.data ?? defaultPortfolioContent.services,
    projects: projects.data ?? defaultPortfolioContent.projects,
    techGroups:
      techGroups.data?.map((group) => ({
        ...group,
        items:
          techGroupItems.data?.filter((item) => item.tech_group_id === group.id) ?? [],
      })) ?? defaultPortfolioContent.techGroups,
    processSteps: processSteps.data ?? defaultPortfolioContent.processSteps,
    whyWorkItems: whyWorkItems.data ?? defaultPortfolioContent.whyWorkItems,
    testimonials: testimonials.data ?? defaultPortfolioContent.testimonials,
    trustedBrands: trustedBrands.data ?? defaultPortfolioContent.trustedBrands,
    blogSettings: blogSettings.data ?? defaultPortfolioContent.blogSettings,
    blogCategories: adminBlogCategories,
    blogPosts: stripBlogPostCategories(
      attachBlogCategories(adminBlogPosts, adminBlogCategories, adminMappings),
    ),
  };
}
