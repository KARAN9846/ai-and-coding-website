import { NextRequest, NextResponse } from "next/server";

import {
  createRecoveryAuthorization,
  RECOVERY_AUTHORIZATION_COOKIE,
  RECOVERY_AUTHORIZATION_MAX_AGE_SECONDS,
} from "@/lib/admin/recovery-authorization";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  const adminUserId = process.env.ADMIN_USER_ID;
  const siteUrl = process.env.ADMIN_SITE_URL;

  if (!siteUrl) {
    console.error("Admin recovery site URL is not configured.");

    return NextResponse.json(
      {
        error: "Password recovery is temporarily unavailable.",
      },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }

  if (!code || !adminUserId) {
    return NextResponse.redirect(
      new URL("/admin?recovery=invalid", siteUrl),
    );
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      new URL("/admin?recovery=invalid", siteUrl),
    );
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user || user.id !== adminUserId) {
    await supabase.auth.signOut();

    return NextResponse.redirect(
      new URL("/admin?recovery=invalid", siteUrl),
    );
  }

  try {
    const token = await createRecoveryAuthorization(user.id);
    const response = NextResponse.redirect(
      new URL("/admin/reset-password", siteUrl),
    );

    response.cookies.set(RECOVERY_AUTHORIZATION_COOKIE, token, {
      httpOnly: true,
      maxAge: RECOVERY_AUTHORIZATION_MAX_AGE_SECONDS,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error) {
    console.error("Admin recovery authorization creation failed:", error);
    await supabase.auth.signOut();

    return NextResponse.redirect(
      new URL("/admin?recovery=invalid", siteUrl),
    );
  }
}
