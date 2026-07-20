import { supabase } from "@/lib/supabase";

export default async function Home() {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, name")
    .limit(1);

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm uppercase tracking-[0.3em] text-rose-400">
          Date Wingman
        </p>

        <h1 className="mt-3 text-4xl font-semibold">
          Supabase connection test
        </h1>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          {error ? (
            <>
              <h2 className="text-xl font-medium text-red-400">
                Connection failed
              </h2>
              <pre className="mt-4 overflow-auto whitespace-pre-wrap text-sm text-red-200">
                {JSON.stringify(error, null, 2)}
              </pre>
            </>
          ) : (
            <>
              <h2 className="text-xl font-medium text-emerald-400">
                Connected successfully
              </h2>
              <p className="mt-3 text-slate-300">
                The app reached your Supabase profiles table.
              </p>
              <pre className="mt-4 overflow-auto rounded-xl bg-black/30 p-4 text-sm text-slate-300">
                {JSON.stringify(data, null, 2)}
              </pre>
            </>
          )}
        </div>
      </div>
    </main>
  );
}