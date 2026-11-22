import { describe, expect, it } from "vitest";
import { defaultPortfolioContent } from "@/lib/content-defaults";
import { normalizeSiteIntroActions } from "@/lib/site-intro";

const legacy = {
  ...defaultPortfolioContent.siteIntro,
  cta_label: "View Projects",
  cta_href: "#projects",
  work_link_label: "My work",
  work_link_href: "#projects",
};

describe("hero action compatibility", () => {
  it("gives the shipped actions distinct work and contact destinations", () => {
    const result = normalizeSiteIntroActions(legacy);
    expect(result).toMatchObject({
      cta_label: "View projects",
      cta_href: "/work",
      work_link_label: "Get in touch",
      work_link_href: "/contact",
    });
    expect(legacy.work_link_href).toBe("#projects");
    expect(result.headline_line_1).toBe(legacy.headline_line_1);
  });

  it("does not change the result when normalized repeatedly", () => {
    const normalized = normalizeSiteIntroActions(legacy);
    expect(normalizeSiteIntroActions(normalized)).toEqual(normalized);
    expect(
      normalizeSiteIntroActions(defaultPortfolioContent.siteIntro),
    ).toEqual(defaultPortfolioContent.siteIntro);
  });

  it("preserves customized labels and destinations, including hash links", () => {
    const custom = {
      ...legacy,
      cta_label: "See featured projects",
      cta_href: "#projects",
      work_link_label: "Email me",
      work_link_href: "mailto:hello@example.test",
    };
    expect(normalizeSiteIntroActions(custom)).toEqual(custom);
    const customUrls = {
      ...legacy,
      cta_href: "/about",
      work_link_href: "/services",
    };
    expect(normalizeSiteIntroActions(customUrls)).toEqual(customUrls);
  });

  it("upgrades each legacy pair independently", () => {
    expect(
      normalizeSiteIntroActions({
        ...legacy,
        cta_label: "My selected projects",
      }),
    ).toMatchObject({
      cta_label: "My selected projects",
      cta_href: "#projects",
      work_link_label: "Get in touch",
      work_link_href: "/contact",
    });
    expect(
      normalizeSiteIntroActions({ ...legacy, work_link_href: "/contact" }),
    ).toMatchObject({
      cta_label: "View projects",
      cta_href: "/work",
      work_link_label: "My work",
      work_link_href: "/contact",
    });
  });
});
