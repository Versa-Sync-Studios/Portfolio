alter table public.projects
  drop column if exists summary,
  drop column if exists description,
  drop column if exists impact,
  drop column if exists image_url,
  drop column if exists case_study_url;

alter table public.projects
  drop constraint if exists projects_status_check;

alter table public.projects
  add constraint projects_status_check
  check (status in ('live', 'in_progress', 'archived'));
