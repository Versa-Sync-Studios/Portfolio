create table public.project_tech_stack (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  tech_stack_item_id uuid not null references public.tech_stack_items(id) on delete cascade,
  sort_order integer not null default 0,
  unique (project_id, tech_stack_item_id)
);

alter table public.project_tech_stack enable row level security;

create policy "Public read project_tech_stack"
on public.project_tech_stack for select
to anon
using (true);

create policy "Authenticated write project_tech_stack"
on public.project_tech_stack for all
to authenticated
using (true);

alter table public.projects drop column if exists tech_stack;
