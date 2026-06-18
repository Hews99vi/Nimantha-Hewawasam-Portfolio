import { NextResponse } from "next/server";
import { getAdminContext } from "@/lib/admin/auth";
import { revalidateAdminPaths } from "@/lib/admin/revalidate";
import { blogSettingsSchema } from "@/lib/admin/schemas";

export async function PUT(request: Request) {
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
  const parsed = blogSettingsSchema.safeParse(payload);

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

  const { error } = await admin.supabase
    .from("blog_settings")
    .upsert({ id: "blog-settings", ...parsed.data }, { onConflict: "id" });

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }

  revalidateAdminPaths();

  return NextResponse.json({
    success: true,
    message: "Blog settings updated.",
    data: parsed.data,
  });
}
