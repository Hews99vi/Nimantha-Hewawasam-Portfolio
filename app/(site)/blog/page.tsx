import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getBlogLandingContent } from "@/lib/content";
export const metadata: Metadata = {
  title: "Blog | Nimantha Hewawasam",
  description:
    "Notes on software development, interfaces, and building useful products.",
};
function formatDate(value: string | null) {
  return value
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(value))
    : "Undated";
}
export default async function BlogPage() {
  const { settings, featuredPost, posts } = await getBlogLandingContent();
  const ordered = featuredPost
    ? [featuredPost, ...posts.filter((p) => p.id !== featuredPost.id)]
    : posts;
  return (
    <main id="content">
      <section className="page-intro container-shell">
        <h1>{settings.title}</h1>
        <p>{settings.intro}</p>
      </section>
      <section className="container-shell section-bottom" aria-label="Articles">
        {ordered.length ? (
          <div className="blog-list">
            {ordered.map((post) => (
              <article key={post.id} className="article-card">
                {post.cover_image ? (
                  <Link
                    className="article-cover"
                    href={`/blog/${post.slug}`}
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    {/* Existing blog assets can come from separately hosted URLs. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={post.cover_image} alt="" loading="lazy" />
                  </Link>
                ) : (
                  <div className="article-text-cover">
                    {post.categories.map((c) => c.name).join(" / ") ||
                      "Writing & notes"}
                  </div>
                )}
                <div>
                  <div className="article-meta">
                    <span>{formatDate(post.published_at)}</span>
                    <span>{post.reading_time}</span>
                  </div>
                  <h2>
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p>{post.excerpt}</p>
                  <Link className="text-action" href={`/blog/${post.slug}`}>
                    Read article <ArrowUpRight size={17} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p>
            No articles have been published yet. Check back for new writing.
          </p>
        )}
      </section>
    </main>
  );
}
