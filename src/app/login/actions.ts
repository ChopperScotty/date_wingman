"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type LoginState = { error: string } | undefined;

export async function login(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = formData.get("email");
  const password = formData.get("password");

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    email.trim() === "" ||
    password === ""
  ) {
    return { error: "Email and password are required." };
  }

  const normalizedEmail = email.trim();

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: normalizedEmail,
    password,
  });

  if (error) {
    // Generic on purpose: never serialize the AuthError or reveal whether
    // the email exists.
    return { error: "Invalid email or password." };
  }

  // Outside try/catch: redirect() throws NEXT_REDIRECT.
  redirect("/dashboard");
}
