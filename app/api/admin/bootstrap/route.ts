import { NextResponse } from "next/server";
import { getAdminContext } from "@/lib/admin/auth";
import { getAdminBootstrapData } from "@/lib/content";

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

  if (!admin.isAdmin) {
    return NextResponse.json(
      { success: false, message: "Admin access required." },
      { status: 403 },
    );
  }

  const data = await getAdminBootstrapData();

  return NextResponse.json({
    success: true,
    message: "Admin bootstrap loaded.",
    data,
  });
}

