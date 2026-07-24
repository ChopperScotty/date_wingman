"use client";

import { useActionState } from "react";
import { login } from "./actions";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, undefined);

  return (
    <form action={formAction} className="mt-8 flex flex-col gap-5">
      <label className="flex flex-col gap-2 text-sm text-slate-300">
        Email
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-rose-400"
        />
      </label>

      <label className="flex flex-col gap-2 text-sm text-slate-300">
        Password
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-rose-400"
        />
      </label>

      <div role="alert" aria-live="polite">
        {state?.error ? (
          <p className="text-sm text-red-400">{state.error}</p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-xl bg-rose-500 px-4 py-3 font-medium text-white transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
