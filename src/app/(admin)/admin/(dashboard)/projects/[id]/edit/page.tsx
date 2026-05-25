import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { createClient } from "@/lib/supabase/server";
import type { Project, TechStackItem } from "@/lib/types";

type AdminEditProjectPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminEditProjectPage({
  params,
}: AdminEditProjectPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: project }, { data: techStack }] = await Promise.all([
    supabase
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
      .eq("id", id)
      .single(),
    supabase
      .from("tech_stack_items")
      .select("*")
      .order("sort_order", { ascending: true }),
  ]);

  if (!project) {
    notFound();
  }

  return (
    <ProjectForm
      project={project as Project}
      allTechStack={(techStack ?? []) as TechStackItem[]}
    />
  );
}
