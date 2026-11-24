import type { Metadata } from "next";
import Link from "next/link";
import { LocalImage } from "@/components/LocalImage";
import { getPortfolioContent } from "@/lib/content";
import { ContactInvitation } from "@/components/ContactInvitation";
import { InteriorMotion } from "@/components/interior/InteriorMotion";
import { SkillsExplorer } from "@/components/interior/SkillsExplorer";
import { MediaImage } from "@/components/MediaImage";
import { publicProjects } from "@/lib/projects";
import { imageUrl } from "@/lib/project-media";
import { iconMap } from "@/lib/icons";
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
  const work = publicProjects(c.projects)
    .filter(
      (project) =>
        project.images.length && imageUrl(project.images[0].storage_path),
    )
    .slice(0, 2);
  return (
    <main id="content" className="about-page">
      <InteriorMotion>
        <section
          className="about-opening container-shell"
          aria-labelledby="about-title"
          data-reveal
        >
          <h1 id="about-title">
            A little about me<span className="accent">.</span>
          </h1>
          <figure className="about-portrait">
            <LocalImage
              image="about"
              alt="Portrait of Nimantha Hewawasam"
              sizes="(max-width: 480px) calc(100vw - 40px), (max-width: 700px) 420px, (max-width: 1260px) 40vw, 468px"
              priority
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
          data-reveal
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
        {work.length > 0 && (
          <section
            className="about-work container-shell section-bottom"
            aria-labelledby="about-work-title"
            data-reveal
          >
            <div className="section-heading">
              <h2 id="about-work-title">A little of what I build.</h2>
              <Link className="text-action" href="/work">
                All projects
              </Link>
            </div>
            <div className="about-work-grid">
              {work.map((project) => {
                const cover = project.images[0];
                return (
                  <Link
                    className="about-work-item"
                    key={project.id}
                    href={`/work/${project.slug}`}
                  >
                    <div className="about-work-image">
                      <MediaImage
                        src={imageUrl(cover.storage_path)}
                        alt=""
                        width={cover.width}
                        height={cover.height}
                        sizes="(max-width: 640px) calc(100vw - 40px), (max-width: 1260px) 45vw, 572px"
                        retryable={false}
                      />
                    </div>
                    <p>{project.category}</p>
                    <h3>{project.title}</h3>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
        {skills.length > 0 && (
          <section
            className="about-tools section-space"
            aria-labelledby="about-tools-title"
          >
            <div className="container-shell" data-reveal>
              <div className="section-heading">
                <h2 id="about-tools-title">Tools I work with.</h2>
                <p>Choose a discipline to explore the toolkit.</p>
              </div>
              <SkillsExplorer groups={skills} />
            </div>
          </section>
        )}
        {principles.length > 0 && (
          <section
            className="about-principles section-space"
            aria-labelledby="about-principles-title"
          >
            <div className="container-shell" data-reveal>
              <h2 id="about-principles-title">How I approach the work.</h2>
              <div className="principle-list">
                {principles.map((item) => {
                  const Icon = iconMap[item.icon_key];
                  return (
                    <article key={item.id}>
                      <div className="principle-title">
                        <Icon size={26} aria-hidden="true" />
                        <h3>{item.title}</h3>
                      </div>
                      <p>{item.description}</p>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        )}
        <ContactInvitation />
      </InteriorMotion>
    </main>
  );
}
