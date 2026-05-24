create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin';
$$;

create table public.profile (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  role text not null,
  headline text not null,
  bio text not null,
  avatar_url text,
  resume_url text,
  location text,
  email text not null,
  github_url text,
  linkedin_url text,
  website_url text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text not null,
  description text not null,
  impact text,
  image_url text,
  repo_url text,
  live_url text,
  case_study_url text,
  tech_stack text[] not null default '{}',
  featured boolean not null default false,
  is_published boolean not null default false,
  sort_order integer not null default 0,
  started_at date,
  completed_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  proficiency smallint not null default 3 check (proficiency between 1 and 5),
  icon_name text,
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (name, category)
);

create table public.experience (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  role text not null,
  location text,
  start_date date not null,
  end_date date,
  is_current boolean not null default false,
  summary text not null,
  highlights text[] not null default '{}',
  tech_stack text[] not null default '{}',
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint experience_end_after_start check (end_date is null or end_date >= start_date)
);

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  author_role text,
  author_company text,
  author_avatar_url text,
  quote text not null,
  source_url text,
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  subject text,
  message text not null,
  source text not null default 'portfolio',
  status text not null default 'new' check (status in ('new', 'read', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_profile_updated_at
before update on public.profile
for each row execute function public.set_updated_at();

create trigger set_projects_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

create trigger set_skills_updated_at
before update on public.skills
for each row execute function public.set_updated_at();

create trigger set_experience_updated_at
before update on public.experience
for each row execute function public.set_updated_at();

create trigger set_testimonials_updated_at
before update on public.testimonials
for each row execute function public.set_updated_at();

create trigger set_contact_messages_updated_at
before update on public.contact_messages
for each row execute function public.set_updated_at();

alter table public.profile enable row level security;
alter table public.projects enable row level security;
alter table public.skills enable row level security;
alter table public.experience enable row level security;
alter table public.testimonials enable row level security;
alter table public.contact_messages enable row level security;

create policy "Published profile is readable by everyone"
on public.profile for select
to anon, authenticated
using (is_published = true or public.is_admin());

create policy "Admins manage profile"
on public.profile for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Published projects are readable by everyone"
on public.projects for select
to anon, authenticated
using (is_published = true or public.is_admin());

create policy "Admins manage projects"
on public.projects for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Visible skills are readable by everyone"
on public.skills for select
to anon, authenticated
using (is_visible = true or public.is_admin());

create policy "Admins manage skills"
on public.skills for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Visible experience is readable by everyone"
on public.experience for select
to anon, authenticated
using (is_visible = true or public.is_admin());

create policy "Admins manage experience"
on public.experience for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Published testimonials are readable by everyone"
on public.testimonials for select
to anon, authenticated
using (is_published = true or public.is_admin());

create policy "Admins manage testimonials"
on public.testimonials for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Anyone can create contact messages"
on public.contact_messages for insert
to anon, authenticated
with check (status = 'new');

create policy "Admins read contact messages"
on public.contact_messages for select
to authenticated
using (public.is_admin());

create policy "Admins update contact messages"
on public.contact_messages for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins delete contact messages"
on public.contact_messages for delete
to authenticated
using (public.is_admin());

create index projects_published_sort_idx on public.projects (is_published, featured desc, sort_order, created_at desc);
create index skills_visible_sort_idx on public.skills (is_visible, category, sort_order, name);
create index experience_visible_sort_idx on public.experience (is_visible, sort_order, start_date desc);
create index testimonials_published_sort_idx on public.testimonials (is_published, sort_order, created_at desc);
create index contact_messages_status_created_idx on public.contact_messages (status, created_at desc);
