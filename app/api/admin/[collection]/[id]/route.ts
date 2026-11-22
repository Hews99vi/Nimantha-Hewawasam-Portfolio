import {
  validateStoredImages,
  cleanupImages,
} from "@/lib/admin/project-images";
import type { ProjectImage } from "@/types/content";
import { NextResponse } from "next/server";
import { getCollectionConfig } from "@/lib/admin/collections";
import { getAdminContext } from "@/lib/admin/auth";
import { revalidateAdminPaths } from "@/lib/admin/revalidate";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ collection: string; id: string }> },
) {
  const { collection, id } = await params;
  const admin = await getAdminContext();
  const config = getCollectionConfig(collection);

  if (!config) {
    return NextResponse.json(
      { success: false, message: "Unknown collection." },
      { status: 404 },
    );
  }
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

  let rawPayload;
  try {
    rawPayload = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid JSON." },
      { status: 400 },
    );
  }
  if (
    !rawPayload ||
    typeof rawPayload !== "object" ||
    Array.isArray(rawPayload)
  )
    return NextResponse.json(
      { success: false, message: "Expected an object." },
      { status: 400 },
    );
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
      {
        success: false,
        message: "Validation failed.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  let oldImages: ProjectImage[] = [];
  if (config.table === "projects") {
    const { data: old, error } = await admin.supabase
      .from("projects")
      .select("images")
      .eq("id", id)
      .single();
    if (error || !old)
      return NextResponse.json(
        {
          success: false,
          message:
            "Project not found. Check that the gallery migration has been applied.",
        },
        { status: 404 },
      );
    oldImages = old.images ?? [];
    if ("images" in parsed.data) {
      const message = await validateStoredImages(
        admin.supabase,
        id,
        parsed.data.images,
      );
      if (message)
        return NextResponse.json({ success: false, message }, { status: 400 });
    }
  }

  const { data, error } = await admin.supabase
    .from(config.table)
    .update(parsed.data as never)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }

  revalidateAdminPaths();

  const detached =
    config.table === "projects"
      ? oldImages.filter(
          (image) =>
            !(data.images ?? []).some(
              (current: ProjectImage) =>
                current.storage_path === image.storage_path,
            ),
        )
      : [];
  const cleanupFailed = await cleanupImages(admin.supabase, detached);
  return NextResponse.json({
    success: true,
    message: cleanupFailed
      ? "Project saved. Some detached files could not be removed; retry cleanup below."
      : "Item updated.",
    data,
    cleanupPaths: cleanupFailed
      ? detached.map((image) => image.storage_path)
      : [],
  });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ collection: string; id: string }> },
) {
  const { collection, id } = await params;
  const admin = await getAdminContext();
  const config = getCollectionConfig(collection);

  if (!config) {
    return NextResponse.json(
      { success: false, message: "Unknown collection." },
      { status: 404 },
    );
  }
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

  const { data: oldProject } =
    config.table === "projects"
      ? await admin.supabase
          .from("projects")
          .select("images")
          .eq("id", id)
          .maybeSingle()
      : { data: null };
  const { error } = await admin.supabase
    .from(config.table)
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }

  revalidateAdminPaths();

  const cleanupFailed = await cleanupImages(
    admin.supabase,
    oldProject?.images ?? [],
  );
  return NextResponse.json({
    success: true,
    message: cleanupFailed
      ? "Project deleted; its unused files remain in Storage for manual cleanup."
      : "Item deleted.",
  });
}
