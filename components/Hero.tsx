import { LocalImage } from "@/components/LocalImage";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import type { SiteIntro, SocialLink } from "@/types/content";
import { iconMap } from "@/lib/icons";
export function Hero({
  intro,
  socialLinks,
}: {
  intro: SiteIntro;
  socialLinks: SocialLink[];
}) {
  return (
    <section className="hero-surround" id="home">
      <div className="hero-frame">
        <SiteHeader embedded />
        <div className="hero-name">
          <h1>
            {intro.headline_line_1}
            <span>{intro.headline_line_2}</span>
          </h1>
          <div className="hero-rule" />
          <div className="hero-socials">
            {socialLinks
              .filter((link) => link.is_active && link.href !== "#")
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((link) => {
                const Icon = iconMap[link.icon_key];
                return (
                  <a key={link.id} href={link.href} aria-label={link.label}>
                    <Icon size={22} />
                  </a>
                );
              })}
          </div>
        </div>
        <LocalImage
          image="hero"
          className="hero-portrait"
          alt="Nimantha Hewawasam"
          sizes="(max-width: 560px) 441px, (max-width: 800px) 521px, (max-width: 1100px) 641px, 1100px"
          priority
        />
        <div className="hero-intro">
          <h2>{intro.intro_heading}</h2>
          <p>{intro.intro_body}</p>
          <div className="hero-actions">
            <Link href={intro.cta_href} className="button hero-action">
              {intro.cta_label}
            </Link>
            <Link
              href={intro.work_link_href}
              className="button hero-action hero-action-secondary"
            >
              {intro.work_link_label}
            </Link>
          </div>
        </div>
        <span className="hero-bottom-note">Web · Mobile · AI</span>
      </div>
    </section>
  );
}
