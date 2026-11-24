import { NextResponse } from "next/server";
import { adminRoute, databaseError, readJson, validate, HttpError } from "@/lib/admin/http";
import { reorderSchema } from "@/lib/admin/schemas";
import { revalidateAdminPaths } from "@/lib/admin/revalidate";
import { getCollectionConfig } from "@/lib/admin/collections";

export const POST = adminRoute<{ collection: string }>(async (request, context, admin) => {
  const config = getCollectionConfig((await context.params).collection);
  if (!config) throw new HttpError(404, "Unknown collection.");
  const { items } = validate(reorderSchema, await readJson(request));
  const { error } = await admin.supabase.rpc("reorder_portfolio_collection", { p_collection: config.table, p_items: items });
  if (error) databaseError(error);
  revalidateAdminPaths();
  return NextResponse.json({ success: true, message: "Order updated." });
});
