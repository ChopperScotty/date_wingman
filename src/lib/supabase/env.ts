export function getSupabaseEnv(): { url: string; anonKey: string } {
  // Literal property access is required: Next.js inlines NEXT_PUBLIC_ values
  // at build time and does not resolve dynamic process.env lookups.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable.");
  }
  if (!anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable."
    );
  }

  return { url, anonKey };
}
