import { NextResponse } from "next/server";

import { createAuthClient } from "@/lib/supabase/auth-server";

export async function POST(request: Request) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const siteUrl = process.env.ADMIN_SITE_URL;

  const headers = {
    "Cache-Control": "no-store",
  };

  if (!adminEmail || !siteUrl) {
    console.error("Admin recovery configuration is missing.");

    return NextResponse.json(
      {
        error: "Password recovery is temporarily unavailable.",
      },
      {
        status: 503,
        headers,
      },
    );
  }

  try {
    const supabase = await createAuthClient(request);

    const { error } = await supabase.auth.resetPasswordForEmail(adminEmail, {
      redirectTo: new URL("/api/admin/recovery/callback", siteUrl).toString(),
    });

    if (error) {
      if (error.status === 429) {
        return NextResponse.json(
          {
            error: "Too many recovery requests. Please try again later.",
          },
          {
            status: 429,
            headers,
          },
        );
      }

      console.error("Admin password recovery request failed.");

      return NextResponse.json(
        {
          error: "Unable to send the recovery email right now.",
        },
        {
          status: 500,
          headers,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Password reset instructions have been sent to the registered admin email.",
      },
      {
        status: 200,
        headers,
      },
    );
  } catch (error) {
    console.error("Admin password recovery failed:", error);

    return NextResponse.json(
      {
        error: "Unable to send the recovery email right now.",
      },
      {
        status: 500,
        headers,
      },
    );
  }
}
