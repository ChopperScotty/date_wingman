import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/dal";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign in — Date Wingman",
};

export default async function LoginPage() {
  // Authoritative check (Auth server), not just a JWT check: if the user
  // record is gone, getUser() is null and the form renders — no loop.
  const user = await getUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-8 text-white">
      <div className="w-full max-w-sm">
        <p className="text-sm uppercase tracking-[0.3em] text-rose-400">
          Date Wingman
        </p>
        <h1 className="mt-3 text-3xl font-semibold">Sign in</h1>
        <LoginForm />
      </div>
    </main>
  );
}
