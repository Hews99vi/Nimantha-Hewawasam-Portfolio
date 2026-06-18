"use client";

import type {
  BlogCategory,
  BlogPost,
  BlogSettings,
} from "@/types/content";
import {
  createTempId,
  isTempId,
  requestJson,
} from "@/app/admin/admin-utils";

type RunAction = (action: () => Promise<void>) => void;
type MessageSetter = (message: string | null) => void;

function toDateTimeLocal(value: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function TextField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "datetime-local";
}) {
  return (
    <label className="block text-sm font-bold text-[#071426]">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full border border-[#102A4C]/12 px-4 py-3 text-sm"
      />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <label className="block text-sm font-bold text-[#071426]">
      {label}
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        className="mt-2 w-full border border-[#102A4C]/12 px-4 py-3 text-sm"
      />
    </label>
  );
}

function ToggleField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="inline-flex items-center gap-3 text-sm font-bold text-[#071426]">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      {label}
    </label>
  );
}

export function BlogSettingsEditor({
  settings,
  onChange,
  pending,
  runAction,
  setMessage,
}: {
  settings: BlogSettings;
  onChange: (settings: BlogSettings) => void;
  pending: boolean;
  runAction: RunAction;
  setMessage: MessageSetter;
}) {
  function update(field: keyof BlogSettings, value: string) {
    onChange({ ...settings, [field]: value });
  }

  return (
    <div className="space-y-5">
      <TextField label="Eyebrow" value={settings.eyebrow} onChange={(value) => update("eyebrow", value)} />
      <TextField label="Title" value={settings.title} onChange={(value) => update("title", value)} />
      <TextAreaField label="Intro" value={settings.intro} onChange={(value) => update("intro", value)} />
      <TextField
        label="Featured Label"
        value={settings.featured_title}
        onChange={(value) => update("featured_title", value)}
      />
      <TextAreaField
        label="Featured Intro"
        value={settings.featured_intro}
        onChange={(value) => update("featured_intro", value)}
      />
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          runAction(async () => {
            const result = await requestJson<BlogSettings>("/api/admin/blog-settings", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(settings),
            });
            setMessage(result.message ?? "Blog settings updated.");
          })
        }
        className="inline-flex min-h-12 items-center justify-center bg-[#0057D9] px-5 text-sm font-bold text-white disabled:opacity-60"
      >
        {pending ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}

