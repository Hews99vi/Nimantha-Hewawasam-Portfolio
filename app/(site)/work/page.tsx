import type { Metadata } from "next";
import { getPortfolioContent } from "@/lib/content";
import { publicProjects } from "@/lib/projects";
import { ProjectCard } from "@/components/ProjectCard";
import { ContactInvitation } from "@/components/ContactInvitation";
export const metadata: Metadata = {
  title: "Work | Nimantha Hewawasam",
  description:
    "A selection of web applications, CMS platforms, business systems, and AI projects by Nimantha Hewawasam.",
};
export default async function WorkPage() {
  const projects = publicProjects((await getPortfolioContent()).projects);
  return (
    <main id="content">
      <section className="page-intro container-shell">
        <h1>
          Work, in practice<span className="accent">.</span>
        </h1>
        <p>
          Applications, websites, and systems. Explore the projects, the
          problems behind them, and my part in building them.
        </p>
      </section>
      <section aria-label="Projects" className="container-shell section-bottom">
        {projects.length ? (
          <div className="project-grid">
            {projects.map((project, index) => (
              <ProjectCard
                project={project}
                key={project.id}
                featured={index === 0}
              />
            ))}
          </div>
        ) : (
          <p>No projects have been published yet.</p>
        )}
      </section>
      <ContactInvitation />
    </main>
  );
}
