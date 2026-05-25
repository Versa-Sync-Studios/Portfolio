"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { ProjectScreenshot } from "@/lib/types";

type ScreenshotLightboxProps = {
  screenshots: ProjectScreenshot[];
  projectTitle: string;
};

export function ScreenshotLightbox({
  screenshots,
  projectTitle,
}: ScreenshotLightboxProps) {
  const [activeScreenshot, setActiveScreenshot] =
    useState<ProjectScreenshot | null>(null);

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-2">
        {screenshots.map((screenshot, index) => (
          <button
            key={`${screenshot.url}-${index}`}
            type="button"
            onClick={() => setActiveScreenshot(screenshot)}
            className="group text-left"
          >
            <span className="relative block aspect-video overflow-hidden rounded-xl bg-surface-subtle">
              <Image
                src={screenshot.url}
                alt={screenshot.alt ?? `${projectTitle} screenshot ${index + 1}`}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-contain p-3 transition-opacity group-hover:opacity-90"
              />
            </span>
            {screenshot.caption ? (
              <span className="mt-2 block text-xs text-text-muted">
                {screenshot.caption}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {activeScreenshot ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Screenshot preview"
          className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 p-4 backdrop-blur"
          onClick={() => setActiveScreenshot(null)}
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close screenshot preview"
              onClick={() => setActiveScreenshot(null)}
              className="absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface text-text-primary"
            >
              <X aria-hidden="true" className="h-5 w-5" />
            </button>
            <div className="relative aspect-video overflow-hidden rounded-xl bg-surface">
              <Image
                src={activeScreenshot.url}
                alt={activeScreenshot.alt ?? `${projectTitle} screenshot`}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
