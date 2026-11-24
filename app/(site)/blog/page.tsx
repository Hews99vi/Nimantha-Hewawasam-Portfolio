import type { Metadata } from "next";
import Link from "next/link";
import { JournalSearch } from "@/components/blog/JournalSearch";
import { getBlogLandingContent } from "@/lib/content";
import { blogHref, filterArticles } from "@/lib/blog";
import { JournalCard } from "@/components/blog/JournalCard";
export const metadata: Metadata = {
  title: "Blog | Nimantha Hewawasam",
  description: "Notes on software development, interfaces, and building useful products.",
};
type Query = { q?: string | string[]; topic?: string | string[] };
const first = (value?: string | string[]) => (Array.isArray(value) ? value[0] : value) ?? "";
export default async function BlogPage({ searchParams }: { searchParams: Promise<Query> }) {
  const [{ settings, categories, featuredPost, posts }, params] = await Promise.all([getBlogLandingContent(), searchParams]);
  const query = first(params.q).trim().slice(0, 120);
  const topic = first(params.topic).slice(0, 120);
  const browsing = Boolean(query || topic);
  const matches = filterArticles(posts, query, topic);
  const archive = browsing ? matches : posts.filter((post) => post.id !== featuredPost?.id);
  const count = browsing ? matches.length : posts.length;
  const selected = categories.find((category) => category.slug === topic);
  return (
    <main id="content" className="journal-page container-shell">
      <header className="journal-opening">
        <div><h1>{settings.eyebrow || "Writing & notes"}<span className="accent">.</span></h1><p>{settings.title}</p></div>
        <details className="journal-about"><summary>About this journal</summary><p>{settings.intro}</p></details>
      </header>
      {!browsing && featuredPost && <section className="journal-feature-section" aria-label={settings.featured_title}>
        <JournalCard post={featuredPost} featured />
        <p className="journal-feature-note">{settings.featured_intro}</p>
      </section>}
      <section id="articles" className="journal-archive" aria-labelledby="journal-archive-title">
        <div className="journal-archive-heading"><h2 id="journal-archive-title">{browsing ? "Find your next read." : "Explore the journal."}</h2><span>{count} {count === 1 ? "article" : "articles"}</span></div>
        <div className="journal-tools">
          <nav className="journal-topics" aria-label="Filter by topic">
            <Link href={blogHref(query)} aria-current={!topic ? "page" : undefined}>All topics</Link>
            {categories.map((category) => <Link key={category.id} href={blogHref(query, category.slug)} aria-current={topic === category.slug ? "page" : undefined}>{category.name}</Link>)}
          </nav>
          <JournalSearch key={`${topic}:${query}`} query={query} topic={topic} />
        </div>
        {browsing && <div className="journal-results"><p>{topic && !selected ? "This topic is unavailable." : `${matches.length} ${matches.length === 1 ? "article" : "articles"}${selected ? ` in ${selected.name}` : ""}${query ? ` matching “${query}”` : ""}.`}</p><Link href="/blog#articles" className="text-action">Clear filters</Link></div>}
        {archive.length ? <div className="journal-grid">{archive.map((post) => <JournalCard key={post.id} post={post} />)}</div> : <div className="journal-empty"><h3>{browsing ? "No articles found." : posts.length ? "More writing is on the way." : "The journal is taking shape."}</h3><p>{browsing ? "Try a different search or browse all topics." : "Published articles will appear here."}</p>{browsing && <Link href="/blog#articles" className="text-action">Browse all articles</Link>}</div>}
      </section>
    </main>
  );
}
