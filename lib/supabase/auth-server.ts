import "server-only";

import { createServerClient } from "@supabase/ssr";
import { isIP } from "node:net";
import { cookies } from "next/headers";

function getTrustedClientIp(request: Request) {
  if (process.env.VERCEL !== "1") {
    return "127.0.0.1";
  }

  const forwardedFor = request.headers.get("x-vercel-forwarded-for")?.trim();

  return forwardedFor && isIP(forwardedFor) ? forwardedFor : "127.0.0.1";
}

export async function createAuthClient(request: Request) {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseSecretKey) {
    throw new Error("Supabase Auth environment variables are not configured.");
  }

  return createServerClient(supabaseUrl, supabaseSecretKey, {
    global: {
      headers: {
        // Vercel sets this header itself, so clients cannot spoof it. In local
        // development all requests intentionally share the loopback address.
        "sb-forwarded-for": getTrustedClientIp(request),
      },
    },

    cookies: {
      getAll() {
        return cookieStore.getAll();
      },

      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          /*
           * Cookie writes may not be available
           * from every Server Component context.
           */
        }
      },
    },
  });
}
