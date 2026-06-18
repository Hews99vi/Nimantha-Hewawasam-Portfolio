import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAdminContext } from "@/lib/admin/auth";
import { aboutSectionSchema } from "@/lib/admin/schemas";

export async function PUT(request: Request) {
  const admin = await getAdminContext();

  if (!admin.configured) {
    return NextResponse.json({ success: false, message: "Supabase is not configured." }, { status: 500 });
  }
  if (!admin.user) {
    return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
  }
  if (!admin.isAdmin || !admin.supabase) {
    return NextResponse.json({ success: false, message: "Admin access required." }, { status: 403 });
  }

  const payload = await request.json();
  const parsed = aboutSectionSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed.", fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { error } = await admin.supabase
    .from("about_section")
    .upsert({ id: "about-section", ...parsed.data }, { onConflict: "id" });

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }

  revalidatePath("/");
  revalidatePath("/admin");

  return NextResponse.json({ success: true, message: "About section updated.", data: parsed.data });
}

