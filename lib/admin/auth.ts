import "server-only";

import { createClient } from "@/lib/supabase/server";

export async function getCurrentAdmin() {
  const adminUserId = process.env.ADMIN_USER_ID;

  if (!adminUserId) {
    throw new Error("ADMIN_USER_ID is not configured.");
  }

  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  if (user.id !== adminUserId) {
    return null;
  }

  return user;
}
