import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown, { type Components } from "react-markdown";
import { ScreenshotLightbox } from "@/components/project/ScreenshotLightbox";
import { createStaticClient } from "@/lib/supabase/server";
import type { Project } from "@/lib/types";

export const dynamic = "force-static";
export const dynamicParams = false;

type CaseStudyPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const markdownComponents: Components = {
  h2: ({ ...props }) => (
    <h2
      className="mt-8 font-display text-2xl font-semibold text-text-primary"
      {...props}
    />
  ),
  h3: ({ ...props }) => (
    <h3
      className="mt-6 font-display text-xl font-semibold text-text-primary"
      {...props}
    />
  ),
  p: ({ ...props }) => (
    <p className="mt-4 font-sans leading-relaxed text-text-secondary" {...props} />
  ),
  ul: ({ ...props }) => (
    <ul
      className="mt-4 list-disc space-y-2 pl-5 text-text-secondary marker:text-accent"
      {...props}
    />
  ),
  li: ({ ...props }) => <li className="pl-1 leading-relaxed" {...props} />,
  code: ({ ...props }) => (
    <code
      className="rounded bg-surface px-1 font-mono text-sm text-accent"
      {...props}
    />
  ),
};

async function getAllProjects() {
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

async function getProjectBySlug(slug: string) {
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
    .eq("slug", slug)
    .order("sort_order", {
      ascending: true,
      referencedTable: "project_tech_stack",
    })
    .maybeSingle();

  return data satisfies Project | null;
}

function getLoomEmbedUrl(url: string) {
  try {
    const parsedUrl = new URL(url);

    if (!parsedUrl.hostname.includes("loom.com")) {
      return url;
    }

    if (parsedUrl.pathname.startsWith("/embed/")) {
      return url;
    }

    const [, id] = parsedUrl.pathname.match(/^\/share\/([^/?]+)/) ?? [];

    if (!id) {
      return url;
    }

    return `https://www.loom.com/embed/${id}`;
  } catch {
    return url;
  }
}

function getAdjacentProjects(projects: Project[], slug: string) {
  const currentIndex = projects.findIndex((project) => project.slug === slug);

  if (currentIndex === -1) {
    return { nextProject: null, previousProject: null };
  }

  return {
    previousProject: projects[currentIndex - 1] ?? null,
    nextProject: projects[currentIndex + 1] ?? null,
  };
}

export async function generateStaticParams() {
  const projects = await getAllProjects();

  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found | Sai Ganesh",
    };
  }

  const description = project.tagline ?? project.summary;
  const images = project.cover_image_url ? [project.cover_image_url] : undefined;

  return {
    title: `${project.title} | Sai Ganesh`,
    description,
    openGraph: {
      title: project.title,
      description,
      images,
    },
  };
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const [project, projects] = await Promise.all([
    getProjectBySlug(slug),
    getAllProjects(),
  ]);

  if (!project) {
    notFound();
  }

  const description = project.tagline ?? project.summary;
  const coverImage = project.cover_image_url ?? project.image_url;
  const videoEmbedUrl = project.video_url ? getLoomEmbedUrl(project.video_url) : null;
  const { previousProject, nextProject } = getAdjacentProjects(projects, slug);
  const techStack = [...(project.project_tech_stack ?? [])].sort(
    (firstItem, secondItem) => firstItem.sort_order - secondItem.sort_order,
  );
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description,
    url: project.live_url,
    creator: {
      "@type": "Person",
      name: "Sai Ganesh",
    },
  };

  return (
    <main className="flex flex-1 flex-col bg-bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <article className="mx-auto w-full max-w-5xl px-6 pb-20 pt-32 sm:px-8">
        <Link
          href="/work"
          className="font-mono text-sm text-text-muted transition-colors hover:text-accent"
        >
          ← All Projects
        </Link>

        <header className="mt-8">
          <p className="font-mono text-xs text-text-muted">
            Work / {project.title}
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-text-primary md:text-5xl">
            {project.title}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-text-secondary">
            {description}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {project.domain ? (
              <span className="rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs text-text-muted">
                {project.domain}
              </span>
            ) : null}
            {project.status ? (
              <span className="rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs text-text-muted">
                {project.status}
              </span>
            ) : null}
            {project.live_url ? (
              <a
                href={project.live_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs text-text-muted transition-colors hover:text-accent"
              >
                Live URL
                <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
              </a>
            ) : null}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {techStack.map((item) => (
              <span
                key={item.id}
                className="inline-flex items-center gap-2 rounded-full border border-accent/30 px-3 py-1 font-mono text-xs text-accent"
              >
                {item.tech_stack_items.icon_url ? (
                  <Image
                    src={item.tech_stack_items.icon_url}
                    alt=""
                    width={24}
                    height={24}
                    loading="lazy"
                    className="h-6 w-6"
                  />
                ) : null}
                {item.tech_stack_items.name}
              </span>
            ))}
          </div>
        </header>

        {coverImage ? (
          <div className="relative mt-10 aspect-video w-full overflow-hidden rounded-xl bg-surface-subtle">
            <Image
              src={coverImage}
              alt={`${project.title} cover`}
              fill
              priority
              sizes="(min-width: 1024px) 960px, 100vw"
              className="object-contain p-4"
            />
          </div>
        ) : null}

        {videoEmbedUrl ? (
          <section className="mt-16">
            <p className="font-mono text-xs uppercase tracking-widest text-accent">
              Product Walkthrough
            </p>
            <iframe
              src={videoEmbedUrl}
              title={`${project.title} product walkthrough`}
              allowFullScreen
              className="mt-4 aspect-video w-full rounded-xl border border-border bg-surface"
            />
          </section>
        ) : null}

        {project.problem ? (
          <section className="mt-16 rounded-r-xl border-l-2 border-accent bg-surface py-4 pl-6">
            <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
              The Problem
            </p>
            <div className="mt-2">
              <ReactMarkdown components={markdownComponents}>
                {project.problem}
              </ReactMarkdown>
            </div>
          </section>
        ) : null}

        {project.my_role ? (
          <p className="mt-10 font-mono text-sm">
            <span className="text-text-muted">My Role — </span>
            <span className="text-accent">{project.my_role}</span>
          </p>
        ) : null}

        {project.solution ? (
          <section className="mt-16">
            <h2 className="font-display text-2xl font-semibold text-text-primary">
              The Solution
            </h2>
            <ReactMarkdown components={markdownComponents}>
              {project.solution}
            </ReactMarkdown>
          </section>
        ) : null}

        {project.outcome ? (
          <section className="mt-16 rounded-xl border border-accent/20 bg-surface p-6">
            <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
              The Outcome
            </p>
            <ReactMarkdown components={markdownComponents}>
              {project.outcome}
            </ReactMarkdown>
          </section>
        ) : null}

        {project.screenshots.length > 0 ? (
          <section className="mt-16">
            <h2 className="font-display text-2xl font-semibold text-text-primary">
              Screenshots
            </h2>
            <div className="mt-6">
              <ScreenshotLightbox
                screenshots={project.screenshots}
                projectTitle={project.title}
              />
            </div>
          </section>
        ) : null}

        <nav
          aria-label="Adjacent projects"
          className="mt-16 grid gap-4 border-y border-border py-6 sm:grid-cols-2"
        >
          {previousProject ? (
            <Link
              href={`/work/${previousProject.slug}`}
              className="group flex items-center gap-3 text-left"
            >
              <ArrowLeft
                aria-hidden="true"
                className="h-5 w-5 text-text-muted transition-colors group-hover:text-accent"
              />
              <span>
                <span className="block font-mono text-xs text-text-muted">
                  Previous
                </span>
                <span className="font-sans font-semibold text-text-primary">
                  {previousProject.title}
                </span>
              </span>
            </Link>
          ) : (
            <span />
          )}

          {nextProject ? (
            <Link
              href={`/work/${nextProject.slug}`}
              className="group flex items-center justify-start gap-3 text-left sm:justify-end sm:text-right"
            >
              <span>
                <span className="block font-mono text-xs text-text-muted">
                  Next
                </span>
                <span className="font-sans font-semibold text-text-primary">
                  {nextProject.title}
                </span>
              </span>
              <ArrowRight
                aria-hidden="true"
                className="h-5 w-5 text-text-muted transition-colors group-hover:text-accent"
              />
            </Link>
          ) : null}
        </nav>
      </article>
    </main>
  );
}
