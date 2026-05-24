"use client";

import { useMemo, useState } from "react";
import { ProjectCard } from "@/components/project/ProjectCard";
import type { Project } from "@/lib/types";

const filters = [
  "All",
  "Featured",
  "Fintech",
  "HRMS",
  "E-commerce",
  "Mobile",
  "Tools",
] as const;

type ProjectFilter = (typeof filters)[number];

type ProjectFiltersProps = {
  projects: Project[];
};

function normalizeDomain(domain: string | null) {
  return domain?.trim().toLowerCase() ?? "";
}

export function ProjectFilters({ projects }: ProjectFiltersProps) {
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>("All");

  const filteredProjects = useMemo(() => {
    if (activeFilter === "All") {
      return projects;
    }

    if (activeFilter === "Featured") {
      return projects.filter((project) => project.featured);
    }

    const selectedDomain = activeFilter.toLowerCase();

    return projects.filter(
      (project) => normalizeDomain(project.domain) === selectedDomain,
    );
  }, [activeFilter, projects]);

  return (
    <div className="mt-10">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {filters.map((filter) => {
          const isActive = activeFilter === filter;

          return (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`shrink-0 rounded-lg px-4 py-2 font-sans text-sm transition-colors ${
                isActive
                  ? "bg-accent text-bg"
                  : "text-text-muted hover:bg-surface hover:text-text-primary"
              }`}
            >
              {filter}
            </button>
          );
        })}
      </div>

      {filteredProjects.length > 0 ? (
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <p className="mt-8 text-sm text-text-muted">
          No projects in this category yet.
        </p>
      )}
    </div>
  );
}
