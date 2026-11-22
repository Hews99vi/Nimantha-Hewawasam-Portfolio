import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminContext } from "@/lib/admin/auth";
import { PROJECT_BUCKET } from "@/lib/project-media";

export async function DELETE(request: Request) {
  const admin = await getAdminContext();
  if (!admin.configured)
    return NextResponse.json(
      { success: false, message: "Supabase is not configured." },
      { status: 503 },
    );
  if (!admin.user)
    return NextResponse.json(
      { success: false, message: "Authentication required." },
      { status: 401 },
    );
  if (!admin.isAdmin || !admin.supabase)
    return NextResponse.json(
      { success: false, message: "Admin access required." },
      { status: 403 },
    );
  const input = await request.json().catch(() => null);
  const parsed = z
    .object({
      paths: z
        .array(
          z.string().regex(/^[0-9a-f-]{36}\/[0-9a-f-]{36}\.(png|jpe?g|webp)$/i),
        )
        .min(1)
        .max(100),
    })
    .safeParse(input);
  if (!parsed.success)
    return NextResponse.json(
      { success: false, message: "Invalid image paths." },
      { status: 400 },
    );
  // Storage RLS rejects deletion while any saved project references the original.
  const { data: projects, error: queryError } = await admin.supabase
    .from("projects")
    .select("images");
  if (queryError)
    return NextResponse.json(
      { success: false, message: "Could not check image references." },
      { status: 500 },
    );
  const used = new Set(
    projects.flatMap((project) =>
      (project.images ?? []).map(
        (image: { storage_path: string }) => image.storage_path,
      ),
    ),
  );
  if (parsed.data.paths.some((path) => used.has(path)))
    return NextResponse.json(
      {
        success: false,
        message: "Save the image removal before cleaning up files.",
      },
      { status: 409 },
    );
  const { error } = await admin.supabase.storage
    .from(PROJECT_BUCKET)
    .remove(parsed.data.paths);
  return NextResponse.json(
    {
      success: !error,
      message: error
        ? "Cleanup failed. Retry when storage is available."
        : "Unused files removed.",
    },
    { status: error ? 500 : 200 },
  );
}
