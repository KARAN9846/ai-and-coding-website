import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";

import { createAdminClient } from "@/lib/supabase/admin-server";

export const RECOVERY_AUTHORIZATION_COOKIE =
  "admin-recovery-authorization";
export const RECOVERY_AUTHORIZATION_MAX_AGE_SECONDS = 10 * 60;

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

async function getRecoveryToken() {
  const cookieStore = await cookies();

  return cookieStore.get(RECOVERY_AUTHORIZATION_COOKIE)?.value ?? null;
}

export async function createRecoveryAuthorization(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(
    Date.now() + RECOVERY_AUTHORIZATION_MAX_AGE_SECONDS * 1000,
  ).toISOString();
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("admin_recovery_authorizations")
    .insert({
      token_hash: hashToken(token),
      user_id: userId,
      expires_at: expiresAt,
    });

  if (error) {
    throw new Error("Unable to create recovery authorization.");
  }

  return token;
}

export async function hasValidRecoveryAuthorization(userId: string) {
  const token = await getRecoveryToken();

  if (!token) {
    return false;
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("admin_recovery_authorizations")
    .select("token_hash")
    .eq("token_hash", hashToken(token))
    .eq("user_id", userId)
    .is("consumed_at", null)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();

  return !error && data !== null;
}

export async function consumeRecoveryAuthorization(userId: string) {
  const token = await getRecoveryToken();

  if (!token) {
    return false;
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc(
    "consume_admin_recovery_authorization",
    {
      p_token_hash: hashToken(token),
      p_user_id: userId,
    },
  );

  return !error && data === true;
}
