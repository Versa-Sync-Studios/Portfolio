create policy "Authenticated read project_tech_stack"
on public.project_tech_stack for select
to authenticated
using (true);
