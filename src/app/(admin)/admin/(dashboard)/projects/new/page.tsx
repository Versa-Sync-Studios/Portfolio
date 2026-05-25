import { ProjectForm } from "@/components/admin/ProjectForm";
import { createClient } from "@/lib/supabase/server";
import type { TechStackItem } from "@/lib/types";

export default async function AdminNewProjectPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tech_stack_items")
    .select("*")
    .order("sort_order", { ascending: true });
  const allTechStack = (data ?? []) as TechStackItem[];

  return <ProjectForm project={null} allTechStack={allTechStack} />;
}
