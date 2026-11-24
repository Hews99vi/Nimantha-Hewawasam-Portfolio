import Link from "next/link";
import type { BlogPostWithCategories } from "@/types/content";
import { articleTopic, blogDate, blogHref } from "@/lib/blog";
import { ArticleVisual } from "./ArticleVisual";

export function JournalCard({ post, featured = false }: { post: BlogPostWithCategories; featured?: boolean }) {
  const date = blogDate(post.published_at);
  return (
    <article className={`journal-card ${featured ? "journal-feature" : ""}`}>
      <Link href={`/blog/${post.slug}`} className="journal-image-link" tabIndex={-1} aria-hidden="true">
        <ArticleVisual cover={post.cover_image} topic={articleTopic(post)} priority={featured} />
      </Link>
      <div className="journal-card-copy">
        <h2><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2>
        <div className="journal-meta">
          {date && <time dateTime={post.published_at ?? undefined}>{date}</time>}
          {post.reading_time && <span>{post.reading_time}</span>}
          {featured && <span className="journal-feature-label">Featured</span>}
        </div>
        <p>{post.excerpt}</p>
        <div className="journal-card-topics" aria-label="Article topics">
          {post.categories.map((category) => <Link key={category.id} href={blogHref("", category.slug)}>{category.name}</Link>)}
        </div>
        <Link className="text-action" href={`/blog/${post.slug}`}>Read article<span className="sr-only">: {post.title}</span></Link>
      </div>
    </article>
  );
}
