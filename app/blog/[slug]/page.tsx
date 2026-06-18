import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getBlogPostBySlug } from "@/lib/content";
import { renderMarkdown } from "@/lib/markdown";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

function formatDate(value: string | null) {
  if (!value) {
    return "Draft";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Article Not Found | Nimantha Hewawasam",
    };
  }

  return {
    title: `${post.seo_title ?? post.title} | Nimantha Hewawasam`,
    description: post.seo_description ?? post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const html = renderMarkdown(post.content_markdown);

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#071426]">
      <section className="border-b border-[#102A4C]/10 bg-[#EEF4FA] px-4 py-6 sm:px-8 sm:py-8 lg:px-12">
        <div className="mx-auto max-w-[920px]">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#102A4C] transition hover:text-[#0057D9]"
          >
            <ArrowLeft size={16} />
            Back to Blog
          </Link>

          <div className="mt-9 sm:mt-12">
            <div className="flex flex-wrap gap-2">
              {post.categories.map((category) => (
                <span
                  key={category.id}
                  className="rounded-full bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#0057D9]"
                >
                  {category.name}
                </span>
              ))}
            </div>
            <h1 className="mt-6 text-balance text-[2.35rem] font-extrabold leading-[1.08] sm:text-5xl lg:text-6xl lg:leading-tight">
              {post.title}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#52657C] sm:mt-6 sm:text-xl sm:leading-9">{post.excerpt}</p>
            <div className="mt-7 flex flex-wrap items-center gap-4 text-sm font-semibold text-[#6E7F95]">
              <span>{post.author_name}</span>
              <span className="h-1 w-1 rounded-full bg-[#6E7F95]" />
              <span>{formatDate(post.published_at)}</span>
              <span className="h-1 w-1 rounded-full bg-[#6E7F95]" />
              <span>{post.reading_time}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-8 sm:py-12 lg:px-12">
        <div className="mx-auto max-w-[920px]">
          {post.cover_image ? (
            <div className="mb-10 overflow-hidden rounded-[28px] border border-[#102A4C]/10 bg-[#DCE7F3] shadow-[0_18px_48px_rgba(7,20,38,0.05)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.cover_image}
                alt={post.title}
                className="h-[230px] w-full object-cover object-center sm:h-[320px]"
              />
            </div>
          ) : null}

          <article
            className="blog-prose border border-[#102A4C]/10 bg-white p-5 shadow-[0_18px_48px_rgba(7,20,38,0.05)] sm:p-10"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </section>
    </main>
  );
}
