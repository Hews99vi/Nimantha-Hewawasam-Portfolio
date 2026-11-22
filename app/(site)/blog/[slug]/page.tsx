import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getBlogPostBySlug } from "@/lib/content";
import { renderMarkdown } from "@/lib/markdown";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getBlogPostBySlug((await params).slug);
  return post
    ? {
        title: `${post.seo_title ?? post.title} | Nimantha Hewawasam`,
        description: post.seo_description ?? post.excerpt,
      }
    : { title: "Article not found" };
}
export default async function BlogPostPage({ params }: Props) {
  const post = await getBlogPostBySlug((await params).slug);
  if (!post) notFound();
  const date = post.published_at
    ? new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(new Date(post.published_at))
    : "";
  return (
    <main id="content">
      <header className="page-intro article-header container-shell">
        <Link href="/blog" className="text-action">
          <ArrowLeft size={16} /> All writing
        </Link>
        <h1>{post.title}</h1>
        <p>{post.excerpt}</p>
        <div className="article-meta">
          <span>{post.author_name}</span>
          {date && <span>{date}</span>}
          <span>{post.reading_time}</span>
          {post.categories.map((c) => (
            <span key={c.id}>{c.name}</span>
          ))}
        </div>
      </header>
      {post.cover_image && (
        <div className="container-shell article-cover">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.cover_image} alt={post.title} />
        </div>
      )}
      <div className="article-body">
        <article
          className="blog-prose"
          dangerouslySetInnerHTML={{
            __html: renderMarkdown(post.content_markdown),
          }}
        />
      </div>
    </main>
  );
}
