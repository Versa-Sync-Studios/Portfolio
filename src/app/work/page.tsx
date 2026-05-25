import { ProjectFilters } from "@/components/project/ProjectFilters";
import { createStaticClient } from "@/lib/supabase/server";
import type { Project } from "@/lib/types";

async function getProjects() {
  const supabase = createStaticClient();

  const { data } = await supabase
    .from("projects")
    .select(
      `
      *,
      project_tech_stack (
        id,
        project_id,
        tech_stack_item_id,
        sort_order,
        tech_stack_items (
          id,
          name,
          icon_url,
          category,
          sort_order,
          visible,
          created_at,
          updated_at
        )
      )
    `,
    )
    .order("featured_order", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false })
    .order("sort_order", {
      ascending: true,
      referencedTable: "project_tech_stack",
    });

  return (data ?? []) satisfies Project[];
}

export default async function WorkPage() {
  const projects = await getProjects();

  return (
    <main className="flex flex-1 flex-col bg-bg">
      <section className="mx-auto w-full max-w-6xl px-6 pb-20 pt-32 sm:px-8">
        <p className="font-mono text-sm uppercase tracking-widest text-accent">
          Work
        </p>
        <h1 className="mt-4 font-display text-4xl font-semibold text-text-primary">
          Things I&apos;ve Built
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-text-muted">
          Every project below is live, client-paid, and in production.
        </p>

        <ProjectFilters projects={projects} />
      </section>
    </main>
  );
}