export function BlogCategoriesEditor({
  categories,
  onChange,
  pending,
  runAction,
  setMessage,
}: {
  categories: BlogCategory[];
  onChange: (categories: BlogCategory[]) => void;
  pending: boolean;
  runAction: RunAction;
  setMessage: MessageSetter;
}) {
  function updateItem(id: string, field: keyof BlogCategory, value: string | number | boolean) {
    onChange(categories.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-[#071426]">Blog Categories</h2>
        <button
          type="button"
          onClick={() =>
            onChange([
              ...categories,
              {
                id: createTempId(),
                sort_order: categories.length + 1,
                name: "",
                slug: "",
                is_active: true,
              },
            ])
          }
          className="bg-[#0057D9] px-4 py-3 text-sm font-bold text-white"
        >
          Add Category
        </button>
      </div>

      {categories.map((category, index) => (
        <div key={category.id} className="border border-[#102A4C]/10 p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-extrabold text-[#071426]">Category {index + 1}</p>
            <button
              type="button"
              onClick={() => {
                if (isTempId(category.id)) {
                  onChange(categories.filter((item) => item.id !== category.id));
                  setMessage("Unsaved category removed.");
                  return;
                }

                runAction(async () => {
                  const result = await requestJson<null>(
                    `/api/admin/blog-categories/${category.id}`,
                    { method: "DELETE" },
                  );
                  onChange(categories.filter((item) => item.id !== category.id));
                  setMessage(result.message ?? "Category deleted.");
                });
              }}
              className="text-sm font-bold text-[#B91C1C]"
            >
              Remove
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <TextField
              label="Name"
              value={category.name}
              onChange={(value) => updateItem(category.id, "name", value)}
            />
            <TextField
              label="Slug"
              value={category.slug}
              onChange={(value) => updateItem(category.id, "slug", value)}
            />
            <TextField
              label="Order"
              value={String(category.sort_order)}
              onChange={(value) => updateItem(category.id, "sort_order", Number(value) || 0)}
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-4">
            <ToggleField
              label="Active"
              checked={category.is_active}
              onChange={(checked) => updateItem(category.id, "is_active", checked)}
            />
            <button
              type="button"
              disabled={pending}
              onClick={() =>
                runAction(async () => {
                  const isNew = isTempId(category.id);
                  const endpoint = isNew
                    ? "/api/admin/blog-categories"
                    : `/api/admin/blog-categories/${category.id}`;
                  const method = isNew ? "POST" : "PUT";
                  const result = await requestJson<BlogCategory>(endpoint, {
                    method,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(category),
                  });
                  if (result.data) {
                    onChange(
                      categories.map((item) => (item.id === category.id ? result.data as BlogCategory : item)),
                    );
                  }
                  setMessage(result.message ?? "Category saved.");
                })
              }
              className="inline-flex min-h-11 items-center justify-center bg-[#071426] px-4 text-sm font-bold text-white disabled:opacity-60"
            >
              {pending ? "Saving..." : "Save Category"}
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (categories.some((item) => isTempId(item.id))) {
            setMessage("Save new categories before saving order.");
            return;
          }

          runAction(async () => {
            const result = await requestJson<null>("/api/admin/blog-categories/reorder", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                items: categories.map((category, index) => ({
                  id: category.id,
                  sort_order: category.sort_order || index + 1,
                })),
              }),
            });
            setMessage(result.message ?? "Category order updated.");
          });
        }}
        className="inline-flex min-h-11 items-center justify-center border border-[#102A4C]/14 px-4 text-sm font-bold text-[#071426] disabled:opacity-60"
      >
        Save Order
      </button>
    </div>
  );
}

