import { BriefcaseBusiness, Code2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-6 text-sm text-text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>© 2025 Sai Ganesh. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="text-text-secondary transition-colors hover:text-accent"
          >
            <Code2 aria-hidden="true" className="h-5 w-5" />
          </a>
          <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="text-text-secondary transition-colors hover:text-accent"
          >
            <BriefcaseBusiness aria-hidden="true" className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
