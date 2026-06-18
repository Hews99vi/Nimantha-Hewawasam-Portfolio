import { NextResponse } from "next/server";
import { getCollectionConfig } from "@/lib/admin/collections";
import { getAdminContext } from "@/lib/admin/auth";
import { revalidateAdminPaths } from "@/lib/admin/revalidate";
import { reorderSchema } from "@/lib/admin/schemas";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ collection: string }> },
) {
  const { collection } = await params;
  const admin = await getAdminContext();
  const config = getCollectionConfig(collection);

  if (!config) {
    return NextResponse.json({ success: false, message: "Unknown collection." }, { status: 404 });
  }
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
  const parsed = reorderSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed.", fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const updates = parsed.data.items.map((item) =>
    admin.supabase
      .from(config.table)
      .update({ sort_order: item.sort_order })
      .eq("id", item.id),
  );

  const results = await Promise.all(updates);
  const failing = results.find((result) => result.error);

  if (failing?.error) {
    return NextResponse.json({ success: false, message: failing.error.message }, { status: 500 });
  }

  revalidateAdminPaths();

  return NextResponse.json({ success: true, message: "Order updated." });
}
