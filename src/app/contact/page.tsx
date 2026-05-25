import { BriefcaseBusiness, Clock, Code2, Mail } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { getSiteConfig } from "@/lib/site-config";
import type { SiteConfigKey } from "@/lib/types";

const contactConfigKeys: readonly SiteConfigKey[] = [
  "email",
  "linkedin_url",
  "github_url",
];

export default async function ContactPage() {
  const config = await getSiteConfig(contactConfigKeys);
  const email = config.email ?? "hello@saiganesh.online";
  const linkedinUrl = config.linkedin_url ?? "https://linkedin.com/";
  const githubUrl = config.github_url ?? "https://github.com/";

  return (
    <main className="flex flex-1 flex-col bg-bg">
      <section className="mx-auto grid w-full max-w-6xl gap-10 px-6 pb-20 pt-32 sm:px-8 lg:grid-cols-[minmax(0,3fr)_minmax(18rem,2fr)]">
        <div>
          <p className="font-mono text-sm uppercase tracking-widest text-accent">
            Contact
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold text-text-primary">
            Let&apos;s Build Something Useful
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-text-muted">
            Send a role, collaboration, or project note. Keep it direct.
          </p>

          <div className="mt-10">
            <ContactForm />
          </div>
        </div>

        <aside className="space-y-8">
          <div className="rounded-xl border border-border bg-surface p-6">
            <div className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-accent animate-pulse"
              />
              <p className="font-mono text-xs text-accent">
                Available for opportunities
              </p>
            </div>
            <h2 className="mt-5 font-display text-xl font-semibold text-text-primary">
              Let&apos;s work together
            </h2>
            <p className="mt-3 text-sm leading-6 text-text-secondary">
              I&apos;m currently open to full-time remote roles at international
              companies. React, Supabase, Flutter.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-surface p-6">
            <div className="flex items-center gap-2">
              <Clock aria-hidden="true" className="h-4 w-4 text-text-muted" />
              <p className="font-mono text-xs text-text-muted">
                Typical response time
              </p>
            </div>
            <p className="mt-5 font-display text-xl font-semibold text-text-primary">
              Within 24 hours
            </p>
          </div>

          <div className="flex flex-col gap-3">
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
        </aside>
      </section>
    </main>
  );
}
