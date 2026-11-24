import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ArticleVisual } from "@/components/blog/ArticleVisual";
import { describe, expect, it } from "vitest";
import { blogDate, blogHref, filterArticles, relatedArticles } from "@/lib/blog";
import { prepareArticle } from "@/lib/article-markdown";
import { defaultPortfolioContent } from "@/lib/content-defaults";
const posts = defaultPortfolioContent.blogPosts.map((post) => ({ ...post, categories: defaultPortfolioContent.blogCategories.filter((category) => post.category_ids.includes(category.id)) }));
describe("journal discovery", () => {
  it("combines topic and case-insensitive search words without changing saved order", () => {
    expect(filterArticles(posts, "CLIENT dashboard", "development").map((post) => post.id)).toEqual([posts[0].id]);
    expect(filterArticles(posts, "portfolio", "cms-systems")).toEqual([]);
    expect(filterArticles(posts, "", "missing")).toEqual([]);
    expect(filterArticles(posts, "", "")).toEqual(posts);
  });
  it("encodes shareable filters and handles missing or invalid dates", () => {
    expect(blogHref("UI & UX", "ui-ux")).toBe("/blog?q=UI+%26+UX&topic=ui-ux#articles");
    expect(blogDate(null)).toBeNull();
    expect(blogDate("invalid")).toBeNull();
    expect(blogDate("2026-06-10T00:00:00Z")).toBe("Jun 10, 2026");
  });
  it("excludes the current article and prioritizes shared topics", () => {
    const related = relatedArticles(posts, posts[0]);
    expect(related).toHaveLength(2);
    expect(related[0].slug).toContain("cms-projects");
    expect(related.map((post) => post.id)).not.toContain(posts[0].id);
    expect(relatedArticles([posts[0]], posts[0])).toEqual([]);
  });
});
describe("article contents", () => {
  it("creates unique matching anchors and preserves inline formatting", () => {
    const result = prepareArticle("## Code & data\n\nText.\n\n### **Code** & data\n\n## Code & data\n\n```md\n## not a heading\n```");
    expect(result.headings.map((heading) => heading.id)).toEqual(["section-code-data", "section-code-data-2", "section-code-data-3"]);
    expect(result.headings[1].text).toBe("Code & data");
    for (const heading of result.headings) expect(result.html).toContain(`id="${heading.id}"`);
    expect(result.html).toContain("<strong>Code</strong>");
    expect(result.headings).toHaveLength(3);
  });
  it("supports Unicode headings and resets IDs between renders", () => {
    const source = "## සිංහල\n\n## සිංහල";
    const first = prepareArticle(source);
    expect(first.headings[0].id).not.toBe("section-heading");
    expect(first.headings[1].id).not.toBe(first.headings[0].id);
    expect(prepareArticle(source)).toEqual(first);
    expect(prepareArticle("A paragraph without headings.").headings).toEqual([]);
  });
});

describe("editorial cover compatibility", () => {
  it("preserves uploaded cover URLs and uses geometry for missing or shipped portrait covers", () => {
    const cover = "https://example.test/editorial-cover.jpg";
    expect(renderToStaticMarkup(createElement(ArticleVisual, { cover, topic: "ui-ux" }))).toContain(`src="${cover}"`);
    for (const value of [null, "/images/nimantha-hero.png"]) {
      const markup = renderToStaticMarkup(createElement(ArticleVisual, { cover: value, topic: "cms-systems" }));
      expect(markup).toContain("<svg");
      expect(markup).not.toContain("<img");
    }
  });
});
