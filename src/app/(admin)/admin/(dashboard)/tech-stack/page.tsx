import { createClient } from "@/lib/supabase/server";
import type { TechStackCategory, TechStackItem } from "@/lib/types";
import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

const categoryOrder: TechStackCategory[] = [
  "frontend",
  "backend",
  "mobile",
  "database",
  "no_code",
  "tools",
];

export default async function AdminTechStackPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tech_stack_items")
    .select("*")
    .order("category", { ascending: true })
    .order("sort_order", { ascending: true });

  if (error) {
    return (
      <div>
        <h1 className="text-lg font-semibold text-text-primary">Tech Stack</h1>
        <div className="mt-6 rounded-md border border-border bg-surface p-3">
          <p className="text-sm text-error">Could not load tech stack items.</p>
          <p className="mt-1 text-xs text-text-muted">{error.message}</p>
        </div>
      </div>
    );
  }

  const items = (data ?? []) as TechStackItem[];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-text-primary">Tech Stack</h1>
        <p className="text-sm text-text-muted">{items.length} items</p>
      </div>

      {items.length > 0 ? (
        <div className="overflow-hidden rounded-md border border-border">
          <table className="w-full">
            <thead className="border-b border-border bg-surface">
              <tr>
                <TableHead>Item</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Visible</TableHead>
                <TableHead>Order</TableHead>
              </tr>
            </thead>
            <tbody>
              {items
                .sort((a, b) => {
                  const categoryDelta =
                    categoryOrder.indexOf(a.category) -
                    categoryOrder.indexOf(b.category);

                  return categoryDelta === 0
                    ? a.sort_order - b.sort_order
                    : categoryDelta;
                })
                .map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-border transition-colors last:border-0 hover:bg-surface/50"
                  >
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        {item.icon_url ? (
                          <img
                            src={item.icon_url}
                            alt=""
                            className="h-5 w-5 object-contain"
                          />
                        ) : (
                          <span className="h-5 w-5 rounded border border-border bg-surface" />
                        )}
                        <span className="text-sm font-medium text-text-primary">
                          {item.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3 font-mono text-xs text-text-secondary">
                      {item.category}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`font-mono text-xs ${
                          item.visible ? "text-accent" : "text-text-muted"
                        }`}
                      >
                        {item.visible ? "visible" : "hidden"}
                      </span>
                    </td>
                    <td className="px-3 py-3 font-mono text-xs text-text-muted">
                      {item.sort_order}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-md border border-border bg-surface p-3">
          <p className="text-sm text-text-muted">No tech stack items found.</p>
        </div>
      )}
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
