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

## Admin Section (app/(admin)/*)

The admin is a protected Next.js App Router route group inside the 
portfolio site. It shares the same Supabase project, types, and 
environment variables as the public site.

### Admin UI Design Philosophy
Think Vercel dashboard, Linear, Supabase dashboard.
Flat, functional, data-dense. NOT decorative.

Rules:
- Base font size is text-sm everywhere in admin
- Tight spacing: p-3 or p-4 on cards, not p-6 or p-8
- Tables over cards wherever data is list-like
- Borders (border border-border) not box shadows
- No page heroes, no eyebrow text, no large display headings
- Page title: text-lg font-semibold text-text-primary only
- Accent colour ONLY on: active nav, primary CTA, success states
- No gradients, no glassmorphism, no animate-everything
- Colour on badges only where it carries meaning:
    live → text-accent
    in_progress → text-warning  
    archived → text-text-muted
    unread → text-accent

### Admin Route Structure
app/
  (admin)/
    layout.tsx          ← auth check + admin shell layout
    middleware check via src/middleware.ts
    projects/
      page.tsx          ← projects list
      new/
        page.tsx        ← create project form
      [id]/
        edit/
          page.tsx      ← edit project form
    tech-stack/
      page.tsx
    testimonials/
      page.tsx
    contact/
      page.tsx
    resume/
      page.tsx
    settings/
      page.tsx
    mfa/
      setup/
        page.tsx        ← TOTP setup page
      verify/
        page.tsx        ← TOTP verify after login

### Admin Auth Flow
1. User hits any /admin/* route
2. middleware.ts checks Supabase session
3. No session → redirect to /admin/login
4. Session exists but MFA not verified → redirect to /admin/mfa/verify
5. Session + MFA verified → allow through to admin

### Admin-specific components live at:
src/components/admin/   ← admin UI primitives
  AdminLayout.tsx       ← sidebar + main content shell
  AdminSidebar.tsx      ← nav sidebar
  DataTable.tsx         ← reusable table component
  RichTextEditor.tsx    ← TipTap editor (dark themed)
  FileUpload.tsx        ← Supabase Storage upload with progress

### Shared with public site:
- src/lib/supabase/client.ts and server.ts
- src/lib/types.ts
- CSS variables and Tailwind config
- Supabase environment variables

### Additional dependencies needed for admin:
npm install @tiptap/react @tiptap/pm @tiptap/starter-kit 
@tiptap/extension-placeholder react-hot-toast
npm install @supabase/auth-helpers-nextjs