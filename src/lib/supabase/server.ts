import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseEnv } from "./env";

// Per-request Supabase client for Server Components, Server Actions, and
// Route Handlers. Never store the result at module level: the client wraps
// the current request's cookies and must not be shared across requests.
export async function createClient() {
  const { url, anonKey } = getSupabaseEnv();
  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // setAll was called from a Server Component render, which cannot
          // write cookies. Safe to ignore: src/proxy.ts refreshes sessions
          // before any matched request reaches a Server Component.
        }
      },
    },
  });
}
