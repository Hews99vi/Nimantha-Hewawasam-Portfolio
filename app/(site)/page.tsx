import Link from "next/link";
import Image from "next/image";
import aboutPortrait from "@/public/images/nimantha-about.png";
import { Hero } from "@/components/Hero";
import { ProjectCard } from "@/components/ProjectCard";
import { ContactInvitation } from "@/components/ContactInvitation";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { getPortfolioContent } from "@/lib/content";
import { publicProjects } from "@/lib/projects";
import { normalizePublicAssetPath } from "@/lib/asset-path";

export default async function Home() {
  const content = await getPortfolioContent();
  const projects = publicProjects(content.projects).slice(0, 3);
  const brands = content.trustedBrands
    .filter((b) => b.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);
  return (
    <main id="content">
      <Hero intro={content.siteIntro} socialLinks={content.socialLinks} />
      <section id="projects" className="section-space container-shell">
        <div className="section-heading">
          <h2>
            Selected work<span className="accent">.</span>
          </h2>
          <Link className="text-action" href="/work">
            All projects
          </Link>
        </div>
        {projects.length ? (
          <div className="project-grid">
            {projects.map((p, i) => (
              <ProjectCard key={p.id} project={p} featured={i === 0} />
            ))}
          </div>
        ) : (
          <p>New work will appear here as projects are published.</p>
        )}
      </section>
      <section
        id="about"
        className="home-about home-about-teaser"
        aria-labelledby="home-about-title"
      >
        <div className="container-shell home-about-layout">
          <h2 id="home-about-title">
            A person behind
            <br />
            the pixels.
          </h2>
          <figure className="home-about-portrait">
            <Image
              src={aboutPortrait}
              alt="Nimantha Hewawasam, seated in a monochrome portrait"
              sizes="(max-width: 640px) 128px, (max-width: 960px) 35vw, 360px"
              quality={95}
            />
          </figure>
          <div className="home-about-copy">
            <p className="lead">{content.aboutSection.intro}</p>
            <p>{content.aboutSection.body}</p>
            <div className="home-about-footer">
              <Link className="text-action" href="/about">
                More about me
              </Link>
              {content.contactSection.location && (
                <span>{content.contactSection.location}</span>
              )}
            </div>
          </div>
        </div>
      </section>
      <section id="services" className="section-space container-shell">
        <div className="section-heading">
          <h2>What I can help with.</h2>
          <Link className="text-action" href="/services">
            Explore services
          </Link>
        </div>
        <div className="service-summary">
          {content.services
            .filter((s) => s.is_active)
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((service) => (
              <Link key={service.id} href={`/services#service-${service.id}`}>
                <h3>{service.title}</h3>
              </Link>
            ))}
        </div>
      </section>
      {brands.length > 0 && (
        <section className="brand-section section-space">
          <div className="container-shell">
            <h2 className="small-heading">
              Companies and teams I’ve worked with.
            </h2>
            <div className="brand-grid">
              {brands.map((brand) => {
                const src = normalizePublicAssetPath(brand.logo_src);
                const local: Record<string, string> = {
                  "Playstation.lk": "Playstationlklogon.png",
                  "Serenity Wedding Films (Pvt) Ltd": "serenitylogo copy.png",
                  "Priyadarshana Dristributors (Pvt) Ltd": "priya.png",
                  "Athukorala Group (Pvt) Ltd": "athukorala.png",
                  "Nextgen code (Pvt) Ltd": "nextgen.png",
                  "DN Tours Ahungalla": "dntours.png",
                };
                const logo =
                  src ||
                  (local[brand.name]
                    ? `/images/brandslogo/${local[brand.name]}`
                    : null);
                const inner = logo ? (
                  <Image
                    unoptimized
                    width={200}
                    height={80}
                    src={logo}
                    alt={brand.name}
                    loading="lazy"
                  />
                ) : (
                  <span>{brand.name}</span>
                );
                return brand.url && brand.url !== "#" ? (
                  <a
                    key={brand.id}
                    href={brand.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {inner}
                  </a>
                ) : (
                  <div key={brand.id}>{inner}</div>
                );
              })}
            </div>
          </div>
        </section>
      )}
      <TestimonialsSection items={content.testimonials} />
      <ContactInvitation />
    </main>
  );
}
