"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function logout(): Promise<never> {
  const supabase = await createClient();
  // scope: "local" signs out only the current browser/device session, not
  // every session for the user. Ignore the result: signing out without a
  // session is harmless, and no error internals should ever reach the client.
  await supabase.auth.signOut({ scope: "local" });
  redirect("/login");
}
