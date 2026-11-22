import type { SiteIntro } from "@/types/content";

/** Upgrade the shipped action pairs without rewriting saved or custom content. */
export function normalizeSiteIntroActions(intro: SiteIntro): SiteIntro {
  const primaryIsLegacy =
    intro.cta_label === "View Projects" && intro.cta_href === "#projects";
  const secondaryIsLegacy =
    intro.work_link_label === "My work" && intro.work_link_href === "#projects";

  return {
    ...intro,
    ...(primaryIsLegacy
      ? { cta_label: "View projects", cta_href: "/work" }
      : {}),
    ...(secondaryIsLegacy
      ? { work_link_label: "Get in touch", work_link_href: "/contact" }
      : {}),
  };
}
