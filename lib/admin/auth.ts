import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function getAdminContext() {
  if (!isSupabaseConfigured()) {
    return {
      configured: false,
      supabase: null,
      user: null,
      isAdmin: false,
    };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError && (authError.status === undefined || authError.status >= 500)) {
    console.error("Admin authentication service unavailable", { type: authError.name });
    throw new Error("Authentication service is temporarily unavailable.");
  }

  if (!user) {
    return {
      configured: true,
      supabase,
      user: null,
      isAdmin: false,
    };
  }

  const { data: adminRow, error: adminError } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (adminError) {
    console.error("Admin membership lookup failed", { code: adminError.code });
    throw new Error("Admin access could not be verified.");
  }

  return {
    configured: true,
    supabase,
    user,
    isAdmin: Boolean(adminRow),
  };
}

