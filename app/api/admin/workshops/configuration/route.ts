import { NextResponse } from "next/server";

import { getCurrentAdmin } from "@/lib/admin/auth";
import {
  getWorkshopConfiguration,
  updateWorkshopGlobalConfiguration,
} from "@/lib/workshops/configuration-server";
import { validateWorkshopGlobalConfiguration } from "@/lib/workshops/configuration-validation";

const NO_STORE_HEADERS = { "Cache-Control": "no-store" };

function unauthorizedResponse() {
  return NextResponse.json(
    { error: "Unauthorized." },
    { status: 401, headers: NO_STORE_HEADERS },
  );
}

export async function GET() {
  const admin = await getCurrentAdmin();

  if (!admin) return unauthorizedResponse();

  try {
    return NextResponse.json(await getWorkshopConfiguration(), {
      status: 200,
      headers: NO_STORE_HEADERS,
    });
  } catch (error) {
    console.error("Admin Workshop configuration GET failed:", error);
    return NextResponse.json(
      { error: "Unable to load Workshop configuration." },
      { status: 500, headers: NO_STORE_HEADERS },
    );
  }
}

export async function PATCH(request: Request) {
  const admin = await getCurrentAdmin();

  if (!admin) return unauthorizedResponse();

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request data." },
      { status: 400, headers: NO_STORE_HEADERS },
    );
  }

  const validation = validateWorkshopGlobalConfiguration(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error },
      { status: 400, headers: NO_STORE_HEADERS },
    );
  }

  try {
    return NextResponse.json(
      await updateWorkshopGlobalConfiguration(validation.data),
      { status: 200, headers: NO_STORE_HEADERS },
    );
  } catch (error) {
    console.error("Admin Workshop configuration PATCH failed:", error);
    return NextResponse.json(
      { error: "Unable to update Workshop configuration." },
      { status: 500, headers: NO_STORE_HEADERS },
    );
  }
}
