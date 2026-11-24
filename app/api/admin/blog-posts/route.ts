import { NextResponse } from "next/server";
import { adminRoute, databaseError, readJson, validate } from "@/lib/admin/http";
import { revalidateAdminPaths } from "@/lib/admin/revalidate";
import { blogPostSchema } from "@/lib/admin/schemas";

export const GET = adminRoute(async (_request, _context, admin) => {
  const [posts, mappings] = await Promise.all([
    admin.supabase.from("blog_posts").select("*").order("sort_order"),
    admin.supabase.from("blog_post_categories").select("*"),
  ]);
  if (posts.error || mappings.error) databaseError(posts.error ?? mappings.error);
  const data = (posts.data ?? []).map(post => ({ ...post, category_ids: (mappings.data ?? []).filter(m => m.post_id === post.id).map(m => m.category_id) }));
  return NextResponse.json({ success: true, message: "Blog posts loaded.", data });
});

export const POST = adminRoute(async (request, _context, admin) => {
  const { category_ids, ...post } = validate(blogPostSchema, await readJson(request));
  const { data, error } = await admin.supabase.rpc("save_portfolio_blog_post", { p_id: null, p_post: post, p_category_ids: category_ids });
  if (error || !data) databaseError(error, "slug");
  revalidateAdminPaths([`/blog/${data.slug}`]);
  return NextResponse.json({ success: true, message: "Blog post created.", data });
});
