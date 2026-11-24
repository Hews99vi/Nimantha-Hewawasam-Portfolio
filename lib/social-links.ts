import type { SocialLink } from "@/types/content";

// Upgrade only the original social placeholder icons, leaving custom choices intact.
// This runs on reads, so existing databases need no rewrite or migration.
export function normalizeSocialLinks(links: SocialLink[]): SocialLink[] {
  return links.map((link) => {
    if (link.label === "LinkedIn" && link.icon_key === "briefcaseBusiness") {
      return { ...link, icon_key: "linkedin" };
    }
    if (link.label === "GitHub" && link.icon_key === "code2") {
      return { ...link, icon_key: "github" };
    }
    return link;
  });
}
