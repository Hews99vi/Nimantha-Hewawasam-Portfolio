import { NextResponse } from "next/server";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { z } from "zod";
import { getAdminContext } from "@/lib/admin/auth";

type Admin = { supabase: SupabaseClient; user: User };
type Context<P> = { params: Promise<P> };
export class HttpError extends Error {
  constructor(public status: number, message: string, public fieldErrors?: Record<string, string[]>) {
    super(message);
  }
}

export async function readJson(request: Request): Promise<unknown> {
  try { return await request.json(); }
  catch { throw new HttpError(400, "Invalid JSON request."); }
}

export function validate<T>(schema: z.ZodType<T>, value: unknown): T {
  const result = schema.safeParse(value);
  if (!result.success) {
    const fields: Record<string, string[]> = {};
    for (const issue of result.error.issues) {
      const key = String(issue.path[0] ?? "request");
      (fields[key] ??= []).push(issue.message);
    }
    throw new HttpError(400, "Validation failed.", fields);
  }
  return result.data;
}

export function databaseError(error: { code?: string; message?: string } | null, field = "request"): never {
  if (error?.code === "23505") throw new HttpError(409, "That value is already in use.", { [field]: ["Choose a unique value."] });
  if (["23502", "23503", "23514", "22P02", "22023"].includes(error?.code ?? "")) throw new HttpError(400, "Some referenced items or values are invalid. Review your changes and retry.");
  if (error?.code === "P0002") throw new HttpError(404, "The requested item no longer exists.");
  if (error?.code === "42501") throw new HttpError(403, "Admin access required.");
  if (["PGRST202", "42883"].includes(error?.code ?? "")) throw new HttpError(503, "Apply supabase/migrations/202611240002_admin_integrity.sql before saving. Your edits have been kept.");
  console.error("Admin database operation failed", { code: error?.code ?? "unknown" });
  throw new HttpError(503, "The change could not be saved. Your edits have been kept; please retry.");
}

/** Every route verifies authorization here; the proxy only refreshes sessions. */
export function adminRoute<P = Record<string, never>>(
  handler: (request: Request, context: Context<P>, admin: Admin) => Promise<Response>,
) {
  return async (request: Request, context?: Context<P>): Promise<Response> => {
    try {
      const admin = await getAdminContext();
      if (!admin.configured) throw new HttpError(503, "Supabase is not configured.");
      if (!admin.user) throw new HttpError(401, "Your session has expired. Sign in again; keep this page open to retain your edits.");
      if (!admin.isAdmin || !admin.supabase) throw new HttpError(403, "Admin access required.");
      return await handler(request, context ?? { params: Promise.resolve({} as P) }, { supabase: admin.supabase, user: admin.user });
    } catch (error) {
      const expected = error instanceof HttpError;
      if (!expected) console.error("Admin request failed", { type: error instanceof Error ? error.name : "unknown" });
      return NextResponse.json({ success: false, message: expected ? error.message : "The service is temporarily unavailable. Your edits have been kept; please retry.", ...(expected && error.fieldErrors ? { fieldErrors: error.fieldErrors } : {}) }, { status: expected ? error.status : 503, headers: { "Cache-Control": "private, no-store" } });
    }
  };
}
