# AGENTS.md

## Project overview
- This repository is a small Next.js 16 application using the App Router and TypeScript.
- The main application code lives under [src/app](src/app) and shared utilities under [src/lib](src/lib).
- Styling is Tailwind-based through the global stylesheet in [src/app/globals.css](src/app/globals.css), so keep UI changes consistent with the existing dark, minimal look.

## Working conventions
- Prefer the App Router patterns already used in [src/app/page.tsx](src/app/page.tsx) and [src/app/layout.tsx](src/app/layout.tsx).
- Use the @/* path alias for imports.
- Keep components small and colocated near the route that uses them unless there is a clear reason to extract shared logic.
- For Supabase access, use the clients under [src/lib/supabase](src/lib/supabase) instead of creating new clients inline in pages or components:
  - browser (client component) code uses [src/lib/supabase/client.ts](src/lib/supabase/client.ts);
  - server code (Server Components, Server Actions, Route Handlers) uses a fresh per-request client from [src/lib/supabase/server.ts](src/lib/supabase/server.ts);
  - Proxy session refresh uses [src/lib/supabase/proxy.ts](src/lib/supabase/proxy.ts), wired up in [src/proxy.ts](src/proxy.ts).
- Protected data access belongs behind the server-only DAL in [src/lib/dal.ts](src/lib/dal.ts) (getUser / verifySession). Every protected page and protected Server Action calls the DAL; the proxy and layouts are not the auth boundary.
- Proxy redirect logic uses explicit protected URL prefixes (PROTECTED_ROUTE_PREFIXES in [src/lib/supabase/proxy.ts](src/lib/supabase/proxy.ts)). Unknown or public routes are never blanket-redirected to login — they fall through to the router. When introducing a new protected top-level route, add its URL prefix to that list; the DAL check in the page/action is still required.
- Default to Server Components unless the feature explicitly requires client-side interactivity.
- Keep changes focused and minimal; avoid introducing new libraries or architecture patterns unless the task clearly requires them.

## Commands
- npm run dev — start the development server
- npm run lint — run ESLint
- npm run build — create a production build

## Environment and integrations
- Supabase configuration is read from NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.
- If Supabase integration changes, keep the app resilient to missing or invalid environment values.

## Notes for agents
- This app runs Next.js 16 — conventions may differ from older examples and training data (e.g. proxy.ts instead of middleware.ts, async cookies()/headers()). Consult the installed docs in node_modules/next/dist/docs/ before assuming.
- Start from the existing structure in [src/app](src/app) and [src/lib/supabase](src/lib/supabase) before introducing new abstractions.
- Check [README.md](README.md) for setup context before adding new instructions or workflow steps.
- Favor extending existing patterns over inventing new ones.
