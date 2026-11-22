import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getPortfolioContent } from "@/lib/content";
import { publicProjects } from "@/lib/projects";
import { imageUrl } from "@/lib/project-media";
import { ProjectGallery } from "@/components/ProjectGallery";
import { ContactInvitation } from "@/components/ContactInvitation";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = publicProjects((await getPortfolioContent()).projects).find(
    (p) => p.slug === slug,
  );
  if (!project) return { title: "Project not found" };
  const cover = project.images[0];
  return {
    title: `${project.title} | Nimantha Hewawasam`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images:
        cover && imageUrl(cover.storage_path)
          ? [
              {
                url: imageUrl(cover.storage_path),
                width: cover.width,
                height: cover.height,
                alt: cover.alt,
              },
            ]
          : [],
    },
  };
}
export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const projects = publicProjects((await getPortfolioContent()).projects);
  const index = projects.findIndex((p) => p.slug === slug);
  const project = projects[index];
  if (!project) notFound();
  const previous = index > 0 ? projects[index - 1] : null;
  const next = index < projects.length - 1 ? projects[index + 1] : null;
  return (
    <main id="content">
      <div className="container-shell">
        <section className="page-intro project-intro">
          <Link href="/work" className="text-action">
            <ArrowLeft size={16} /> All work
          </Link>
          <p className="project-category">{project.category}</p>
          <h1>{project.title}</h1>
          <p>{project.description}</p>
        </section>
        <ProjectGallery images={project.images} title={project.title}>
          <section className="project-context">
            <div>
              <h2>The project.</h2>
              <p className="lead">{project.problem}</p>
            </div>
            <dl>
              <div>
                <dt>My role</dt>
                <dd>{project.role}</dd>
              </div>
              <div>
                <dt>Built with</dt>
                <dd className="tech-inline">
                  {project.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </dd>
              </div>
            </dl>
          </section>
        </ProjectGallery>
        <nav className="project-pagination" aria-label="Other projects">
          {previous ? (
            <Link href={`/work/${previous.slug}`}>
              <span>Previous project</span>
              {previous.title}
              <ArrowLeft size={20} />
            </Link>
          ) : (
            <Link href="/work">
              <span>Explore</span>All work
              <ArrowLeft size={20} />
            </Link>
          )}
          {next && (
            <Link href={`/work/${next.slug}`}>
              <span>Next project</span>
              {next.title}
              <ArrowUpRight size={20} />
            </Link>
          )}
        </nav>
      </div>
      <ContactInvitation />
    </main>
  );
}
