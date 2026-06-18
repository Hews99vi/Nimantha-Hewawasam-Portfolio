import { NextResponse } from "next/server";
import { getCollectionConfig } from "@/lib/admin/collections";
import { getAdminContext } from "@/lib/admin/auth";
import { revalidateAdminPaths } from "@/lib/admin/revalidate";

export async function GET(
  _request: Request,
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

  const { data, error } = await admin.supabase
    .from(config.table)
    .select("*")
    .order("sort_order");

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: "Collection loaded.", data });
}

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

  const rawPayload = await request.json();
  const payload =
    config.table === "projects" && typeof rawPayload.tags === "string"
      ? {
          ...rawPayload,
          tags: rawPayload.tags
            .split(",")
            .map((item: string) => item.trim())
            .filter(Boolean),
        }
      : rawPayload;

  const parsed = config.schema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed.", fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  if (
    config.table === "projects" &&
    "is_featured" in parsed.data &&
    parsed.data.is_featured
  ) {
    await admin.supabase.from("projects").update({ is_featured: false }).eq("is_featured", true);
  }

  const { data, error } = await admin.supabase
    .from(config.table)
    .insert(parsed.data as never)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }

  revalidateAdminPaths();

  return NextResponse.json({ success: true, message: "Item created.", data });
}
