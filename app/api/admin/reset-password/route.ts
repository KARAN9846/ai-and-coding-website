import { NextResponse } from "next/server";

import { getCurrentAdmin } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const headers = {
    "Cache-Control": "no-store",
  };

  const admin = await getCurrentAdmin();

  if (!admin) {
    return NextResponse.json(
      {
        error: "Your recovery session is invalid or has expired.",
      },
      {
        status: 401,
        headers,
      },
    );
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
        headers,
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
        headers,
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
        headers,
      },
    );
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    console.error("Admin password update failed:", error);

    return NextResponse.json(
      {
        error: "Unable to update the password.",
      },
      {
        status: 500,
        headers,
      },
    );
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

  return NextResponse.json(
    {
      success: true,
    },
    {
      status: 200,
      headers,
    },
  );
}
