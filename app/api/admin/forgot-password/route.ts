import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function POST() {
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
    const supabase = await createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(adminEmail, {
      redirectTo: `${siteUrl}/api/admin/recovery/callback`,
    });

    if (error) {
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
