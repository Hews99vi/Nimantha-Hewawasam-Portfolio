import { NextResponse } from "next/server";
import { adminRoute, databaseError, readJson, validate } from "@/lib/admin/http";
import { reorderSchema } from "@/lib/admin/schemas";
import { revalidateAdminPaths } from "@/lib/admin/revalidate";

export const POST = adminRoute(async (request, context, admin) => {
  const { items } = validate(reorderSchema, await readJson(request));
  const { error } = await admin.supabase.rpc("reorder_portfolio_collection", { p_collection: "blog_posts", p_items: items });
  if (error) databaseError(error);
  revalidateAdminPaths();
  return NextResponse.json({ success: true, message: "Order updated." });
});