export function BlogPostsEditor({
  posts,
  categories,
  onChange,
  pending,
  runAction,
  setMessage,
}: {
  posts: BlogPost[];
  categories: BlogCategory[];
  onChange: (posts: BlogPost[]) => void;
  pending: boolean;
  runAction: RunAction;
  setMessage: MessageSetter;
}) {
  function updatePost(id: string, field: keyof BlogPost, value: unknown) {
    onChange(posts.map((post) => (post.id === id ? { ...post, [field]: value } : post)));
  }

  const activeCategories = categories
    .filter((category) => category.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-[#071426]">Blog Posts</h2>
        <button
          type="button"
          onClick={() =>
            onChange([
              ...posts,
              {
                id: createTempId(),
                sort_order: posts.length + 1,
                title: "",
                slug: "",
                excerpt: "",
                cover_image: null,
                content_markdown: "",
                author_name: "Nimantha Hewawasam",
                reading_time: "",
                published_at: null,
                seo_title: null,
                seo_description: null,
                is_featured: false,
                is_published: false,
                category_ids: [],
              },
            ])
          }
          className="bg-[#0057D9] px-4 py-3 text-sm font-bold text-white"
        >
          Add Post
        </button>
      </div>

      {posts.map((post, index) => (
        <div key={post.id} className="border border-[#102A4C]/10 p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-extrabold text-[#071426]">Post {index + 1}</p>
            <button
              type="button"
              onClick={() => {
                if (isTempId(post.id)) {
                  onChange(posts.filter((item) => item.id !== post.id));
                  setMessage("Unsaved post removed.");
                  return;
                }

                runAction(async () => {
                  const result = await requestJson<null>(`/api/admin/blog-posts/${post.id}`, {
                    method: "DELETE",
                  });
                  onChange(posts.filter((item) => item.id !== post.id));
                  setMessage(result.message ?? "Post deleted.");
                });
              }}
              className="text-sm font-bold text-[#B91C1C]"
            >
              Remove
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              label="Title"
              value={post.title}
              onChange={(value) => updatePost(post.id, "title", value)}
            />
            <TextField
              label="Slug"
              value={post.slug}
              onChange={(value) => updatePost(post.id, "slug", value)}
            />
            <TextField
              label="Author"
              value={post.author_name}
              onChange={(value) => updatePost(post.id, "author_name", value)}
            />
            <TextField
              label="Reading Time"
              value={post.reading_time}
              onChange={(value) => updatePost(post.id, "reading_time", value)}
            />
            <TextField
              label="Published At"
              type="datetime-local"
              value={toDateTimeLocal(post.published_at)}
              onChange={(value) => updatePost(post.id, "published_at", value || null)}
            />
            <TextField
              label="Order"
              value={String(post.sort_order)}
              onChange={(value) => updatePost(post.id, "sort_order", Number(value) || 0)}
            />
          </div>

          <div className="mt-4">
            <TextAreaField
              label="Excerpt"
              value={post.excerpt}
              onChange={(value) => updatePost(post.id, "excerpt", value)}
            />
          </div>

          <div className="mt-4">
            <TextField
              label="Cover Image Path or URL"
              value={post.cover_image ?? ""}
              onChange={(value) => updatePost(post.id, "cover_image", value || null)}
            />
          </div>

          <div className="mt-4">
            <TextAreaField
              label="Markdown Content"
              value={post.content_markdown}
              onChange={(value) => updatePost(post.id, "content_markdown", value)}
              rows={14}
            />
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <TextField
              label="SEO Title"
              value={post.seo_title ?? ""}
              onChange={(value) => updatePost(post.id, "seo_title", value || null)}
            />
            <TextAreaField
              label="SEO Description"
              value={post.seo_description ?? ""}
              onChange={(value) => updatePost(post.id, "seo_description", value || null)}
            />
          </div>

          <div className="mt-5">
            <p className="text-sm font-bold text-[#071426]">Categories</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {activeCategories.map((category) => {
                const checked = post.category_ids.includes(category.id);

                return (
                  <label
                    key={category.id}
                    className="inline-flex items-center gap-2 border border-[#102A4C]/10 px-3 py-2 text-sm font-semibold text-[#36475C]"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(event) => {
                        const nextCategoryIds = event.target.checked
                          ? [...post.category_ids, category.id]
                          : post.category_ids.filter((id) => id !== category.id);
                        updatePost(post.id, "category_ids", nextCategoryIds);
                      }}
                    />
                    {category.name}
                  </label>
                );
              })}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-5">
            <ToggleField
              label="Featured"
              checked={post.is_featured}
              onChange={(checked) =>
                onChange(
                  posts.map((item) => ({
                    ...item,
                    is_featured: item.id === post.id ? checked : false,
                  })),
                )
              }
            />
            <ToggleField
              label="Published"
              checked={post.is_published}
              onChange={(checked) => updatePost(post.id, "is_published", checked)}
            />
          </div>

          <div className="mt-4">
            <button
              type="button"
              disabled={pending}
              onClick={() =>
                runAction(async () => {
                  const isNew = isTempId(post.id);
                  const endpoint = isNew ? "/api/admin/blog-posts" : `/api/admin/blog-posts/${post.id}`;
                  const method = isNew ? "POST" : "PUT";
                  const result = await requestJson<BlogPost>(endpoint, {
                    method,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(post),
                  });
                  if (result.data) {
                    onChange(posts.map((item) => (item.id === post.id ? result.data as BlogPost : item)));
                  }
                  setMessage(result.message ?? "Post saved.");
                })
              }
              className="inline-flex min-h-11 items-center justify-center bg-[#071426] px-4 text-sm font-bold text-white disabled:opacity-60"
            >
              {pending ? "Saving..." : "Save Post"}
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (posts.some((item) => isTempId(item.id))) {
            setMessage("Save new posts before saving order.");
            return;
          }

          runAction(async () => {
            const result = await requestJson<null>("/api/admin/blog-posts/reorder", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                items: posts.map((post, index) => ({
                  id: post.id,
                  sort_order: post.sort_order || index + 1,
                })),
              }),
            });
            setMessage(result.message ?? "Post order updated.");
          });
        }}
        className="inline-flex min-h-11 items-center justify-center border border-[#102A4C]/14 px-4 text-sm font-bold text-[#071426] disabled:opacity-60"
      >
        Save Order
      </button>
    </div>
  );
}
