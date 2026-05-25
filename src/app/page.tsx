import Image from "next/image";
import Link from "next/link";
import { AnimatedHeadline } from "@/components/animations/AnimatedHeadline";
import { StackReveal, StackRevealItem } from "@/components/animations/StackReveal";
import { ProjectCard } from "@/components/project/ProjectCard";
import { createClient } from "@/lib/supabase/server";
import type {
  ClientTestimonial,
  Project,
  ResumeMeta,
  TechStackCategory,
  TechStackItem,
} from "@/lib/types";

const techCategoryOrder: readonly TechStackCategory[] = [
  "frontend",
  "backend",
  "mobile",
  "database",
  "no_code",
  "tools",
];

const techCategoryLabels: Record<TechStackCategory, string> = {
  frontend: "Frontend",
  backend: "Backend",
  mobile: "Mobile",
  database: "Database",
  no_code: "No-code",
  tools: "Tools",
};

async function getHomeData() {
  const supabase = await createClient();

  const [resumeResult, projectsResult, stackResult, testimonialsResult] =
    await Promise.all([
      supabase
        .from("resume_meta")
        .select("*")
        .eq("active", true)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
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
        .eq("featured", true)
        .order("featured_order", { ascending: true })
        .order("sort_order", {
          ascending: true,
          referencedTable: "project_tech_stack",
        }),
      supabase
        .from("tech_stack_items")
        .select("*")
        .eq("visible", true)
        .order("sort_order", { ascending: true }),
      supabase
        .from("client_testimonials")
        .select("*")
        .eq("visible", true)
        .order("sort_order", { ascending: true }),
    ]);

  return {
    resume: resumeResult.data satisfies ResumeMeta | null,
    projects: (projectsResult.data ?? []) satisfies Project[],
    stackItems: (stackResult.data ?? []) satisfies TechStackItem[],
    testimonials: (testimonialsResult.data ?? []) satisfies ClientTestimonial[],
  };
}

function groupStackItems(items: TechStackItem[]) {
  const groups: Record<TechStackCategory, TechStackItem[]> = {
    frontend: [],
    backend: [],
    mobile: [],
    database: [],
    no_code: [],
    tools: [],
  };

  items.forEach((item) => {
    groups[item.category].push(item);
  });

  return groups;
}

function TechStackSection({ items }: { items: TechStackItem[] }) {
  const groups = groupStackItems(items);

  return (
    <section id="stack" className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-8">
      <h2 className="font-display text-3xl font-semibold text-text-primary">
        Tech Stack
      </h2>

      <StackReveal>
        <div className="mt-8 space-y-8">
          {techCategoryOrder.map((category) => (
            <StackRevealItem key={category}>
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
                  {techCategoryLabels[category]}
                </p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {groups[category].map((item) => (
                    <div
                      key={item.id}
                      className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2"
                    >
                      {item.icon_url ? (
                        <Image
                          src={item.icon_url}
                          alt=""
                          width={24}
                          height={24}
                          loading="lazy"
                          className="h-6 w-6"
                        />
                      ) : (
                        <span
                          aria-hidden="true"
                          className="h-6 w-6 rounded-sm bg-surface-subtle"
                        />
                      )}
                      <span className="text-sm text-text-secondary">
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </StackRevealItem>
          ))}
        </div>
      </StackReveal>
    </section>
  );
}

function TestimonialsSection({
  testimonials,
}: {
  testimonials: ClientTestimonial[];
}) {
  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section
      id="testimonials"
      className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-8"
    >
      <h2 className="font-display text-3xl font-semibold text-text-primary">
        What Clients Say
      </h2>

      <div className="mt-8 flex snap-x gap-4 overflow-x-auto pb-4 lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0">
        {testimonials.map((testimonial) => (
          <article
            key={testimonial.id}
            className="min-w-[18rem] snap-start rounded-xl border border-border bg-surface p-6 lg:min-w-0"
          >
            <p className="text-sm italic leading-6 text-text-secondary">
              “{testimonial.quote}”
            </p>

            <div className="mt-6 flex items-center gap-3">
              {testimonial.avatar_url ? (
                <Image
                  src={testimonial.avatar_url}
                  alt=""
                  width={32}
                  height={32}
                  loading="lazy"
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="h-8 w-8 rounded-full bg-surface-subtle"
                />
              )}
              <div>
                <p className="font-semibold text-text-primary">
                  {testimonial.client_name}
                </p>
                <p className="font-mono text-xs text-text-muted">
                  {[testimonial.client_title, testimonial.client_company]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default async function Home() {
  const { resume, projects, stackItems, testimonials } = await getHomeData();
  const resumeHref = resume?.file_url ?? "#";

  return (
    <main className="flex flex-1 flex-col bg-bg">
      <section className="relative flex min-h-screen items-center overflow-hidden px-6 py-24 sm:px-8">
        <div aria-hidden="true" className="hero-ambient" />
        <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
          <p className="font-mono text-sm uppercase tracking-widest text-accent">
            Full-Stack Product Engineer
          </p>
          <AnimatedHeadline>
            I build and ship production SaaS — end to end.
          </AnimatedHeadline>
          <p className="mt-6 text-lg text-text-secondary">
            React · Supabase · Flutter · TypeScript
          </p>
          <p className="mt-3 text-sm text-text-muted">
            10+ live client products · Fintech · HRMS · E-commerce · Mobile
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/work"
              className="inline-flex w-full items-center justify-center rounded-lg bg-accent px-6 py-3 font-semibold text-bg transition-colors hover:bg-text-primary sm:w-auto"
            >
              View Work
            </Link>
            <a
              href={resumeHref}
              download
              aria-disabled={!resume?.file_url}
              className="inline-flex w-full items-center justify-center rounded-lg border border-accent px-6 py-3 font-semibold text-accent transition-colors hover:border-text-primary hover:text-text-primary sm:w-auto"
            >
              Download Resume
            </a>
          </div>
        </div>
      </section>

      <section id="work" className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-8">
        <h2 className="font-display text-3xl font-semibold text-text-primary">
          Selected Work
        </h2>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      <TechStackSection items={stackItems} />

      <TestimonialsSection testimonials={testimonials} />

      <section
        id="contact"
        className="border-y border-border bg-surface px-6 py-16 sm:px-8"
      >
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-2xl font-semibold text-text-primary">
            Open to full-time remote roles
          </h2>
          <p className="mt-3 text-sm text-text-muted">
            React · Supabase · Flutter — building from India, working globally
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/work"
              className="inline-flex items-center justify-center rounded-lg bg-accent px-5 py-3 font-semibold text-bg transition-colors hover:bg-text-primary"
            >
              See My Work
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg border border-border px-5 py-3 font-semibold text-text-secondary transition-colors hover:border-accent hover:text-accent"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
