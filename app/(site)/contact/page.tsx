import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { getPortfolioContent } from "@/lib/content";
import { CopyEmail } from "@/components/CopyEmail";
export const metadata: Metadata = {
  title: "Contact | Nimantha Hewawasam",
  description:
    "Get in touch with Nimantha Hewawasam about a project or opportunity.",
};
export default async function ContactPage() {
  const c = await getPortfolioContent();
  const contact = c.contactSection;
  return (
    <main id="content" className="contact-page container-shell">
      <section className="page-intro">
        <h1>{contact.title}</h1>
        <p>{contact.body}</p>
      </section>
      <section className="contact-details">
        <div>
          <a className="email-address" href={`mailto:${contact.email}`}>
            {contact.email}
            <ArrowUpRight aria-hidden="true" />
          </a>
          <CopyEmail email={contact.email} />
        </div>
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
      </section>
      <nav className="contact-socials" aria-label="Social profiles">
        {c.socialLinks
          .filter(
            (s) =>
              s.is_active && s.href !== "#" && !s.href.startsWith("mailto:"),
          )
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((link) => (
            <a key={link.id} href={link.href} target="_blank" rel="noreferrer">
              {link.label}
              <ArrowUpRight size={18} />
            </a>
          ))}
      </nav>
    </main>
  );
}
