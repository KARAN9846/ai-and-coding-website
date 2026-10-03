import { NextResponse } from "next/server";

import { getCurrentAdmin } from "@/lib/admin/auth";
import { reorderWorkshopPrograms } from "@/lib/workshops/configuration-server";
import { validateWorkshopOrderInput } from "@/lib/workshops/configuration-validation";

const NO_STORE_HEADERS = { "Cache-Control": "no-store" };

export async function PATCH(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized." },
      { status: 401, headers: NO_STORE_HEADERS },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request data." },
      { status: 400, headers: NO_STORE_HEADERS },
    );
  }

  const validation = validateWorkshopOrderInput(body);
  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error },
      { status: 400, headers: NO_STORE_HEADERS },
    );
  }

  try {
    return NextResponse.json(
      { workshops: await reorderWorkshopPrograms(validation.data.workshopIds) },
      { status: 200, headers: NO_STORE_HEADERS },
    );
  } catch (error) {
    console.error("Admin Workshop order PATCH failed:", error);
    return NextResponse.json(
      { error: "Unable to reorder Workshops." },
      { status: 500, headers: NO_STORE_HEADERS },
    );
  }
}
