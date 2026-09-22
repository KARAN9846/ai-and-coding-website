import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  const adminUserId = process.env.ADMIN_USER_ID;

  if (!code || !adminUserId) {
    return NextResponse.redirect(
      new URL("/admin?recovery=invalid", request.url),
    );
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      new URL("/admin?recovery=invalid", request.url),
    );
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user || user.id !== adminUserId) {
    await supabase.auth.signOut();

    return NextResponse.redirect(
      new URL("/admin?recovery=invalid", request.url),
    );
  }

  return NextResponse.redirect(new URL("/admin/reset-password", request.url));
}
