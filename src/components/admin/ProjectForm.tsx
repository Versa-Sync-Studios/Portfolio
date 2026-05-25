"use client";

import { Loader2, Upload, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { createClient } from "@/lib/supabase/client";
import type {
  Project,
  Screenshot,
  TablesInsert,
  TablesUpdate,
  TechStackCategory,
  TechStackItem,
} from "@/lib/types";

const imageBucket = "Project Images";
const maxImageSize = 5 * 1024 * 1024;
const categoryOrder: TechStackCategory[] = [
  "frontend",
  "backend",
  "mobile",
  "database",
  "no_code",
  "tools",
];

const projectStatusSchema = z.enum(["live", "in_progress", "archived"]);
const projectFormSchema = z.object({
  completed_at: z.string().optional(),
  domain: z.string().optional(),
  featured: z.boolean().default(false),
  featured_order: z.number().optional(),
  is_published: z.boolean().default(false),
  live_url: z.string().url().optional().or(z.literal("")),
  repo_url: z.string().url().optional().or(z.literal("")),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, hyphens only"),
  sort_order: z.number().default(0),
  started_at: z.string().optional(),
  status: projectStatusSchema.default("live"),
  tagline: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  video_url: z.string().url().optional().or(z.literal("")),
});

type ProjectStatus = z.infer<typeof projectStatusSchema>;
type ProjectFormValues = z.infer<typeof projectFormSchema>;
type ProjectFormField = keyof ProjectFormValues;
type ActiveTab = "basic" | "case-study" | "media" | "tech-stack";

type ProjectFormState = ProjectFormValues & {
  cover_image_url: string;
  my_role: string;
  outcome: string;
  problem: string;
  screenshots: Screenshot[];
  solution: string;
};

type ProjectFormProps = {
  allTechStack: TechStackItem[];
  project: Project | null;
};

const formFieldNames = new Set<string>([
  "completed_at",
  "domain",
  "featured",
  "featured_order",
  "is_published",
  "live_url",
  "repo_url",
  "slug",
  "sort_order",
  "started_at",
  "status",
  "tagline",
  "title",
  "video_url",
]);

export function ProjectForm({ allTechStack, project }: ProjectFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ActiveTab>("basic");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<ProjectFormField, string>>>(
    {},
  );
  const [form, setForm] = useState<ProjectFormState>(() =>
    getInitialFormState(project),
  );
  const [projectId, setProjectId] = useState(project?.id ?? "");
  const [selectedTechIds, setSelectedTechIds] = useState<Set<string>>(
    () =>
      new Set(
        project?.project_tech_stack?.map(
          (entry) => entry.tech_stack_item_id,
        ) ?? [],
      ),
  );
  const [coverProgress, setCoverProgress] = useState<number | null>(null);
  const [screenshotProgress, setScreenshotProgress] = useState<
    Record<string, number>
  >({});

  const groupedTechStack = useMemo(
    () =>
      categoryOrder.map((category) => ({
        category,
        items: allTechStack
          .filter((item) => item.category === category)
          .sort((a, b) => a.sort_order - b.sort_order),
      })),
    [allTechStack],
  );

  function updateForm<K extends keyof ProjectFormState>(
    key: K,
    value: ProjectFormState[K],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function handleTitleChange(value: string) {
    setForm((current) => ({
      ...current,
      slug: slugify(value),
      title: value,
    }));
  }

  async function saveProject() {
    const parsed = projectFormSchema.safeParse(form);

    if (!parsed.success) {
      const nextErrors: Partial<Record<ProjectFormField, string>> = {};

      for (const issue of parsed.error.issues) {
        const key = issue.path[0];

        if (typeof key === "string" && isProjectFormField(key)) {
          nextErrors[key] = issue.message;
        }
      }

      setErrors(nextErrors);
      setActiveTab("basic");
      return;
    }

    setErrors({});
    setSaving(true);

    const supabase = createClient();
    if (projectId) {
      const payload = toProjectUpdatePayload(form);
      const { error } = await supabase
        .from("projects")
        .update(payload)
        .eq("id", projectId);

      if (error) {
        toast.error(error.message);
        setSaving(false);
        return;
      }

      toast.success("Saved");
      setSaving(false);
      router.refresh();
      return;
    }

    const payload = toProjectInsertPayload(form);
    const { data, error } = await supabase
      .from("projects")
      .insert(payload)
      .select("id")
      .single();

    if (error || !data) {
      toast.error(error?.message ?? "Could not save project.");
      setSaving(false);
      return;
    }

    if (selectedTechIds.size > 0) {
      const rows = Array.from(selectedTechIds).map((techStackItemId, index) => ({
        project_id: data.id,
        sort_order: index,
        tech_stack_item_id: techStackItemId,
      }));
      const { error: techStackError } = await supabase
        .from("project_tech_stack")
        .insert(rows);

      if (techStackError) {
        toast.error(techStackError.message);
        setSaving(false);
        return;
      }
    }

    toast.success("Saved");
    setProjectId(data.id);
    setSaving(false);
    router.push(`/admin/projects/${data.id}/edit`);
  }

  async function handleCoverUpload(file: File | null) {
    if (!file) {
      return;
    }

    if (!validateImageFile(file)) {
      return;
    }

    if (!form.slug) {
      toast.error("Add a slug before uploading.");
      setActiveTab("basic");
      return;
    }

    setCoverProgress(20);
    const extension = getFileExtension(file.name);
    const path = `${form.slug}/cover.${extension}`;
    const supabase = createClient();
    const { error } = await supabase.storage
      .from(imageBucket)
      .upload(path, file, { upsert: true });

    if (error) {
      toast.error(error.message);
      setCoverProgress(null);
      return;
    }

    const { data } = supabase.storage.from(imageBucket).getPublicUrl(path);
    updateForm("cover_image_url", data.publicUrl);
    setCoverProgress(100);

    if (projectId) {
      await updateProjectMedia({ cover_image_url: data.publicUrl });
    }

    toast.success("Cover image uploaded");
    window.setTimeout(() => setCoverProgress(null), 600);
  }

  async function handleScreenshotFiles(fileList: FileList | null) {
    if (!fileList) {
      return;
    }

    if (!form.slug) {
      toast.error("Add a slug before uploading.");
      setActiveTab("basic");
      return;
    }

    const supabase = createClient();
    const uploadedScreenshots: Screenshot[] = [];
    const files = Array.from(fileList);

    for (const [fileIndex, file] of files.entries()) {
      if (!validateImageFile(file)) {
        continue;
      }

      const key = `${file.name}-${file.lastModified}`;
      setScreenshotProgress((current) => ({ ...current, [key]: 20 }));

      const extension = getFileExtension(file.name);
      const filename = `${file.lastModified}-${fileIndex}-${sanitizeFilename(file.name, extension)}.${extension}`;
      const path = `${form.slug}/screenshots/${filename}`;
      const { error } = await supabase.storage
        .from(imageBucket)
        .upload(path, file, { upsert: true });

      if (error) {
        toast.error(error.message);
        setScreenshotProgress((current) => ({ ...current, [key]: 0 }));
        continue;
      }

      const { data } = supabase.storage.from(imageBucket).getPublicUrl(path);
      uploadedScreenshots.push({
        caption: "",
        order: form.screenshots.length + uploadedScreenshots.length,
        url: data.publicUrl,
      });
      const nextScreenshots = [...form.screenshots, ...uploadedScreenshots];
      setForm((current) => ({ ...current, screenshots: nextScreenshots }));
      setScreenshotProgress((current) => ({ ...current, [key]: 100 }));

      if (projectId) {
        await persistScreenshots(nextScreenshots);
      }
    }

    toast.success("Screenshots updated");
  }

  async function updateScreenshotCaption(index: number, caption: string) {
    const nextScreenshots = form.screenshots.map((screenshot, currentIndex) =>
      currentIndex === index ? { ...screenshot, caption } : screenshot,
    );
    updateForm("screenshots", nextScreenshots);

    if (projectId) {
      await persistScreenshots(nextScreenshots);
    }
  }

  async function deleteScreenshot(index: number) {
    const nextScreenshots = form.screenshots
      .filter((_, currentIndex) => currentIndex !== index)
      .map((screenshot, order) => ({ ...screenshot, order }));
    updateForm("screenshots", nextScreenshots);

    if (projectId) {
      await persistScreenshots(nextScreenshots);
    }
  }

  async function persistScreenshots(nextScreenshots: Screenshot[]) {
    await updateProjectMedia({ screenshots: nextScreenshots });
  }

  async function updateProjectMedia(update: TablesUpdate<"projects">) {
    if (!projectId) {
      return;
    }

    const supabase = createClient();
    const { error } = await supabase
      .from("projects")
      .update(update)
      .eq("id", projectId);

    if (error) {
      toast.error(error.message);
    }
  }

  async function handleTechToggle(itemId: string, checked: boolean) {
    const previousSelectedIds = new Set(selectedTechIds);
    const nextSelectedIds = new Set(selectedTechIds);

    if (checked) {
      nextSelectedIds.add(itemId);
    } else {
      nextSelectedIds.delete(itemId);
    }

    setSelectedTechIds(nextSelectedIds);

    if (!projectId) {
      return;
    }

    const supabase = createClient();
    const result = checked
      ? await supabase.from("project_tech_stack").insert({
          project_id: projectId,
          sort_order: previousSelectedIds.size,
          tech_stack_item_id: itemId,
        })
      : await supabase
          .from("project_tech_stack")
          .delete()
          .eq("project_id", projectId)
          .eq("tech_stack_item_id", itemId);

    if (result.error) {
      setSelectedTechIds(previousSelectedIds);
      toast.error(result.error.message);
    }
  }

  return (
    <div className="-m-6 min-h-screen bg-bg">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-bg px-6 py-3">
        <div className="space-y-1">
          <Link
            href="/admin/projects"
            className="font-mono text-xs text-text-muted transition-colors hover:text-text-primary"
          >
            &larr; Projects
          </Link>
          <h1 className="text-base font-semibold text-text-primary">
            {project ? project.title : "New Project"}
          </h1>
        </div>

        <button
          type="button"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-1.5 text-sm font-medium text-bg transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          onClick={saveProject}
        >
          {saving ? <Loader2 className="animate-spin" size={14} /> : null}
          Save
        </button>
      </div>

      <div className="px-6 pt-4">
        <div className="mb-6 flex gap-1 border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              className={`px-3 py-2 text-sm transition-colors ${
                activeTab === tab.value
                  ? "border-b-2 border-accent text-text-primary"
                  : "text-text-muted hover:text-text-primary"
              }`}
              onClick={() => setActiveTab(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 pb-8">
        {activeTab === "basic" ? (
          <BasicInfoTab
            errors={errors}
            form={form}
            onTitleChange={handleTitleChange}
            updateForm={updateForm}
          />
        ) : null}

        {activeTab === "case-study" ? (
          <CaseStudyTab form={form} updateForm={updateForm} />
        ) : null}

        {activeTab === "media" ? (
          <MediaTab
            coverProgress={coverProgress}
            form={form}
            onCoverUpload={handleCoverUpload}
            onDeleteScreenshot={deleteScreenshot}
            onScreenshotCaptionChange={updateScreenshotCaption}
            onScreenshotUpload={handleScreenshotFiles}
            screenshotProgress={screenshotProgress}
          />
        ) : null}

        {activeTab === "tech-stack" ? (
          <TechStackTab
            groupedTechStack={groupedTechStack}
            onToggle={handleTechToggle}
            selectedTechIds={selectedTechIds}
          />
        ) : null}
      </div>
    </div>
  );
}

const tabs: { label: string; value: ActiveTab }[] = [
  { label: "Basic Info", value: "basic" },
  { label: "Case Study", value: "case-study" },
  { label: "Media", value: "media" },
  { label: "Tech Stack", value: "tech-stack" },
];

type TabProps = {
  form: ProjectFormState;
  updateForm: <K extends keyof ProjectFormState>(
    key: K,
    value: ProjectFormState[K],
  ) => void;
};

type BasicInfoTabProps = TabProps & {
  errors: Partial<Record<ProjectFormField, string>>;
  onTitleChange: (value: string) => void;
};

function BasicInfoTab({
  errors,
  form,
  onTitleChange,
  updateForm,
}: BasicInfoTabProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-4">
          <Field error={errors.title} label="Title*">
            <input
              value={form.title}
              className={inputClassName}
              onChange={(event) => onTitleChange(event.target.value)}
            />
          </Field>

          <Field error={errors.slug} label="Slug*">
            <input
              value={form.slug}
              className={`${inputClassName} font-mono`}
              onChange={(event) => updateForm("slug", slugify(event.target.value))}
            />
            <p className="mt-1 text-xs text-text-muted">URL: /work/[slug]</p>
          </Field>

          <Field error={errors.tagline} label="Tagline">
            <input
              value={form.tagline ?? ""}
              className={inputClassName}
              onChange={(event) => updateForm("tagline", event.target.value)}
            />
          </Field>

          <Field error={errors.domain} label="Domain">
            <input
              value={form.domain ?? ""}
              className={inputClassName}
              placeholder="Fintech, HRMS, E-commerce..."
              onChange={(event) => updateForm("domain", event.target.value)}
            />
          </Field>
        </div>

        <div className="space-y-4">
          <Field error={errors.status} label="Status">
            <select
              value={form.status}
              className={inputClassName}
              onChange={(event) =>
                updateForm("status", normalizeStatus(event.target.value))
              }
            >
              <option value="live">live</option>
              <option value="in_progress">in_progress</option>
              <option value="archived">archived</option>
            </select>
          </Field>

          <Field error={errors.live_url} label="Live URL">
            <input
              type="url"
              value={form.live_url ?? ""}
              className={inputClassName}
              onChange={(event) => updateForm("live_url", event.target.value)}
            />
          </Field>

          <Field error={errors.repo_url} label="Repo URL">
            <input
              type="url"
              value={form.repo_url ?? ""}
              className={inputClassName}
              onChange={(event) => updateForm("repo_url", event.target.value)}
            />
          </Field>

          <Field error={errors.video_url} label="Video URL">
            <input
              type="url"
              value={form.video_url ?? ""}
              className={inputClassName}
              placeholder="Loom or YouTube URL"
              onChange={(event) => updateForm("video_url", event.target.value)}
            />
          </Field>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-6">
        <label className="flex items-center gap-2 text-sm text-text-secondary">
          <input
            type="checkbox"
            checked={form.featured}
            className="h-4 w-4 accent-accent"
            onChange={(event) => updateForm("featured", event.target.checked)}
          />
          Featured
        </label>

        <label className="flex items-center gap-2 text-sm text-text-secondary">
          <input
            type="checkbox"
            checked={form.is_published}
            className="h-4 w-4 accent-accent"
            onChange={(event) =>
              updateForm("is_published", event.target.checked)
            }
          />
          Published
        </label>

        {form.featured ? (
          <Field error={errors.featured_order} label="Featured Order">
            <input
              type="number"
              value={form.featured_order ?? ""}
              className={inputClassName}
              onChange={(event) =>
                updateForm(
                  "featured_order",
                  event.target.value === ""
                    ? undefined
                    : Number(event.target.value),
                )
              }
            />
          </Field>
        ) : null}

        <Field error={errors.sort_order} label="Sort Order">
          <input
            type="number"
            value={form.sort_order}
            className={inputClassName}
            onChange={(event) => updateForm("sort_order", Number(event.target.value))}
          />
        </Field>

        <Field error={errors.started_at} label="Started At">
          <input
            type="date"
            value={form.started_at ?? ""}
            className={inputClassName}
            onChange={(event) => updateForm("started_at", event.target.value)}
          />
        </Field>

        <Field error={errors.completed_at} label="Completed At">
          <input
            type="date"
            value={form.completed_at ?? ""}
            className={inputClassName}
            onChange={(event) => updateForm("completed_at", event.target.value)}
          />
        </Field>
      </div>
    </div>
  );
}

function CaseStudyTab({ form, updateForm }: TabProps) {
  return (
    <div>
      <div className="mb-6">
        <Field label="The Problem">
          <RichTextEditor
            value={form.problem}
            minHeight="160px"
            placeholder="What challenge did the client face?"
            onChange={(value) => updateForm("problem", value)}
          />
        </Field>
      </div>

      <div className="mb-6">
        <Field label="My Role">
          <textarea
            rows={2}
            value={form.my_role}
            className={inputClassName}
            placeholder="Sole architect and developer, 0 to production"
            onChange={(event) => updateForm("my_role", event.target.value)}
          />
        </Field>
      </div>

      <div className="mb-6">
        <Field label="The Solution">
          <RichTextEditor
            value={form.solution}
            minHeight="240px"
            placeholder="How did you solve it? Walk through technical decisions."
            onChange={(value) => updateForm("solution", value)}
          />
        </Field>
      </div>

      <div className="mb-6">
        <Field label="The Outcome">
          <RichTextEditor
            value={form.outcome}
            minHeight="160px"
            placeholder="What was the result? Quantify where possible."
            onChange={(value) => updateForm("outcome", value)}
          />
        </Field>
      </div>
    </div>
  );
}

type MediaTabProps = {
  coverProgress: number | null;
  form: ProjectFormState;
  onCoverUpload: (file: File | null) => void;
  onDeleteScreenshot: (index: number) => void;
  onScreenshotCaptionChange: (index: number, caption: string) => void;
  onScreenshotUpload: (files: FileList | null) => void;
  screenshotProgress: Record<string, number>;
};

function MediaTab({
  coverProgress,
  form,
  onCoverUpload,
  onDeleteScreenshot,
  onScreenshotCaptionChange,
  onScreenshotUpload,
  screenshotProgress,
}: MediaTabProps) {
  return (
    <div>
      <Field label="Cover Image">
        {form.cover_image_url ? (
          <img
            src={form.cover_image_url}
            alt=""
            className="mb-2 max-h-40 w-full rounded-md object-cover"
          />
        ) : null}

        <label className="block cursor-pointer rounded-md border border-dashed border-border p-4 text-center transition-colors hover:border-accent">
          <Upload className="mx-auto mb-2 text-text-muted" size={20} />
          <span className="block text-xs text-text-muted">
            Click to upload cover image
          </span>
          <span className="block text-xs text-text-muted">
            PNG, JPG, WebP up to 5MB
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => onCoverUpload(event.target.files?.[0] ?? null)}
          />
        </label>

        {coverProgress !== null ? (
          <div className="mt-2 h-1 w-full rounded-full bg-border">
            <div
              className="h-full rounded-full bg-accent transition-all"
              style={{ width: `${coverProgress}%` }}
            />
          </div>
        ) : null}
      </Field>

      <div className="mt-6">
        <Field label="Screenshots">
          {form.screenshots.length > 0 ? (
            <div className="mb-3 grid grid-cols-2 gap-3">
              {form.screenshots.map((screenshot, index) => (
                <div
                  key={`${screenshot.url}-${screenshot.order}`}
                  className="relative overflow-hidden rounded-md border border-border bg-surface"
                >
                  <img
                    src={screenshot.url}
                    alt=""
                    className="aspect-video w-full object-cover"
                  />
                  <button
                    type="button"
                    aria-label="Delete screenshot"
                    className="absolute right-1 top-1 rounded bg-bg/80 p-0.5 text-text-muted transition-colors hover:text-error"
                    onClick={() => onDeleteScreenshot(index)}
                  >
                    <X size={14} aria-hidden="true" />
                  </button>
                  <input
                    defaultValue={screenshot.caption ?? ""}
                    className={`${inputClassName} rounded-none border-0 border-t border-border text-xs`}
                    placeholder="Caption (optional)"
                    onBlur={(event) =>
                      onScreenshotCaptionChange(index, event.target.value)
                    }
                  />
                </div>
              ))}
            </div>
          ) : null}

          <label className="block cursor-pointer rounded-md border border-dashed border-border p-3 text-center transition-colors hover:border-accent">
            <span className="text-xs text-text-muted">Add screenshots</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(event) => onScreenshotUpload(event.target.files)}
            />
          </label>

          {Object.entries(screenshotProgress).map(([key, progress]) =>
            progress > 0 ? (
              <div key={key} className="mt-2 h-1 w-full rounded-full bg-border">
                <div
                  className="h-full rounded-full bg-accent transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            ) : null,
          )}
        </Field>
      </div>
    </div>
  );
}

type TechStackTabProps = {
  groupedTechStack: {
    category: TechStackCategory;
    items: TechStackItem[];
  }[];
  onToggle: (itemId: string, checked: boolean) => void;
  selectedTechIds: Set<string>;
};

function TechStackTab({
  groupedTechStack,
  onToggle,
  selectedTechIds,
}: TechStackTabProps) {
  return (
    <div>
      {groupedTechStack.map(({ category, items }) =>
        items.length > 0 ? (
          <div key={category} className="mt-4 first:mt-0">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-text-muted">
              {category.replace("_", " ")}
            </p>
            <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
              {items.map((item) => {
                const checked = selectedTechIds.has(item.id);

                return (
                  <label
                    key={item.id}
                    className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 transition-colors hover:bg-surface"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      className="h-4 w-4 accent-accent"
                      onChange={(event) =>
                        onToggle(item.id, event.target.checked)
                      }
                    />
                    {item.icon_url ? (
                      <img
                        src={item.icon_url}
                        alt=""
                        className="h-4 w-4 object-contain"
                      />
                    ) : null}
                    <span className="text-sm text-text-secondary">
                      {item.name}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        ) : null,
      )}
    </div>
  );
}

type FieldProps = {
  children: ReactNode;
  error?: string;
  label: string;
};

function Field({ children, error, label }: FieldProps) {
  return (
    <div className="block">
      <span className="mb-1 block text-xs font-medium text-text-muted">
        {label}
      </span>
      {children}
      {error ? <p className="mt-1 text-xs text-error">{error}</p> : null}
    </div>
  );
}

const inputClassName =
  "w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-accent focus:outline-none";

function getInitialFormState(project: Project | null): ProjectFormState {
  return {
    completed_at: toInputDate(project?.completed_at),
    cover_image_url: project?.cover_image_url ?? "",
    domain: project?.domain ?? "",
    featured: project?.featured ?? false,
    featured_order: project?.featured_order ?? undefined,
    is_published: project?.is_published ?? false,
    live_url: project?.live_url ?? "",
    my_role: project?.my_role ?? "",
    outcome: project?.outcome ?? "",
    problem: project?.problem ?? "",
    repo_url: project?.repo_url ?? "",
    screenshots: project?.screenshots ?? [],
    slug: project?.slug ?? "",
    solution: project?.solution ?? "",
    sort_order: project?.sort_order ?? 0,
    started_at: toInputDate(project?.started_at),
    status: normalizeStatus(project?.status),
    tagline: project?.tagline ?? "",
    title: project?.title ?? "",
    video_url: project?.video_url ?? "",
  };
}

function toProjectInsertPayload(form: ProjectFormState): TablesInsert<"projects"> {
  return toProjectPayload(form);
}

function toProjectUpdatePayload(form: ProjectFormState): TablesUpdate<"projects"> {
  return toProjectPayload(form);
}

function toProjectPayload(form: ProjectFormState) {
  const payload = {
    completed_at: emptyToNull(form.completed_at),
    cover_image_url: emptyToNull(form.cover_image_url),
    domain: emptyToNull(form.domain),
    featured: form.featured,
    featured_order: form.featured ? form.featured_order ?? 0 : 0,
    is_published: form.is_published,
    live_url: emptyToNull(form.live_url),
    my_role: emptyToNull(form.my_role),
    outcome: htmlToNull(form.outcome),
    problem: htmlToNull(form.problem),
    repo_url: emptyToNull(form.repo_url),
    screenshots: form.screenshots,
    slug: form.slug,
    solution: htmlToNull(form.solution),
    sort_order: form.sort_order,
    started_at: emptyToNull(form.started_at),
    status: form.status,
    tagline: emptyToNull(form.tagline),
    title: form.title,
    video_url: emptyToNull(form.video_url),
  };

  return payload;
}

function isProjectFormField(value: string): value is ProjectFormField {
  return formFieldNames.has(value);
}

function normalizeStatus(status: string | null | undefined): ProjectStatus {
  const parsed = projectStatusSchema.safeParse(status);
  return parsed.success ? parsed.data : "live";
}

function toInputDate(value: string | null | undefined) {
  return value ? value.slice(0, 10) : "";
}

function emptyToNull(value: string | undefined) {
  const nextValue = value?.trim() ?? "";
  return nextValue.length > 0 ? nextValue : null;
}

function htmlToNull(value: string) {
  const text = value.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, "").trim();
  return text.length > 0 ? value : null;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function validateImageFile(file: File) {
  if (file.size > maxImageSize) {
    toast.error("Image must be under 5MB.");
    return false;
  }

  return true;
}

function getFileExtension(filename: string) {
  const extension = filename.split(".").pop()?.toLowerCase();
  return extension && extension.length <= 5 ? extension : "jpg";
}

function sanitizeFilename(filename: string, extension: string) {
  const suffix = `.${extension}`;
  const baseName = filename.toLowerCase().endsWith(suffix)
    ? filename.slice(0, -suffix.length)
    : filename;

  return (
    baseName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "screenshot"
  );
}
