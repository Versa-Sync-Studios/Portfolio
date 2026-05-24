alter table public.projects
add column if not exists domain text,
add column if not exists tagline text,
add column if not exists cover_image_url text,
add column if not exists featured_order integer not null default 0;

update public.projects
set
  tagline = coalesce(tagline, summary),
  cover_image_url = coalesce(cover_image_url, image_url),
  featured_order = coalesce(featured_order, sort_order)
where tagline is null
  or cover_image_url is null
  or featured_order is distinct from sort_order;

create table public.resume_meta (
  id uuid primary key default gen_random_uuid(),
  label text not null default 'Primary resume',
  file_url text not null,
  active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tech_stack_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (
    category in ('frontend', 'backend', 'mobile', 'database', 'no_code', 'tools')
  ),
  icon_url text,
  sort_order integer not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (name, category)
);

create table public.client_testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  client_name text not null,
  client_title text,
  client_company text,
  avatar_url text,
  visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_resume_meta_updated_at
before update on public.resume_meta
for each row execute function public.set_updated_at();

create trigger set_tech_stack_items_updated_at
before update on public.tech_stack_items
for each row execute function public.set_updated_at();

create trigger set_client_testimonials_updated_at
before update on public.client_testimonials
for each row execute function public.set_updated_at();

alter table public.resume_meta enable row level security;
alter table public.tech_stack_items enable row level security;
alter table public.client_testimonials enable row level security;

create policy "Active resume is readable by everyone"
on public.resume_meta for select
to anon, authenticated
using (active = true or public.is_admin());

create policy "Admins manage resume metadata"
on public.resume_meta for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Visible tech stack items are readable by everyone"
on public.tech_stack_items for select
to anon, authenticated
using (visible = true or public.is_admin());

create policy "Admins manage tech stack items"
on public.tech_stack_items for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Visible client testimonials are readable by everyone"
on public.client_testimonials for select
to anon, authenticated
using (visible = true or public.is_admin());

create policy "Admins manage client testimonials"
on public.client_testimonials for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create unique index resume_meta_single_active_idx
on public.resume_meta (active)
where active = true;

create index projects_featured_order_idx
on public.projects (featured, featured_order, created_at desc);

create index tech_stack_items_visible_sort_idx
on public.tech_stack_items (visible, category, sort_order, name);

create index client_testimonials_visible_sort_idx
on public.client_testimonials (visible, sort_order, created_at desc);
