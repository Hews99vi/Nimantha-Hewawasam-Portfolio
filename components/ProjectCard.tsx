import Link from "next/link";
import type { ProjectItem } from "@/types/content";
import { imageUrl } from "@/lib/project-media";
import { MediaImage } from "@/components/MediaImage";
import { projectTeaser } from "@/lib/project-teaser";
export function ProjectCard({
  project,
  featured = false,
  compact = false,
}: {
  project: ProjectItem;
  featured?: boolean;
  compact?: boolean;
}) {
  const cover = project.images[0];
  return (
    <article className={`project-card ${featured ? "project-featured" : ""} ${compact ? "project-compact" : ""}`}>
      {cover && imageUrl(cover.storage_path) ? (
        <Link
          href={`/work/${project.slug}`}
          className="project-cover"
          tabIndex={-1}
          aria-hidden="true"
        >
          <MediaImage
            retryable={false}
            src={imageUrl(cover.storage_path)}
            alt=""
            width={cover.width}
            height={cover.height}
            sizes={
              featured
                ? "(max-width: 800px) calc(100vw - 40px), (max-width: 1260px) calc(60vw - 75px), 681px"
                : "(max-width: 560px) calc(100vw - 40px), (max-width: 800px) calc(50vw - 32.5px), (max-width: 1260px) calc(50vw - 57.5px), 572.5px"
            }
          />
        </Link>
      ) : (
        <div className="project-text-preview">
          <span>{project.category}</span>
          <p>{project.problem}</p>
          <span>{project.tags.slice(0, 3).join(" / ")}</span>
        </div>
      )}
      <div className="project-caption">
        <div>
          <p className="project-category">{project.category}</p>
          <h3>
            <Link href={`/work/${project.slug}`}>{project.title}</Link>
          </h3>
          <p>{compact ? projectTeaser(project.description) : project.description}</p>
          {compact && project.tags.length > 0 && (
            <ul className="project-technologies" aria-label="Technologies">
              {project.tags.slice(0, 4).map((tag) => <li key={tag}>{tag}</li>)}
            </ul>
          )}
        </div>
        <Link href={`/work/${project.slug}`} className="text-action">
          Explore project
        </Link>
      </div>
    </article>
  );
}
