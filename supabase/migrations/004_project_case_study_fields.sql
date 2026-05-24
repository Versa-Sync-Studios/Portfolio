alter table public.projects
add column if not exists status text,
add column if not exists video_url text,
add column if not exists problem text,
add column if not exists my_role text,
add column if not exists solution text,
add column if not exists outcome text,
add column if not exists screenshots jsonb not null default '[]'::jsonb;

alter table public.projects
add constraint projects_screenshots_array_check
check (jsonb_typeof(screenshots) = 'array');
