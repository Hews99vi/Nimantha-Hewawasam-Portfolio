import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import portrait from "@/public/images/nimantha-about.png";
import { getPortfolioContent } from "@/lib/content";
import { ContactInvitation } from "@/components/ContactInvitation";
export const metadata: Metadata = {
  title: "About | Nimantha Hewawasam",
  description:
    "Meet Nimantha Hewawasam, a software developer from Sri Lanka working across interfaces, APIs, databases, and deployment.",
};
export default async function AboutPage() {
  const c = await getPortfolioContent();
  const facts = c.aboutStats
    .filter((item) => item.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);
  const skills = c.techGroups
    .filter((item) => item.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);
  const principles = c.whyWorkItems
    .filter((item) => item.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);
  return (
    <main id="content">
      <section
        className="about-opening container-shell"
        aria-labelledby="about-title"
      >
        <h1 id="about-title">
          A little about me<span className="accent">.</span>
        </h1>
        <figure className="about-portrait">
          <Image
            src={portrait}
            alt="Portrait of Nimantha Hewawasam"
            sizes="(max-width: 480px) calc(100vw - 40px), (max-width: 700px) 420px, (max-width: 1260px) 40vw, 468px"
            quality={95}
            preload
          />
          <figcaption>
            <span>Nimantha Hewawasam</span>
            {c.contactSection.location && (
              <span>{c.contactSection.location}</span>
            )}
          </figcaption>
        </figure>
        <div className="about-introduction">
          <p className="lead">{c.aboutSection.intro}</p>
          <div className="about-actions">
            <Link className="text-action" href="/work">
              View my work
            </Link>
            <Link className="text-action" href="/contact">
              Get in touch
            </Link>
          </div>
        </div>
      </section>
      <section
        className="about-profile container-shell"
        aria-labelledby="about-profile-title"
      >
        <div className="about-profile-copy">
          <h2 id="about-profile-title">{c.aboutSection.title}</h2>
          <p>{c.aboutSection.body}</p>
        </div>
        {facts.length > 0 && (
          <ul className="about-facts" aria-label="At a glance">
            {facts.map((stat) => (
              <li key={stat.id}>{stat.label}</li>
            ))}
          </ul>
        )}
      </section>
      {skills.length > 0 && (
        <section
          className="about-tools section-space"
          aria-labelledby="about-tools-title"
        >
          <div className="container-shell about-tools-layout">
            <h2 id="about-tools-title">Tools I work with.</h2>
            <div className="skill-groups">
              {skills.map((group) => (
                <div key={group.id}>
                  <h3>{group.title}</h3>
                  <ul>
                    {[...group.items]
                      .sort((a, b) => a.sort_order - b.sort_order)
                      .map((item) => (
                        <li key={item.id}>{item.label}</li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      {principles.length > 0 && (
        <section
          className="about-principles section-space"
          aria-labelledby="about-principles-title"
        >
          <div className="container-shell">
            <h2 id="about-principles-title">How I approach the work.</h2>
            <div className="principle-list">
              {principles.map((item) => (
                <article key={item.id}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
      <ContactInvitation />
    </main>
  );
}
