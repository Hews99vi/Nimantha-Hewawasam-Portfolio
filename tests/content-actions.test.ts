import { beforeEach, describe, expect, it, vi } from "vitest";
import type { BlogCategory, BlogPost, SiteIntro, SocialLink } from "@/types/content";
const state = vi.hoisted(() => ({
  intro: null as SiteIntro | null,
  socialLinks: [] as SocialLink[],
  posts: [] as BlogPost[],
  categories: [] as BlogCategory[],
  failedTable: "",
  singletons: {} as Record<string, unknown>,
}));
vi.mock("@/lib/supabase/config", () => ({ isSupabaseConfigured: () => true }));
vi.mock("next/cache", () => ({
  unstable_cache: (read: () => Promise<unknown>) => read,
}));
vi.mock("@/lib/supabase/server", () => {
  const client = {
    from: (table: string) => {
      const singleton = [
        "site_intro",
        "about_section",
        "contact_section",
        "blog_settings",
      ].includes(table);
      const result = {
        data:
          table === "site_intro"
            ? state.intro ?? state.singletons.site_intro
            : table === "blog_posts" ? state.posts
            : table === "blog_categories" ? state.categories
            : table === "social_links"
              ? state.socialLinks
              : singleton
                ? state.singletons[table]
                : [],
        error: table === state.failedTable ? { code: "NETWORK" } : null,
      };
      const query = {
        select: () => query,
        limit: () => query,
        eq: () => query,
        order: () => query,
        maybeSingle: () => Promise.resolve(result),
        then: (resolve: (value: typeof result) => unknown) =>
          Promise.resolve(result).then(resolve),
      };
      return query;
    },
  };
  return {
    createSupabasePublicClient: () => client,
    createSupabaseServerClient: async () => client,
  };
});
import { getPortfolioContent, getAdminBootstrapData, getBlogLandingContent, getBlogPostBySlug } from "@/lib/content";
import { defaultPortfolioContent } from "@/lib/content-defaults";

beforeEach(() => {
  state.intro = null;
  state.failedTable = "";
  state.singletons = { site_intro: defaultPortfolioContent.siteIntro, about_section: defaultPortfolioContent.aboutSection, contact_section: defaultPortfolioContent.contactSection, blog_settings: defaultPortfolioContent.blogSettings };
});

describe("public and admin hero content", () => {
  it("uses brand icons consistently for legacy public and admin social links", async () => {
    state.socialLinks = [
      {
        id: "social-linkedin",
        sort_order: 1,
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/example",
        icon_key: "briefcaseBusiness",
        is_active: true,
      },
    ];
    const [publicContent, adminContent] = await Promise.all([
      getPortfolioContent(),
      getAdminBootstrapData(),
    ]);
    expect(publicContent.socialLinks).toEqual(adminContent.socialLinks);
    expect(publicContent.socialLinks[0].icon_key).toBe("linkedin");
    expect(state.socialLinks[0].icon_key).toBe("briefcaseBusiness");
  });
  it("uses the same upgraded action values in public content and the editor", async () => {
    state.intro = {
      ...defaultPortfolioContent.siteIntro,
      cta_label: "View Projects",
      cta_href: "#projects",
      work_link_label: "My work",
      work_link_href: "#projects",
    };
    const [publicContent, adminContent] = await Promise.all([
      getPortfolioContent(),
      getAdminBootstrapData(),
    ]);
    expect(publicContent.siteIntro).toEqual(adminContent.siteIntro);
    expect(publicContent.siteIntro).toMatchObject({
      cta_label: "View projects",
      cta_href: "/work",
      work_link_label: "Get in touch",
      work_link_href: "/contact",
    });
    expect(state.intro.work_link_href).toBe("#projects");
  });
  it("keeps custom values intact through both read paths", async () => {
    const custom = {
      ...defaultPortfolioContent.siteIntro,
      cta_label: "Featured work",
      cta_href: "#projects",
      work_link_label: "Discuss your idea",
      work_link_href: "mailto:hello@example.test",
    };
    state.intro = custom;
    const [publicContent, adminContent] = await Promise.all([
      getPortfolioContent(),
      getAdminBootstrapData(),
    ]);
    expect(publicContent.siteIntro).toEqual(custom);
    expect(adminContent.siteIntro).toEqual(custom);
  });
});


describe("journal publishing boundary", () => {
  it("keeps drafts and inactive categories out of discovery and direct article routes", async () => {
    state.posts = defaultPortfolioContent.blogPosts.map((post, index) => ({ ...post, is_published: index !== 1 }));
    state.categories = defaultPortfolioContent.blogCategories.map((category, index) => ({ ...category, is_active: index !== 1 }));
    const landing = await getBlogLandingContent();
    expect(landing.posts).toHaveLength(state.posts.length - 1);
    expect(landing.posts.map((post) => post.slug)).not.toContain(state.posts[1].slug);
    expect(landing.posts.every((post) => post.categories.every((category) => category.is_active))).toBe(true);
    expect(landing.categories).toHaveLength(state.categories.length - 1);
    expect(await getBlogPostBySlug(state.posts[1].slug)).toBeNull();
    state.posts = [];
    expect((await getBlogLandingContent()).featuredPost).toBeNull();
  });
});

 describe("content availability", () => {
  it("keeps empty published collections empty", async () => {
    state.posts = [];
    const content = await getPortfolioContent();
    expect(content.techGroups).toEqual([]);
    expect(content.blogPosts).toEqual([]);
  });
  it("does not substitute editable or public sample records after a database failure", async () => {
    state.failedTable = "blog_posts";
    await expect(getPortfolioContent()).rejects.toThrow("temporarily unavailable");
    await expect(getAdminBootstrapData()).rejects.toThrow("temporarily unavailable");
  });
});
