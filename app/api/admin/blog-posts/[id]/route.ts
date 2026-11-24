import { NextResponse } from "next/server";
import { adminRoute, databaseError, readJson, validate, HttpError } from "@/lib/admin/http";
import { revalidateAdminPaths } from "@/lib/admin/revalidate";
import { blogPostSchema } from "@/lib/admin/schemas";
import { z } from "zod";

export const PUT = adminRoute<{ id: string }>(async (request, context, admin) => {
  const id = validate(z.uuid(), (await context.params).id);
  const { category_ids, ...post } = validate(blogPostSchema, await readJson(request));
  const { data, error } = await admin.supabase.rpc("save_portfolio_blog_post", { p_id: id, p_post: post, p_category_ids: category_ids });
  if (error || !data) databaseError(error, "slug");
  // Shared invalidation covers the former slug as well as the current article.
  revalidateAdminPaths([`/blog/${data.slug}`]);
  return NextResponse.json({ success: true, message: "Blog post updated.", data });
});

export const DELETE = adminRoute<{ id: string }>(async (_request, context, admin) => {
  const id = validate(z.uuid(), (await context.params).id);
  const { data, error } = await admin.supabase.from("blog_posts").delete().eq("id", id).select("slug").maybeSingle();
  if (error) databaseError(error);
  if (!data) throw new HttpError(404, "Article not found.");
  revalidateAdminPaths([`/blog/${data.slug}`]);
  return NextResponse.json({ success: true, message: "Blog post deleted." });
});
