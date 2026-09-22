import { NextResponse } from "next/server";

import { getCurrentAdmin } from "@/lib/admin/auth";
import {
  consumeRecoveryAuthorization,
  RECOVERY_AUTHORIZATION_COOKIE,
} from "@/lib/admin/recovery-authorization";
import { createClient } from "@/lib/supabase/server";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store",
};

function recoveryErrorResponse() {
  const response = NextResponse.json(
    {
      error: "Your recovery session is invalid or has expired.",
    },
    {
      status: 401,
      headers: NO_STORE_HEADERS,
    },
  );

  response.cookies.delete(RECOVERY_AUTHORIZATION_COOKIE);

  return response;
}

export async function POST(request: Request) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    return recoveryErrorResponse();
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        error: "Invalid request.",
      },
      {
        status: 400,
        headers: NO_STORE_HEADERS,
      },
    );
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("password" in body) ||
    typeof body.password !== "string"
  ) {
    return NextResponse.json(
      {
        error: "Please enter a valid password.",
      },
      {
        status: 400,
        headers: NO_STORE_HEADERS,
      },
    );
  }

  const password = body.password;

  if (password.length < 6 || password.length > 256) {
    return NextResponse.json(
      {
        error: "Password must contain at least 6 characters.",
      },
      {
        status: 400,
        headers: NO_STORE_HEADERS,
      },
    );
  }

  if (!(await consumeRecoveryAuthorization(admin.id))) {
    return recoveryErrorResponse();
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    console.error("Admin password update failed:", error);

    const response = NextResponse.json(
      {
        error: "Unable to update the password.",
      },
      {
        status: 500,
        headers: NO_STORE_HEADERS,
      },
    );

    response.cookies.delete(RECOVERY_AUTHORIZATION_COOKIE);

    return response;
  }

  /*
   * Terminate existing sessions after a
   * password recovery.
   *
   * Supabase's default signOut scope is
   * global, which revokes refresh tokens
   * for all current sessions.
   */
  await supabase.auth.signOut({
    scope: "global",
  });

  const response = NextResponse.json(
    {
      success: true,
    },
    {
      status: 200,
      headers: NO_STORE_HEADERS,
    },
  );

  response.cookies.delete(RECOVERY_AUTHORIZATION_COOKIE);

  return response;
}
