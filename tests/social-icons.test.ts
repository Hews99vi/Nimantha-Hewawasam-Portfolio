import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { IconSelect } from "@/app/admin/IconSelect";
import { iconMap } from "@/lib/icons";
import { normalizeSocialLinks } from "@/lib/social-links";
import { socialLinkSchema } from "@/lib/admin/schemas";
import type { SocialLink } from "@/types/content";

const linkedin: SocialLink = {
  id: "linkedin-test",
  label: "LinkedIn",
  href: "https://www.linkedin.com/in/example",
  icon_key: "briefcaseBusiness",
  sort_order: 2,
  is_active: true,
};

describe("social brand icons", () => {
  it("upgrades only shipped social icons without changing URLs or stored objects", () => {
    const github: SocialLink = {
      ...linkedin,
      id: "github-test",
      label: "GitHub",
      icon_key: "code2",
      href: "https://github.com/example",
    };
    const normalized = normalizeSocialLinks([linkedin, github]);
    expect(normalized).toEqual([
      { ...linkedin, icon_key: "linkedin" },
      { ...github, icon_key: "github" },
    ]);
    expect(linkedin.icon_key).toBe("briefcaseBusiness");
    expect(github.icon_key).toBe("code2");
    expect(normalizeSocialLinks(normalized)).toEqual(normalized);
  });

  it("preserves customized icon selections and generic business icons", () => {
    const custom: SocialLink = { ...linkedin, icon_key: "camera" };
    const other: SocialLink = { ...linkedin, label: "Company profile" };
    expect(normalizeSocialLinks([custom, other])).toEqual([custom, other]);
    expect(iconMap.briefcaseBusiness).not.toBe(iconMap.linkedin);
    expect(iconMap.code2).not.toBe(iconMap.github);
  });

  it("accepts both brand keys through protected collection validation", () => {
    for (const key of ["linkedin", "github"])
      expect(
        socialLinkSchema.safeParse({ ...linkedin, icon_key: key }).success,
      ).toBe(true);
    expect(
      socialLinkSchema.safeParse({ ...linkedin, icon_key: "unknown-brand" })
        .success,
    ).toBe(false);
  });

  it("exposes named brand options and SVG previews in the existing editor", () => {
    for (const key of ["linkedin", "github"] as const) {
      const markup = renderToStaticMarkup(
        createElement(IconSelect, {
          label: "Icon",
          value: key,
          onChange: () => {},
        }),
      );
      expect(markup).toContain(`value="${key}" selected=""`);
      expect(markup).toContain(
        key === "linkedin" ? ">LinkedIn</option>" : ">GitHub</option>",
      );
      expect(markup).toContain('fill="currentColor"');
      expect(markup).toContain('aria-hidden="true"');
      expect(markup).toContain('focusable="false"');
      expect(markup).not.toContain("lucide-briefcase");
    }
  });
});
