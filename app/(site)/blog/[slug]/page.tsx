import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getBlogLandingContent, getBlogPostBySlug } from "@/lib/content";
import { prepareArticle } from "@/lib/article-markdown";
import { articleTopic, blogDate, blogHref, relatedArticles } from "@/lib/blog";
import { ArticleVisual } from "@/components/blog/ArticleVisual";
import { JournalCard } from "@/components/blog/JournalCard";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getBlogPostBySlug((await params).slug);
  return post ? { title: `${post.seo_title ?? post.title} | Nimantha Hewawasam`, description: post.seo_description ?? post.excerpt } : { title: "Article not found" };
}
export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const { posts } = await getBlogLandingContent();
  const post = posts.find((item) => item.slug === slug);
  if (!post) notFound();
  const date = blogDate(post.published_at, true);
  const { html, headings } = prepareArticle(post.content_markdown);
  const related = relatedArticles(posts, post);
  return (
    <main id="content" className="reader-page container-shell">
      <ReadingProgress />
      <Link href="/blog" className="text-action reader-back"><ArrowLeft size={16} aria-hidden="true" /> All writing</Link>
      <header className="reader-opening">
        <div><h1>{post.title}</h1><p>{post.excerpt}</p><div className="journal-meta"><span>By {post.author_name}</span>{date && <time dateTime={post.published_at ?? undefined}>{date}</time>}{post.reading_time && <span>{post.reading_time}</span>}</div><div className="journal-card-topics">{post.categories.map((category) => <Link key={category.id} href={blogHref("", category.slug)}>{category.name}</Link>)}</div></div>
        <ArticleVisual cover={post.cover_image} topic={articleTopic(post)} priority />
      </header>
      <div className={`reader-layout ${headings.length ? "" : "reader-without-contents"}`}>
        {headings.length > 0 && <aside className="reader-sidebar"><details open><summary>On this page</summary><nav aria-label="Article contents"><ol>{headings.map((heading) => <li key={heading.id} className={heading.depth === 3 ? "reader-subheading" : ""}><a href={`#${heading.id}`}>{heading.text}</a></li>)}</ol></nav></details></aside>}
        <div className="reader-copy-column"><article id="article-copy" className="blog-prose" dangerouslySetInnerHTML={{ __html: html }} /><footer className="reader-end"><p>Written by <strong>{post.author_name}</strong></p><Link href="/blog" className="text-action">Back to the journal</Link></footer></div>
      </div>
      {related.length > 0 && <section className="reader-related" aria-labelledby="reader-related-title"><div className="journal-archive-heading"><h2 id="reader-related-title">Keep reading.</h2><Link className="text-action" href="/blog">All articles</Link></div><div className="journal-grid">{related.map((item) => <JournalCard key={item.id} post={item} />)}</div></section>}
    </main>
  );
}
