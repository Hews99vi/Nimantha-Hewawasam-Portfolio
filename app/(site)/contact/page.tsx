import type { Metadata } from "next";
import { getPortfolioContent } from "@/lib/content";
import { InteriorMotion } from "@/components/interior/InteriorMotion";
import { ContactSignal } from "@/components/interior/ContactSignal";
import { iconMap } from "@/lib/icons";
export const metadata: Metadata = {
  title: "Contact | Nimantha Hewawasam",
  description:
    "Get in touch with Nimantha Hewawasam about a project or opportunity.",
};
export default async function ContactPage() {
  const c = await getPortfolioContent();
  const contact = c.contactSection;
  const social = c.socialLinks
    .filter(
      (link) =>
        link.is_active && link.href !== "#" && !link.href.startsWith("mailto:"),
    )
    .sort((a, b) => a.sort_order - b.sort_order);
  return (
    <main id="content" className="contact-page container-shell">
      <InteriorMotion>
        <div className="contact-layout">
          <section className="contact-introduction" data-reveal>
            <h1>{contact.title}</h1>
            <p>{contact.body}</p>
            <div className="contact-facts">
              <dl>
                <div>
                  <dt>Based in</dt>
                  <dd>{contact.location}</dd>
                </div>
                <div>
                  <dt>Availability</dt>
                  <dd>{contact.availability}</dd>
                </div>
              </dl>
            </div>
            {social.length > 0 && (
              <nav className="contact-socials" aria-label="Social profiles">
                {social.map((link) => {
                  const Icon = iconMap[link.icon_key];
                  return (
                    <a
                      key={link.id}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Icon size={22} aria-hidden="true" />
                      {link.label}
                    </a>
                  );
                })}
              </nav>
            )}
          </section>
          <ContactSignal email={contact.email} location={contact.location} />
        </div>
      </InteriorMotion>
    </main>
  );
}
