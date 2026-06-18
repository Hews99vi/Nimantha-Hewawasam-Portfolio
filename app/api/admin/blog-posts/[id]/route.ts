import { NextResponse } from "next/server";
import { getAdminContext } from "@/lib/admin/auth";
import { revalidateAdminPaths } from "@/lib/admin/revalidate";
import { blogPostSchema } from "@/lib/admin/schemas";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
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

  const [{ data: existingPost }, payload] = await Promise.all([
    admin.supabase.from("blog_posts").select("slug").eq("id", id).maybeSingle(),
    request.json(),
  ]);

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
    await admin.supabase
      .from("blog_posts")
      .update({ is_featured: false })
      .eq("is_featured", true)
      .neq("id", id);
  }

  const { category_ids, ...postData } = parsed.data;

  const { data: updatedPost, error } = await admin.supabase
    .from("blog_posts")
    .update(postData as never)
    .eq("id", id)
    .select()
    .single();

  if (error || !updatedPost) {
    return NextResponse.json(
      { success: false, message: error?.message ?? "Unable to update blog post." },
      { status: 500 },
    );
  }

  const { error: deleteMappingsError } = await admin.supabase
    .from("blog_post_categories")
    .delete()
    .eq("post_id", id);

  if (deleteMappingsError) {
    return NextResponse.json(
      { success: false, message: deleteMappingsError.message },
      { status: 500 },
    );
  }

  if (category_ids.length > 0) {
    const { error: mappingError } = await admin.supabase.from("blog_post_categories").insert(
      category_ids.map((categoryId) => ({
        post_id: id,
        category_id: categoryId,
      })) as never,
    );

    if (mappingError) {
      return NextResponse.json({ success: false, message: mappingError.message }, { status: 500 });
    }
  }

  revalidateAdminPaths(
    [existingPost?.slug, updatedPost.slug]
      .filter(Boolean)
      .map((slug) => `/blog/${slug}`),
  );

  return NextResponse.json({
    success: true,
    message: "Blog post updated.",
    data: { ...updatedPost, category_ids },
  });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
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

  const { data: existingPost } = await admin.supabase
    .from("blog_posts")
    .select("slug")
    .eq("id", id)
    .maybeSingle();

  const { error } = await admin.supabase.from("blog_posts").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }

  revalidateAdminPaths(existingPost?.slug ? [`/blog/${existingPost.slug}`] : []);

  return NextResponse.json({ success: true, message: "Blog post deleted." });
}
