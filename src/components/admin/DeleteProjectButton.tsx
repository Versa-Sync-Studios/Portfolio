"use client";

import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";

type DeleteProjectButtonProps = {
  projectId: string;
  title: string;
};

export function DeleteProjectButton({
  projectId,
  title,
}: DeleteProjectButtonProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(`Delete "${title}"?`);

    if (!confirmed) {
      return;
    }

    setDeleting(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", projectId);

    if (error) {
      toast.error(error.message);
      setDeleting(false);
      return;
    }

    router.refresh();
  }

  return (
    <button
      type="button"
      title="Delete project"
      disabled={deleting}
      className="rounded p-1.5 text-text-muted transition-colors hover:bg-surface hover:text-error disabled:cursor-not-allowed disabled:opacity-60"
      onClick={handleDelete}
    >
      <Trash size={16} aria-hidden="true" />
    </button>
  );
}
