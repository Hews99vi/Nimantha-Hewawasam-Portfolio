import { describe, expect, it, vi } from "vitest";
import type { SiteIntro, SocialLink } from "@/types/content";
const state = vi.hoisted(() => ({
  intro: null as SiteIntro | null,
  socialLinks: [] as SocialLink[],
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
            ? state.intro
            : table === "social_links"
              ? state.socialLinks
              : singleton
                ? null
                : [],
        error: null,
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
import { getPortfolioContent, getAdminBootstrapData } from "@/lib/content";
import { defaultPortfolioContent } from "@/lib/content-defaults";

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
