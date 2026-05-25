import Image from "next/image";
import { StackReveal, StackRevealItem } from "@/components/animations/StackReveal";
import type { TechStackCategory, TechStackItem } from "@/lib/types";

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

type TechStackSectionProps = {
  heading?: string;
  items: TechStackItem[];
};

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

export function TechStackSection({
  heading = "Tech Stack",
  items,
}: TechStackSectionProps) {
  const groups = groupStackItems(items);

  return (
    <section id="stack" className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-8">
      <h2 className="font-display text-3xl font-semibold text-text-primary">
        {heading}
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
