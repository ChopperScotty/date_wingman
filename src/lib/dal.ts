import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

// Data Access Layer: the authoritative auth boundary. The proxy and the
// (app) layout are conveniences only — every protected page and Server
// Action must call into this module.

// getUser() validates the session against the Supabase Auth server (never
// trust getSession() server-side). cache() dedupes calls within one render
// pass, so layout + page cost a single Auth round trip.
export const getUser = cache(async (): Promise<User | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

export const verifySession = cache(async (): Promise<{ user: User }> => {
  const user = await getUser();
  if (!user) {
    // redirect() throws NEXT_REDIRECT — deliberately not inside try/catch.
    redirect("/login");
  }
  return { user };
});
