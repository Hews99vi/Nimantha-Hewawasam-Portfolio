import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import type { TestimonialItem } from "@/types/content";
const review: TestimonialItem = {
  id: "review",
  quote: "A genuine quotation remains exactly as supplied.",
  name: "Sample Customer",
  role: "Role and company",
  sort_order: 1,
  is_active: true,
};
const render = (items: TestimonialItem[]) =>
  renderToStaticMarkup(createElement(TestimonialsSection, { items }));

describe("public testimonial cards", () => {
  it("does not render an empty section or disclose unpublished feedback", () => {
    expect(render([])).toBe("");
    expect(render([{ ...review, is_active: false }])).toBe("");
    const markup = render([
      review,
      {
        ...review,
        id: "private",
        name: "Unpublished customer",
        quote: "Unpublished quotation",
        is_active: false,
      },
    ]);
    expect(markup).toContain(review.quote);
    expect(markup).not.toContain("Unpublished customer");
    expect(markup).not.toContain("Unpublished quotation");
  });
  it("preserves supplied quotations and attribution in admin order", () => {
    const markup = render([
      { ...review, id: "later", sort_order: 2, name: "Second customer" },
      review,
    ]);
    expect(markup.indexOf("Sample Customer")).toBeLessThan(
      markup.indexOf("Second customer"),
    );
    expect(markup).toContain(
      "<blockquote><p>A genuine quotation remains exactly as supplied.</p></blockquote>",
    );
    expect(markup).toContain("Role and company");
  });
  it("escapes user content and uses text identities without fetching customer images", () => {
    const markup = render([
      { ...review, name: "A", quote: '<script>alert("test")</script>' },
    ]);
    expect(markup).not.toContain("<script>");
    expect(markup).toContain("&lt;script&gt;");
    expect(markup).not.toContain("<img");
    expect(markup).not.toContain("undefined");
  });
});
