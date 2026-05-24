# AGENTS.md — Codex Instructions for This Repository

## Project Identity
This is [PORTFOLIO_SITE or PORTFOLIO_ADMIN] — part of the Versa Sync Studios 
portfolio system. The owner is a Full-Stack Product Engineer targeting 
full-time remote roles. Code quality, TypeScript strictness, and visual 
polish are non-negotiable.

## Repository Overview
See README.md for full setup. Key directories:
- `src/` — all application source code
- `src/components/` — reusable UI components
- `src/lib/supabase/` — Supabase client instances (never create ad-hoc clients)
- `supabase/migrations/` — all schema changes go here as migration files

## Architecture Rules — Read Before Every Task

### TypeScript
- Strict mode is ON. Zero `any` types. Zero TypeScript errors before task is done.
- All Supabase table shapes are defined in `src/lib/types.ts`. 
  Use them everywhere. Do not redeclare inline types for DB rows.
- Prefer `type` over `interface` for data shapes.

### Supabase
- NEVER create a new Supabase client inline inside a component or function.
  Always import from `src/lib/supabase/client.ts` (browser) or 
  `src/lib/supabase/server.ts` (server, Next.js only).
- NEVER expose SUPABASE_SERVICE_ROLE_KEY to the browser.
  Service role operations must go through Server Actions or API Routes.
- All schema changes must be written as migration SQL files in 
  `supabase/migrations/`. Never use the Supabase dashboard to change schema 
  without a corresponding migration file.
- RLS is enabled on all tables. If you add a new table, add RLS policies 
  in the migration file immediately.

### Styling
- Tailwind CSS v4 with CSS variables defined in `globals.css`.
- NEVER hardcode hex colour values in component files.
  Use CSS variable references: `bg-[var(--color-accent)]` or 
  define a Tailwind alias in the theme config.
- All text must meet WCAG AA contrast ratio against its background.
- Fonts: Syne for headings (`font-display`), Inter for body (`font-sans`), 
  JetBrains Mono for code/badges (`font-mono`).

### Component Rules
- Components are single-responsibility. A component that fetches data 
  should not also handle layout.
- No component imports Supabase directly (Portfolio Site).
  Data flows in via props or from Server Components above.
- For the Admin App: hooks handle Supabase calls; components receive data as props.

### File Creation
- Before creating a new file, check if a similar component already exists.
- New UI primitives go in `src/components/ui/`.
- New page-level sections go in `src/components/sections/` (portfolio) 
  or as page components (admin).
- Do not create utility functions that duplicate what `src/lib/utils.ts` already provides.

## Task Completion Checklist
Before marking any task complete:
- [ ] TypeScript strict mode passes — run `tsc --noEmit`
- [ ] No console.error or console.warn in production code paths
- [ ] All new Supabase tables have a migration file + RLS policies
- [ ] New environment variables documented in README.md
- [ ] Mobile breakpoint tested at 375px and 768px
- [ ] No hardcoded colours or font stacks

## Commit Message Format
feat: short description of what was added
fix: short description of what was fixed
chore: dependency or config change

## Do Not Touch
- `supabase/migrations/` — only append new files, never edit existing ones
- `.env.local` / `.env` — never commit these
- `src/lib/types.ts` — edit only when schema changes; keep in sync with DB

## Context for New Tasks
If you are given a new task and are unsure which component or file to edit:
1. Start by reading `README.md`
2. Read `src/lib/types.ts` to understand the data model
3. Read the relevant page file before touching its child components
4. Check `src/lib/supabase/` before creating any data fetching logic

## Stack Summary
Portfolio Site: Next.js 14 · TypeScript · Tailwind v4 · Supabase · Framer Motion · Vercel
Admin App: React 18 · Vite · TypeScript · Tailwind v4 · shadcn/ui · React Hook Form · Zustand · Supabase