"use client";

import { ArrowRight } from "lucide-react";
import { type FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ContactSubmissionInsert } from "@/lib/types";

type ContactFormState = {
  name: string;
  email: string;
  company: string;
  message: string;
};

const initialFormState: ContactFormState = {
  name: "",
  email: "",
  company: "",
  message: "",
};

export function ContactForm() {
  const [formState, setFormState] = useState<ContactFormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  function updateField(field: keyof ContactFormState, value: string) {
    setFormState((currentState) => ({
      ...currentState,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const submission: ContactSubmissionInsert = {
      name: formState.name.trim(),
      email: formState.email.trim(),
      company: formState.company.trim() || null,
      message: formState.message.trim(),
    };

    const supabase = createClient();
    const { error } = await supabase
      .from("contact_submissions")
      .insert(submission);

    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setIsSubmitted(true);
    setFormState(initialFormState);
  }

  if (isSubmitted) {
    return (
      <div className="rounded-xl border border-border bg-surface p-8">
        <h2 className="font-display text-2xl font-semibold text-accent">
          Message sent.
        </h2>
        <p className="mt-3 text-sm text-text-secondary">
          I&apos;ll get back to you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="name"
          className="mb-2 block font-mono text-xs text-text-muted"
        >
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={formState.name}
          onChange={(event) => updateField("name", event.target.value)}
          className="w-full rounded-lg border border-border bg-surface px-4 py-3 font-sans text-sm text-text-primary transition-colors placeholder:text-text-muted focus:border-accent focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-2 block font-mono text-xs text-text-muted"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={formState.email}
          onChange={(event) => updateField("email", event.target.value)}
          className="w-full rounded-lg border border-border bg-surface px-4 py-3 font-sans text-sm text-text-primary transition-colors placeholder:text-text-muted focus:border-accent focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="company"
          className="mb-2 block font-mono text-xs text-text-muted"
        >
          Company
        </label>
        <input
          id="company"
          name="company"
          type="text"
          placeholder="Where do you work?"
          value={formState.company}
          onChange={(event) => updateField("company", event.target.value)}
          className="w-full rounded-lg border border-border bg-surface px-4 py-3 font-sans text-sm text-text-primary transition-colors placeholder:text-text-muted focus:border-accent focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-2 block font-mono text-xs text-text-muted"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          placeholder="Tell me about the role or project..."
          value={formState.message}
          onChange={(event) => updateField("message", event.target.value)}
          className="min-h-[120px] w-full rounded-lg border border-border bg-surface px-4 py-3 font-sans text-sm text-text-primary transition-colors placeholder:text-text-muted focus:border-accent focus:outline-none"
        />
      </div>

      {errorMessage ? (
        <p className="text-sm text-error" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 font-semibold text-bg transition-colors hover:bg-accent-glow disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Sending..." : "Send Message"}
        <ArrowRight aria-hidden="true" className="h-4 w-4" />
      </button>
    </form>
  );
}
