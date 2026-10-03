import { NextResponse } from "next/server";

import { getWorkshopConfiguration } from "@/lib/workshops/configuration-server";
import { toPublicWorkshopConfiguration } from "@/lib/workshops/public-configuration";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store",
};

export async function GET() {
  try {
    const configuration = toPublicWorkshopConfiguration(
      await getWorkshopConfiguration(),
    );

    return NextResponse.json(
      {
        registrationOpen: configuration.registrationOpen,
        closedMessage: configuration.noRegistrationMessage,
      },
      {
        status: 200,
        headers: NO_STORE_HEADERS,
      },
    );
  } catch (error) {
    console.error("Workshop status GET failed:", error);

    return NextResponse.json(
      {
        error: "Workshop registration status is temporarily unavailable.",
      },
      {
        status: 503,
        headers: NO_STORE_HEADERS,
      },
    );
  }
}
