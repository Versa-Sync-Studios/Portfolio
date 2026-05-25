import {
  ExternalLink,
  FolderOpen,
  Image as ImageIcon,
  Pencil,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { DeleteProjectButton } from "@/components/admin/DeleteProjectButton";
import { ToggleCell } from "@/components/admin/ToggleCell";
import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
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
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div>
        <h1 className="text-lg font-semibold text-text-primary">Projects</h1>
        <div className="mt-6 rounded-md border border-border bg-surface p-3">
          <p className="text-sm text-error">Could not load projects.</p>
          <p className="mt-1 text-xs text-text-muted">{error.message}</p>
        </div>
      </div>
    );
  }

  const projects = (data ?? []) as Project[];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-text-primary">Projects</h1>
        <Link
          href="/admin/projects/new"
          className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-bg"
        >
          New Project
        </Link>
      </div>

      <div className="mb-6 flex gap-3">
        <StatCard label="Total" value={projects.length} />
        <StatCard
          label="Live"
          value={projects.filter((project) => project.status === "live").length}
        />
        <StatCard
          label="Featured"
          value={projects.filter((project) => project.featured).length}
        />
        <StatCard
          label="Drafts"
          value={
            projects.filter((project) => project.is_published === false).length
          }
        />
      </div>

      {projects.length > 0 ? (
        <div className="overflow-hidden rounded-md border border-border">
          <table className="w-full">
            <thead className="border-b border-border bg-surface">
              <tr>
                <TableHead>Cover</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Domain</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Actions</TableHead>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr
                  key={project.id}
                  className="border-b border-border transition-colors last:border-0 hover:bg-surface/50"
                >
                  <td className="px-3 py-3">
                    {project.cover_image_url ? (
                      <img
                        src={project.cover_image_url}
                        alt=""
                        className="h-10 w-10 rounded object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded border border-border bg-surface">
                        <ImageIcon
                          className="text-text-muted"
                          size={16}
                          aria-hidden="true"
                        />
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <p className="text-sm font-medium text-text-primary">
                      {project.title}
                    </p>
                    <p className="font-mono text-xs text-text-muted">
                      {project.slug}
                    </p>
                  </td>
                  <td className="px-3 py-3 text-xs text-text-secondary">
                    {project.domain ? (
                      project.domain
                    ) : (
                      <span className="text-text-muted">&mdash;</span>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <StatusBadge status={project.status} />
                  </td>
                  <td className="px-3 py-3">
                    <ToggleCell
                      field="is_published"
                      initialValue={project.is_published}
                      projectId={project.id}
                    />
                  </td>
                  <td className="px-3 py-3">
                    <ToggleCell
                      field="featured"
                      initialValue={project.featured}
                      projectId={project.id}
                    />
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex gap-1">
                      {project.live_url ? (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noreferrer"
                          title="View live"
                          className="rounded p-1.5 text-text-muted transition-colors hover:bg-surface hover:text-text-primary"
                        >
                          <ExternalLink size={16} aria-hidden="true" />
                        </a>
                      ) : null}
                      <Link
                        href={`/admin/projects/${project.id}/edit`}
                        title="Edit project"
                        className="rounded p-1.5 text-text-muted transition-colors hover:bg-surface hover:text-text-primary"
                      >
                        <Pencil size={16} aria-hidden="true" />
                      </Link>
                      <DeleteProjectButton
                        projectId={project.id}
                        title={project.title}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="py-16 text-center">
          <FolderOpen
            className="mx-auto mb-3 text-text-muted"
            size={32}
            aria-hidden="true"
          />
          <p className="text-sm text-text-muted">No projects yet</p>
          <Link
            href="/admin/projects/new"
            className="mt-2 inline-block text-sm text-accent hover:underline"
          >
            Add your first project
          </Link>
        </div>
      )}
    </div>
  );
}

type StatCardProps = {
  label: string;
  value: number;
};

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="flex-1 rounded-md border border-border bg-surface p-3">
      <p className="text-xl font-semibold text-text-primary">{value}</p>
      <p className="mt-0.5 text-xs text-text-muted">{label}</p>
    </div>
  );
}

function TableHead({ children }: { children: ReactNode }) {
  return (
    <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
      {children}
    </th>
  );
}

function StatusBadge({ status }: { status: string | null }) {
  const normalizedStatus = status ?? "archived";
  const className =
    normalizedStatus === "live"
      ? "bg-accent/10 text-accent"
      : normalizedStatus === "in_progress"
        ? "bg-warning/10 text-warning"
        : "bg-surface text-text-muted";

  return (
    <span
      className={`rounded-full border border-current/20 px-2 py-0.5 font-mono text-xs ${className}`}
    >
      {normalizedStatus}
    </span>
  );
}
