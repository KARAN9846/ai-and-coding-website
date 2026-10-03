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

    return NextResponse.json(configuration, {
      status: 200,
      headers: NO_STORE_HEADERS,
    });
  } catch (error) {
    console.error("Workshop public configuration GET failed:", error);

    return NextResponse.json(
      { error: "Workshop configuration is temporarily unavailable." },
      {
        status: 503,
        headers: NO_STORE_HEADERS,
      },
    );
  }
}
