create table if not exists public.site_config (
  key text primary key,
  value text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  message text not null,
  status text not null default 'unread' check (status in ('unread', 'read', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_site_config_updated_at on public.site_config;

create trigger set_site_config_updated_at
before update on public.site_config
for each row execute function public.set_updated_at();

drop trigger if exists set_contact_submissions_updated_at on public.contact_submissions;

create trigger set_contact_submissions_updated_at
before update on public.contact_submissions
for each row execute function public.set_updated_at();

alter table public.site_config enable row level security;
alter table public.contact_submissions enable row level security;

drop policy if exists "Public read site_config" on public.site_config;

create policy "Public read site_config"
on public.site_config for select
to anon, authenticated
using (true);

drop policy if exists "Admins manage site_config" on public.site_config;

create policy "Admins manage site_config"
on public.site_config for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Anyone can create contact submissions" on public.contact_submissions;

create policy "Anyone can create contact submissions"
on public.contact_submissions for insert
to anon, authenticated
with check (status = 'unread');

drop policy if exists "Admins read contact submissions" on public.contact_submissions;

create policy "Admins read contact submissions"
on public.contact_submissions for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins update contact submissions" on public.contact_submissions;

create policy "Admins update contact submissions"
on public.contact_submissions for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins delete contact submissions" on public.contact_submissions;

create policy "Admins delete contact submissions"
on public.contact_submissions for delete
to authenticated
using (public.is_admin());

insert into public.site_config (key, value) values
  ('about_bio', 'I''m Sai Ganesh, a self-taught full-stack product engineer based in Andhra Pradesh, India.\n\nI founded Versa Sync Studios and have spent the last 3+ years building and shipping real SaaS products for clients across fintech, HRMS, e-commerce, and legal tech.\n\nI work across the entire stack — from database architecture and RLS policies to React SPAs, Flutter mobile apps, and production deployments. I learn how each layer of technology works rather than just mastering specific tools.\n\nI''m currently looking for a full-time remote engineering role with an international company where I can go deep on one product and team.'),
  ('how_i_work', '["I document architecture decisions before writing a single line of code", "I build with handover in mind — readable, structured, and commented", "I have maintained production systems for clients over 12+ months", "I treat every client project like it is my own product"]'),
  ('looking_for', 'I am transitioning from freelance to a full-time remote engineering role. I want to go deep on one product and one team rather than across many clients. Open to React, Supabase, Flutter, or full-stack TypeScript roles at startups and scale-ups.'),
  ('email', 'hello@saiganesh.online'),
  ('linkedin_url', 'https://linkedin.com/in/your-handle'),
  ('github_url', 'https://github.com/Versa-Sync-Studios')
on conflict (key) do update set
  value = excluded.value,
  updated_at = now();
