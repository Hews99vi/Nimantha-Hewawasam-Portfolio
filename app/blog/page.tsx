import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getBlogLandingContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog | Nimantha Hewawasam",
  description:
    "Writing on product thinking, software development, CMS systems, interface design, and practical digital strategy.",
};

function formatDate(value: string | null) {
  if (!value) {
    return "Draft";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export default async function BlogPage() {
  const { settings, categories, featuredPost, posts } = await getBlogLandingContent();
  const supportingPosts = featuredPost
    ? posts.filter((post) => post.id !== featuredPost.id)
    : posts;

  return (
    <main className="min-h-screen bg-[#EEF4FA] text-[#071426]">
      <section className="border-b border-[#102A4C]/10 bg-[#E8EEF7] px-4 py-6 sm:px-8 sm:py-8 lg:px-12">
        <div className="mx-auto max-w-[1200px]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#102A4C] transition hover:text-[#0057D9]"
            >
              <ArrowLeft size={16} />
              Back to Portfolio
            </Link>
            <div className="flex flex-wrap gap-3 text-sm font-semibold text-[#52657C]">
              {categories.map((category) => (
                <span key={category.id} className="rounded-full border border-[#102A4C]/10 bg-white/80 px-3 py-2">
                  {category.name}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:mt-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-10">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[#0057D9]">
                {settings.eyebrow}
              </p>
              <h1 className="mt-5 max-w-3xl text-balance text-[2.35rem] font-extrabold leading-[1.08] sm:text-5xl lg:text-6xl lg:leading-tight">
                {settings.title}
              </h1>
            </div>
            <p className="max-w-2xl text-base leading-7 text-[#52657C] lg:text-lg lg:leading-8">{settings.intro}</p>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-8 sm:py-14 lg:px-12">
        <div className="mx-auto max-w-[1200px]">
          {featuredPost ? (
            <article className="grid overflow-hidden rounded-[28px] border border-[#102A4C]/10 bg-white shadow-[0_22px_60px_rgba(7,20,38,0.06)] lg:grid-cols-[1.05fr_0.95fr]">
              <div className="flex flex-col justify-between bg-[#071426] p-6 text-white sm:p-10">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[#82B9F1]">
                    {settings.featured_title}
                  </p>
                  <p className="mt-4 max-w-xl text-sm leading-7 text-white/65">
                    {settings.featured_intro}
                  </p>
                  <h2 className="mt-7 max-w-2xl text-balance text-[2rem] font-extrabold leading-tight sm:text-5xl">
                    {featuredPost.title}
                  </h2>
                  <p className="mt-5 max-w-2xl text-base leading-7 text-white/76 sm:text-lg sm:leading-8">
                    {featuredPost.excerpt}
                  </p>
                </div>
                <div className="mt-8 flex flex-wrap items-center gap-4 text-sm font-semibold text-white/75">
                  <span>{formatDate(featuredPost.published_at)}</span>
                  <span className="h-1 w-1 rounded-full bg-white/40" />
                  <span>{featuredPost.reading_time}</span>
                </div>
              </div>
              <div className="flex flex-col justify-between bg-[#F8FAFC] p-6 sm:p-10">
                <div>
                  <div className="mb-6 flex flex-wrap gap-2">
                    {featuredPost.categories.map((category) => (
                      <span
                        key={category.id}
                        className="rounded-full bg-[#EEF4FA] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#0057D9]"
                      >
                        {category.name}
                      </span>
                    ))}
                  </div>
                  {featuredPost.cover_image ? (
                    <div className="overflow-hidden rounded-[20px] border border-[#102A4C]/10 bg-[#DCE7F3]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={featuredPost.cover_image}
                        alt={featuredPost.title}
                        className="h-[220px] w-full object-cover object-center sm:h-[280px]"
                      />
                    </div>
                  ) : (
                    <div className="flex h-[220px] items-end rounded-[20px] border border-[#102A4C]/10 bg-[#DCE7F3] p-6 sm:h-[280px] sm:p-8">
                      <div>
                        <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#0057D9]">
                          {featuredPost.author_name}
                        </p>
                        <p className="mt-3 max-w-md text-2xl font-extrabold leading-tight text-[#071426]">
                          {featuredPost.title}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-8">
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="inline-flex items-center gap-2 rounded-full bg-[#0057D9] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#102A4C]"
                  >
                    Read Article
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </article>
          ) : (
            <div className="rounded-[28px] border border-[#102A4C]/10 bg-white p-7 text-center shadow-[0_18px_48px_rgba(7,20,38,0.05)] sm:p-10">
              <h2 className="text-2xl font-extrabold text-[#071426]">No published posts yet.</h2>
              <p className="mt-3 text-[#52657C]">
                New writing will appear here once posts are published from the admin panel.
              </p>
            </div>
          )}

          {supportingPosts.length > 0 ? (
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {supportingPosts.map((post) => (
                <article
                  key={post.id}
                  className="rounded-[20px] border border-[#102A4C]/10 bg-white p-5 transition duration-300 ease-out hover:-translate-y-1 hover:border-[#0057D9]/30 hover:shadow-[0_18px_44px_rgba(7,20,38,0.06)] sm:p-6"
                >
                  <div className="flex flex-wrap gap-2">
                    {post.categories.map((category) => (
                      <span
                        key={category.id}
                        className="rounded-full bg-[#EEF4FA] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#0057D9]"
                      >
                        {category.name}
                      </span>
                    ))}
                  </div>
                  <h3 className="mt-5 text-balance text-2xl font-extrabold leading-tight text-[#071426]">
                    {post.title}
                  </h3>
                  <p className="mt-4 leading-7 text-[#52657C]">{post.excerpt}</p>
                  <div className="mt-6 flex items-center gap-3 text-sm font-semibold text-[#6E7F95]">
                    <span>{formatDate(post.published_at)}</span>
                    <span className="h-1 w-1 rounded-full bg-[#6E7F95]" />
                    <span>{post.reading_time}</span>
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#0057D9] transition hover:gap-3"
                  >
                    Read More
                    <ArrowRight size={15} />
                  </Link>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
