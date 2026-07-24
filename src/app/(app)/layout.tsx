import { logout } from "./actions";

// UI chrome only — this layout is NOT the auth boundary. Layouts do not
// re-render on every navigation, so each protected page must call
// verifySession() from src/lib/dal.ts itself. Keep user data out of here.
export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-8 py-4">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
            Date Wingman
          </p>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-300 transition hover:border-rose-400 hover:text-white"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>
      <div className="flex-1">{children}</div>
    </div>
  );
}
