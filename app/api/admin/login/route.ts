import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminUserId = process.env.ADMIN_USER_ID;

  const responseHeaders = {
    "Cache-Control": "no-store",
  };

  // Ensure the admin account is configured.

  if (!adminEmail || !adminUserId) {
    console.error("Admin authentication environment variables are missing.");

    return NextResponse.json(
      {
        error: "Admin login is temporarily unavailable.",
      },
      {
        status: 503,
        headers: responseHeaders,
      },
    );
  }

  // Read and validate the submitted password.

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        error: "Invalid login request.",
      },
      {
        status: 400,
        headers: responseHeaders,
      },
    );
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("password" in body) ||
    typeof body.password !== "string" ||
    body.password.length === 0 ||
    body.password.length > 256
  ) {
    return NextResponse.json(
      {
        error: "Please enter a valid password.",
      },
      {
        status: 400,
        headers: responseHeaders,
      },
    );
  }

  const password = body.password;

  // Authenticate through Supabase.

  try {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password,
    });

    // Reject invalid credentials or unauthorized accounts.

    if (error || !data.user || data.user.id !== adminUserId) {
      // Ensure no unauthorized session remains active.

      if (data.session) {
        await supabase.auth.signOut();
      }

      return NextResponse.json(
        {
          error: "Incorrect password.",
        },
        {
          status: 401,
          headers: responseHeaders,
        },
      );
    }

    // Login successful.

    return NextResponse.json(
      {
        success: true,
      },
      {
        status: 200,
        headers: responseHeaders,
      },
    );
  } catch (error) {
    console.error("Admin authentication failed:", error);

    return NextResponse.json(
      {
        error: "Unable to sign in right now. Please try again.",
      },
      {
        status: 500,
        headers: responseHeaders,
      },
    );
  }
}
