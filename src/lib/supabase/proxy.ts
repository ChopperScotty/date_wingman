import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseEnv } from "./env";

// Explicit protected URL prefixes. Only these are optimistically gated
// here; unknown/public routes fall through to the Next.js router (404 for
// nonexistent paths). Real enforcement lives in the DAL (src/lib/dal.ts).
// When a new protected top-level route is added, list its prefix here.
const PROTECTED_ROUTE_PREFIXES = ["/dashboard"];

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export async function updateSession(
  request: NextRequest
): Promise<NextResponse> {
  const { url, anonKey } = getSupabaseEnv();

  let supabaseResponse = NextResponse.next({ request });
  // Headers @supabase/ssr requires on any response that sets auth cookies
  // (Cache-Control etc.), captured so redirects can carry them too.
  let authHeaders: Record<string, string> = {};

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        authHeaders = headers;
        // Write refreshed tokens onto the request so the server render
        // behind this same request sees the new session, not the stale one.
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        // Write them onto the response so the browser stores them.
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
        // Cache-Control/Expires/Pragma from @supabase/ssr: responses that
        // set auth cookies must never be cached by a CDN or proxy.
        Object.entries(headers).forEach(([key, value]) =>
          supabaseResponse.headers.set(key, value)
        );
      },
    },
  });

  // IMPORTANT: do not run other logic between creating the client and this
  // call. getClaims() verifies the JWT and refreshes/synchronizes the auth
  // cookies; interleaving code here causes hard-to-debug random logouts.
  const { data } = await supabase.auth.getClaims();
  const isAuthenticated = Boolean(data?.claims);

  const { pathname } = request.nextUrl;
  const isGetLike = request.method === "GET" || request.method === "HEAD";

  // Optimistic redirect for explicitly protected routes only, and only for
  // document-style requests. POSTs (Server Actions) fall through so the DAL
  // check inside each action can respond with proper action semantics, and
  // unknown routes fall through so the router can 404 them.
  if (!isAuthenticated && isGetLike && isProtectedRoute(pathname)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.search = "";
    return withRefreshedCookies(
      NextResponse.redirect(redirectUrl),
      supabaseResponse,
      authHeaders
    );
  }

  // Authenticated visitors on /login are deliberately NOT redirected here.
  // The login page's DAL getUser() check handles that: a still-valid JWT
  // whose user no longer exists would otherwise loop /login <-> /dashboard.

  return supabaseResponse;
}

// If getClaims() just rotated the tokens, the redirect must carry the new
// cookies or the browser keeps a consumed refresh token (forced logout).
// Only the auth cookies and the @supabase/ssr-supplied headers are copied —
// never Next's internal x-middleware-* control headers.
function withRefreshedCookies(
  target: NextResponse,
  source: NextResponse,
  authHeaders: Record<string, string>
): NextResponse {
  source.cookies.getAll().forEach((cookie) => target.cookies.set(cookie));
  Object.entries(authHeaders).forEach(([key, value]) =>
    target.headers.set(key, value)
  );
  return target;
}
