# AGENTS.md

## Project overview
- This repository is a small Next.js 16 application using the App Router and TypeScript.
- The main application code lives under [src/app](src/app) and shared utilities under [src/lib](src/lib).
- Styling is Tailwind-based through the global stylesheet in [src/app/globals.css](src/app/globals.css), so keep UI changes consistent with the existing dark, minimal look.

## Working conventions
- Prefer the App Router patterns already used in [src/app/page.tsx](src/app/page.tsx) and [src/app/layout.tsx](src/app/layout.tsx).
- Use the @/* path alias for imports.
- Keep components small and colocated near the route that uses them unless there is a clear reason to extract shared logic.
- For Supabase access, centralize usage in [src/lib/supabase.ts](src/lib/supabase.ts) instead of creating new clients inline in pages or components.
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
- Start from the existing structure in [src/app/page.tsx](src/app/page.tsx) and [src/lib/supabase.ts](src/lib/supabase.ts) before introducing new abstractions.
- Check [README.md](README.md) for setup context before adding new instructions or workflow steps.
- Favor extending existing patterns over inventing new ones.
