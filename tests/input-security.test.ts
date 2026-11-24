import { describe, expect, it } from "vitest";
import { prepareArticle } from "@/lib/article-markdown";
import { blogPostSchema, socialLinkSchema, siteIntroSchema, contactSectionSchema } from "@/lib/admin/schemas";
import { defaultPortfolioContent as defaults } from "@/lib/content-defaults";
import { validateEnvironment } from "@/lib/environment";

describe("stored article HTML", () => {
  it("removes executable HTML and dangerous URLs while preserving normal Markdown", () => {
    const { html, headings } = prepareArticle(`## Safe heading\n\n**Bold** [internal](/work) [email](mailto:hello@example.test)\n\n<img src="/images/a.png" onerror="window.auditMarker=1" style="position:fixed">\n<script>window.auditMarker=2</script><svg onload="window.auditMarker=3"></svg><iframe src="https://evil.test"></iframe>\n\n[unsafe](javascript:alert%281%29)\n\n\`\`\`js\nconst x = '<script>';\n\`\`\``);
    expect(html).not.toMatch(/onerror|onload|<script>|<svg|<iframe|style=|javascript:/i);
    expect(html).toContain('<strong>Bold</strong>');expect(html).toContain('href="/work"');expect(html).toContain('href="mailto:hello@example.test"');expect(html).toContain('class="language-js"');expect(html).toContain(`id="${headings[0].id}"`);
  });
});
describe("trusted request boundaries", () => {
  it("rejects malformed external links and preserves valid action destinations", () => {
    const social = { sort_order: 1, label: "LinkedIn", icon_key: "linkedin", is_active: true };
    for (const href of ["#www.linkedin.com/in/example", "javascript:alert(1)", "//example.test", "https://example.test\\evil"]) expect(socialLinkSchema.safeParse({ ...social, href }).success).toBe(false);
    expect(socialLinkSchema.safeParse({ ...social, href: "https://linkedin.com/in/example" }).success).toBe(true);
    for (const href of ["/work", "#projects", "mailto:hello@example.test"]) expect(siteIntroSchema.safeParse({ ...defaults.siteIntro, cta_href: href }).success).toBe(true);
    expect(contactSectionSchema.safeParse({ ...defaults.contactSection, email: "invalid" }).success).toBe(false);
  });
  it("requires an explicit timezone at the API boundary", () => {
    const post = { ...defaults.blogPosts[0], category_ids: ["11111111-1111-4111-8111-111111111111"] };
    expect(blogPostSchema.safeParse({ ...post, published_at: "2026-11-24T09:00" }).success).toBe(false);
    expect(blogPostSchema.parse({ ...post, published_at: "2026-11-24T09:00:00+05:30" }).published_at).toBe("2026-11-24T03:30:00.000Z");
  });
  it("fails configuration checks instead of publishing an empty canonical origin", () => {
    const env = { NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co", NEXT_PUBLIC_SUPABASE_ANON_KEY: "public-test-key", NEXT_PUBLIC_SITE_URL: "https://portfolio.example" };
    expect(validateEnvironment(env)).toMatchObject({ siteUrl: "https://portfolio.example" });
    expect(() => validateEnvironment({ ...env, NEXT_PUBLIC_SITE_URL: "localhost:3000" })).toThrow("NEXT_PUBLIC_SITE_URL");
    expect(() => validateEnvironment({ ...env, NEXT_PUBLIC_SUPABASE_ANON_KEY: "" })).toThrow();
  });
});
