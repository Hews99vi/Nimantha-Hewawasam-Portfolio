import type { BlogPostWithCategories } from "@/types/content";

export function blogHref(query = "", topic = "") {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (topic) params.set("topic", topic);
  return `/blog${params.size ? `?${params}` : ""}#articles`;
}

export function filterArticles(posts: BlogPostWithCategories[], query: string, topic: string) {
  const words = query.trim().toLocaleLowerCase().split(/\s+/u).filter(Boolean);
  return posts.filter((post) => {
    const text = [post.title, post.excerpt, ...post.categories.map((category) => category.name)].join(" ").toLocaleLowerCase();
    return (!topic || post.categories.some((category) => category.slug === topic)) && words.every((word) => text.includes(word));
  });
}

export function relatedArticles(posts: BlogPostWithCategories[], current: BlogPostWithCategories) {
  const categories = new Set(current.categories.map((category) => category.id));
  return posts.filter((post) => post.id !== current.id).map((post, index) => ({ post, index,
    overlap: post.categories.filter((category) => categories.has(category.id)).length,
  })).sort((a, b) => b.overlap - a.overlap || a.index - b.index).slice(0, 2).map(({ post }) => post);
}

export function blogDate(value: string | null, long = false) {
  if (!value || !Number.isFinite(Date.parse(value))) return null;
  return new Intl.DateTimeFormat("en-US", { timeZone: "UTC", month: long ? "long" : "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

/** Use a more specific topic when Development is the broad first category. */
export function articleTopic(post: BlogPostWithCategories) {
  return (post.categories.find((category) => category.slug !== "development") ?? post.categories[0])?.slug ?? "";
}
