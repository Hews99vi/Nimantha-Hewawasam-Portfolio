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
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      configured: true,
      supabase,
      user: null,
      isAdmin: false,
    };
  }

  const { data: adminRow } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  return {
    configured: true,
    supabase,
    user,
    isAdmin: Boolean(adminRow),
  };
}

