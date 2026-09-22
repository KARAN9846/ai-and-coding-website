import { NextResponse } from "next/server";

import { getCurrentAdmin } from "@/lib/admin/auth";
import { validateAdminLinkInput } from "@/lib/admin/link-validation";
import { createClient } from "@/lib/supabase/server";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store",
};

/* ========================================
   GET ALL LINKS
======================================== */

export async function GET() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    return NextResponse.json(
      {
        error: "Unauthorized.",
      },
      {
        status: 401,
        headers: NO_STORE_HEADERS,
      },
    );
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("admin_links")
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
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error("Failed to load admin links:", error);

      return NextResponse.json(
        {
          error: "Unable to load links.",
        },
        {
          status: 500,
          headers: NO_STORE_HEADERS,
        },
      );
    }

    return NextResponse.json(
      {
        links: data ?? [],
      },
      {
        status: 200,
        headers: NO_STORE_HEADERS,
      },
    );
  } catch (error) {
    console.error("Admin links GET failed:", error);

    return NextResponse.json(
      {
        error: "Unable to load links.",
      },
      {
        status: 500,
        headers: NO_STORE_HEADERS,
      },
    );
  }
}

/* ========================================
   CREATE LINK
======================================== */

export async function POST(request: Request) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    return NextResponse.json(
      {
        error: "Unauthorized.",
      },
      {
        status: 401,
        headers: NO_STORE_HEADERS,
      },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        error: "Invalid request data.",
      },
      {
        status: 400,
        headers: NO_STORE_HEADERS,
      },
    );
  }

  const validation = validateAdminLinkInput(body);

  if (!validation.success) {
    return NextResponse.json(
      {
        error: validation.error,
      },
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
      .insert({
        title: validation.data.title,
        url: validation.data.url,
        category: validation.data.category,
        description: validation.data.description,
      })
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
      .single();

    if (error) {
      console.error("Failed to create admin link:", error);

      return NextResponse.json(
        {
          error: "Unable to save the link.",
        },
        {
          status: 500,
          headers: NO_STORE_HEADERS,
        },
      );
    }

    return NextResponse.json(
      {
        link: data,
      },
      {
        status: 201,
        headers: NO_STORE_HEADERS,
      },
    );
  } catch (error) {
    console.error("Admin links POST failed:", error);

    return NextResponse.json(
      {
        error: "Unable to save the link.",
      },
      {
        status: 500,
        headers: NO_STORE_HEADERS,
      },
    );
  }
}
