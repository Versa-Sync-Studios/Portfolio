# Sai Ganesh Portfolio

Next.js portfolio site for Sai Ganesh, built with TypeScript, Tailwind CSS v4,
Supabase, Framer Motion, Lucide React, and React Markdown.

## Setup

Install dependencies:

```bash
npm install
```

Create `.env.local` with:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npx tsc --noEmit
```

## Supabase

Schema migrations live in `supabase/migrations/`. The initial portfolio schema
is `001_portfolio_schema.sql` and includes RLS policies for all tables.

Supabase clients are centralized in:

- `src/lib/supabase/client.ts`
- `src/lib/supabase/server.ts`

Database row, insert, and update types live in `src/lib/types.ts`.
