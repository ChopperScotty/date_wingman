import type { Metadata } from "next";
import { verifySession } from "@/lib/dal";

export const metadata: Metadata = {
  title: "Dashboard — Date Wingman",
};

export default async function DashboardPage() {
  // The real guard for this route — the proxy check is optimistic only.
  const { user } = await verifySession();

  return (
    <main className="mx-auto w-full max-w-5xl px-8 py-10">
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-slate-400">Signed in as {user.email}</p>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
        <p className="text-slate-300">
          Profiles, timeline, and media tools arrive in upcoming sprints.
        </p>
      </div>
    </main>
  );
}
