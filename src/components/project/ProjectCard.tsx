import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/types";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const imageSrc = project.cover_image_url ?? project.image_url ?? "/window.svg";
  const tagline = project.tagline ?? project.summary;
  const domain = project.domain ?? "Product";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface transition hover:translate-y-1 hover:border-accent hover:shadow-card-accent">
      <div className="relative aspect-video w-full overflow-hidden bg-surface-subtle">
        <Image
          src={imageSrc}
          alt={`${project.title} cover`}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-4">
          <span className="rounded bg-surface-subtle px-2 py-1 font-mono text-xs text-accent">
            {domain}
          </span>
        </div>

        <h3 className="font-display text-xl font-semibold text-text-primary">
          {project.title}
        </h3>
        <p className="mt-2 text-sm leading-6 text-text-secondary">{tagline}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.tech_stack.slice(0, 4).map((item) => (
            <span
              key={item}
              className="rounded-full border border-border px-2 py-0.5 font-mono text-xs text-text-muted"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between gap-4 border-t border-border pt-4 text-sm">
          {project.live_url ? (
            <a
              href={project.live_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-text-secondary transition-colors hover:text-accent"
            >
              Live
              <ExternalLink aria-hidden="true" className="h-4 w-4" />
            </a>
          ) : (
            <span className="text-text-muted">Live soon</span>
          )}
          <Link
            href={`/work/${project.slug}`}
            className="font-semibold text-accent transition-colors hover:text-text-primary"
          >
            View Case Study
          </Link>
        </div>
      </div>
    </article>
  );
}
