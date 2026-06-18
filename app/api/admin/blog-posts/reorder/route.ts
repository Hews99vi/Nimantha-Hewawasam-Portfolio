import { NextResponse } from "next/server";
import { getAdminContext } from "@/lib/admin/auth";
import { revalidateAdminPaths } from "@/lib/admin/revalidate";
import { reorderSchema } from "@/lib/admin/schemas";

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
  const parsed = reorderSchema.safeParse(payload);

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

  const results = await Promise.all(
    parsed.data.items.map((item) =>
      admin.supabase.from("blog_posts").update({ sort_order: item.sort_order }).eq("id", item.id),
    ),
  );

  const failing = results.find((result) => result.error);

  if (failing?.error) {
    return NextResponse.json({ success: false, message: failing.error.message }, { status: 500 });
  }

  revalidateAdminPaths();

  return NextResponse.json({ success: true, message: "Blog post order updated." });
}
