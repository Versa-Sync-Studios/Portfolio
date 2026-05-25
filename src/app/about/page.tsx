import { BriefcaseBusiness, Code2, Mail } from "lucide-react";
import { StackReveal, StackRevealItem } from "@/components/animations/StackReveal";
import { TechStackSection } from "@/components/sections/TechStackSection";
import { getSiteConfig } from "@/lib/site-config";
import { createStaticClient } from "@/lib/supabase/server";
import type { SiteConfigKey, TechStackItem } from "@/lib/types";

const siteConfigKeys: readonly SiteConfigKey[] = [
  "about_bio",
  "how_i_work",
  "looking_for",
  "email",
  "linkedin_url",
  "github_url",
];

const stats = [
  { label: "Live Projects", value: "10+" },
  { label: "Years Building", value: "3+" },
  { label: "Countries Clients Are From", value: "5" },
  { label: "Studio (Versa Sync Studios)", value: "1" },
] as const;

function normalizeText(value: string) {
  return value.replaceAll("\\n", "\n");
}

function parseHowIWork(value: string | undefined) {
  if (!value) {
    return [];
  }

  try {
    const parsedValue: unknown = JSON.parse(value);

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

async function getTechStackItems() {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("tech_stack_items")
    .select("*")
    .eq("visible", true)
    .order("sort_order", { ascending: true });

  return (data ?? []) satisfies TechStackItem[];
}

export default async function AboutPage() {
  const [config, stackItems] = await Promise.all([
    getSiteConfig(siteConfigKeys),
    getTechStackItems(),
  ]);
  const bioParagraphs = normalizeText(config.about_bio ?? "")
    .split("\n\n")
    .filter(Boolean);
  const howIWork = parseHowIWork(config.how_i_work);
  const lookingFor = config.looking_for ?? "";
  const email = config.email ?? "hello@saiganesh.online";
  const linkedinUrl = config.linkedin_url ?? "https://linkedin.com/";
  const githubUrl = config.github_url ?? "https://github.com/";

  return (
    <main className="flex flex-1 flex-col bg-bg">
      <section className="mx-auto w-full max-w-6xl px-6 pb-10 pt-32 sm:px-8">
        <p className="font-mono text-sm uppercase tracking-widest text-accent">
          About
        </p>
        <h1 className="mt-4 font-display text-4xl font-semibold text-text-primary">
          The Person Behind the Code
        </h1>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-10 sm:px-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-5">
          {bioParagraphs.map((paragraph) => (
            <p
              key={paragraph}
              className="text-base leading-relaxed text-text-secondary"
            >
              {paragraph}
            </p>
          ))}
        </div>

        <aside className="rounded-xl border border-border bg-surface p-6">
          <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="font-display text-3xl font-semibold text-accent">
                  {stat.value}
                </dt>
                <dd className="mt-1 font-mono text-xs text-text-muted">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </aside>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-8">
        <h2 className="font-display text-2xl font-semibold text-text-primary">
          How I Work
        </h2>
        <StackReveal>
          <div className="mt-6 space-y-4">
            {howIWork.map((item) => (
              <StackRevealItem key={item}>
                <div className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent"
                  />
                  <p className="text-base text-text-secondary">{item}</p>
                </div>
              </StackRevealItem>
            ))}
          </div>
        </StackReveal>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-8">
        <div className="rounded-xl border border-accent/20 bg-surface p-8">
          <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
            Currently Open To
          </p>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-text-secondary">
            {lookingFor}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="rounded-full bg-accent/10 px-3 py-1 font-mono text-xs text-accent">
              Full-Time Remote
            </span>
            <span className="rounded-full bg-accent/10 px-3 py-1 font-mono text-xs text-accent">
              International Companies
            </span>
          </div>
        </div>
      </section>

      <TechStackSection heading="My Stack" items={stackItems} />

      <section className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-8">
        <h2 className="font-display text-2xl font-semibold text-text-primary">
          Get In Touch
        </h2>
        <p className="mt-3 text-sm text-text-muted">
          I&apos;m always open to the right opportunity.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a
            href={`mailto:${email}`}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-text-secondary transition-colors hover:border-accent hover:text-accent"
          >
            <Mail aria-hidden="true" className="h-4 w-4" />
            {email}
          </a>
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-text-secondary transition-colors hover:border-accent hover:text-accent"
          >
            <BriefcaseBusiness aria-hidden="true" className="h-4 w-4" />
            LinkedIn
          </a>
          <a
            href={githubUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-text-secondary transition-colors hover:border-accent hover:text-accent"
          >
            <Code2 aria-hidden="true" className="h-4 w-4" />
            GitHub
          </a>
        </div>
      </section>
    </main>
  );
}
