import { NextResponse } from "next/server";

import { getCurrentAdmin } from "@/lib/admin/auth";
import { updateWorkshopProgram } from "@/lib/workshops/configuration-server";
import {
  isWorkshopSlotId,
  validateWorkshopProgramUpdate,
} from "@/lib/workshops/configuration-validation";

const NO_STORE_HEADERS = { "Cache-Control": "no-store" };
type RouteContext = { params: Promise<{ workshopId: string }> };

function unauthorizedResponse() {
  return NextResponse.json(
    { error: "Unauthorized." },
    { status: 401, headers: NO_STORE_HEADERS },
  );
}

export async function PATCH(request: Request, context: RouteContext) {
  const admin = await getCurrentAdmin();
  if (!admin) return unauthorizedResponse();

  const { workshopId } = await context.params;
  if (!isWorkshopSlotId(workshopId)) {
    return NextResponse.json(
      { error: "Invalid Workshop ID." },
      { status: 400, headers: NO_STORE_HEADERS },
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

  const validation = validateWorkshopProgramUpdate(body);
  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error },
      { status: 400, headers: NO_STORE_HEADERS },
    );
  }

  try {
    return NextResponse.json(
      await updateWorkshopProgram(workshopId, validation.data),
      { status: 200, headers: NO_STORE_HEADERS },
    );
  } catch (error) {
    console.error("Admin Workshop PATCH failed:", error);
    return NextResponse.json(
      { error: "Unable to update Workshop." },
      { status: 500, headers: NO_STORE_HEADERS },
    );
  }
}
