import { NextResponse } from "next/server";
import { getAdminContext } from "@/lib/admin/auth";
import { revalidateAdminPaths } from "@/lib/admin/revalidate";
import { blogPostSchema } from "@/lib/admin/schemas";

export async function GET() {
  const admin = await getAdminContext();

  if (!admin.configured) {
    return NextResponse.json(
      { success: false, message: "Supabase is not configured." },
      { status: 500 },
    );
  }
  if (!admin.user) {
    return NextResponse.json(
      { success: false, message: "Authentication required." },
      { status: 401 },
    );
  }
  if (!admin.isAdmin || !admin.supabase) {
    return NextResponse.json(
      { success: false, message: "Admin access required." },
      { status: 403 },
    );
  }

  const [postsResult, mappingsResult] = await Promise.all([
    admin.supabase.from("blog_posts").select("*").order("sort_order"),
    admin.supabase.from("blog_post_categories").select("*"),
  ]);

  if (postsResult.error || mappingsResult.error) {
    return NextResponse.json(
      {
        success: false,
        message: postsResult.error?.message ?? mappingsResult.error?.message ?? "Unable to load blog posts.",
      },
      { status: 500 },
    );
  }

  const data = (postsResult.data ?? []).map((post) => ({
    ...post,
    category_ids: (mappingsResult.data ?? [])
      .filter((mapping) => mapping.post_id === post.id)
      .map((mapping) => mapping.category_id),
  }));

  return NextResponse.json({ success: true, message: "Blog posts loaded.", data });
}

export async function POST(request: Request) {
  const admin = await getAdminContext();

  if (!admin.configured) {
    return NextResponse.json(
      { success: false, message: "Supabase is not configured." },
      { status: 500 },
    );
  }
  if (!admin.user) {
    return NextResponse.json(
      { success: false, message: "Authentication required." },
      { status: 401 },
    );
  }
  if (!admin.isAdmin || !admin.supabase) {
    return NextResponse.json(
      { success: false, message: "Admin access required." },
      { status: 403 },
    );
  }

  const payload = await request.json();
  const parsed = blogPostSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: "Validation failed.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  if (parsed.data.is_featured) {
    await admin.supabase.from("blog_posts").update({ is_featured: false }).eq("is_featured", true);
  }

  const { category_ids, ...postData } = parsed.data;

  const { data: insertedPost, error } = await admin.supabase
    .from("blog_posts")
    .insert(postData as never)
    .select()
    .single();

  if (error || !insertedPost) {
    return NextResponse.json(
      { success: false, message: error?.message ?? "Unable to create blog post." },
      { status: 500 },
    );
  }

  if (category_ids.length > 0) {
    const { error: mappingError } = await admin.supabase.from("blog_post_categories").insert(
      category_ids.map((categoryId) => ({
        post_id: insertedPost.id,
        category_id: categoryId,
      })) as never,
    );

    if (mappingError) {
      return NextResponse.json({ success: false, message: mappingError.message }, { status: 500 });
    }
  }

  revalidateAdminPaths([`/blog/${insertedPost.slug}`]);

  return NextResponse.json({
    success: true,
    message: "Blog post created.",
    data: { ...insertedPost, category_ids },
  });
}
