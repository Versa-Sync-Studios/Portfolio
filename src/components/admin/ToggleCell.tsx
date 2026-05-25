"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";

type ToggleCellProps = {
  field: "is_published" | "featured";
  initialValue: boolean;
  projectId: string;
};

export function ToggleCell({
  field,
  initialValue,
  projectId,
}: ToggleCellProps) {
  const [checked, setChecked] = useState(initialValue);
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    const nextValue = !checked;
    setChecked(nextValue);
    setLoading(true);

    const supabase = createClient();
    const update =
      field === "is_published"
        ? { is_published: nextValue }
        : { featured: nextValue };
    const { error } = await supabase
      .from("projects")
      .update(update)
      .eq("id", projectId);

    if (error) {
      setChecked(!nextValue);
      toast.error(error.message);
    }

    setLoading(false);
  }

  return (
    <button
      type="button"
      aria-pressed={checked}
      disabled={loading}
      className={`relative inline-flex h-5 w-9 items-center rounded-full border transition-colors ${
        checked
          ? "border-accent bg-accent"
          : "border-border bg-surface-subtle"
      } disabled:cursor-not-allowed disabled:opacity-70`}
      onClick={handleToggle}
    >
      <span
        className={`inline-flex h-4 w-4 items-center justify-center rounded-full bg-bg transition-transform ${
          checked ? "translate-x-4" : "translate-x-0.5"
        }`}
      >
        {loading ? (
          <Loader2 className="animate-spin text-text-muted" size={12} />
        ) : null}
      </span>
    </button>
  );
}
