import { NextResponse } from "next/server";

import { getCurrentAdmin } from "@/lib/admin/auth";
import { validateAdminLinkInput } from "@/lib/admin/link-validation";
import { createClient } from "@/lib/supabase/server";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store",
};

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function isValidUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

export async function PATCH(request: Request, context: RouteContext) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized." },
      {
        status: 401,
        headers: NO_STORE_HEADERS,
      },
    );
  }

  const { id } = await context.params;

  if (!isValidUuid(id)) {
    return NextResponse.json(
      { error: "Invalid link ID." },
      {
        status: 400,
        headers: NO_STORE_HEADERS,
      },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request data." },
      {
        status: 400,
        headers: NO_STORE_HEADERS,
      },
    );
  }

  const validation = validateAdminLinkInput(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error },
      {
        status: 400,
        headers: NO_STORE_HEADERS,
      },
    );
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("admin_links")
      .update({
        title: validation.data.title,
        url: validation.data.url,
        category: validation.data.category,
        description: validation.data.description,
      })
      .eq("id", id)
      .select(
        `
          id,
          title,
          url,
          category,
          description,
          created_at,
          updated_at
        `,
      )
      .maybeSingle();

    if (error) {
      console.error("Failed to update admin link:", error);

      return NextResponse.json(
        { error: "Unable to update the link." },
        {
          status: 500,
          headers: NO_STORE_HEADERS,
        },
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Link not found." },
        {
          status: 404,
          headers: NO_STORE_HEADERS,
        },
      );
    }

    return NextResponse.json(
      { link: data },
      {
        status: 200,
        headers: NO_STORE_HEADERS,
      },
    );
  } catch (error) {
    console.error("Admin link PATCH failed:", error);

    return NextResponse.json(
      { error: "Unable to update the link." },
      {
        status: 500,
        headers: NO_STORE_HEADERS,
      },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized." },
      {
        status: 401,
        headers: NO_STORE_HEADERS,
      },
    );
  }

  const { id } = await context.params;

  if (!isValidUuid(id)) {
    return NextResponse.json(
      { error: "Invalid link ID." },
      {
        status: 400,
        headers: NO_STORE_HEADERS,
      },
    );
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("admin_links")
      .delete()
      .eq("id", id)
      .select("id")
      .maybeSingle();

    if (error) {
      console.error("Failed to delete admin link:", error);

      return NextResponse.json(
        { error: "Unable to delete the link." },
        {
          status: 500,
          headers: NO_STORE_HEADERS,
        },
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Link not found." },
        {
          status: 404,
          headers: NO_STORE_HEADERS,
        },
      );
    }

    return NextResponse.json(
      { success: true },
      {
        status: 200,
        headers: NO_STORE_HEADERS,
      },
    );
  } catch (error) {
    console.error("Admin link DELETE failed:", error);

    return NextResponse.json(
      { error: "Unable to delete the link." },
      {
        status: 500,
        headers: NO_STORE_HEADERS,
      },
    );
  }
}
