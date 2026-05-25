import { ImageResponse } from "next/og";
import { createStaticClient } from "@/lib/supabase/server";
import type { Project } from "@/lib/types";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

type ProjectOpenGraphImageProps = {
  params: Promise<{
    slug: string;
  }>;
};

async function getProject(slug: string) {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  return data satisfies Project | null;
}

export default async function ProjectOpenGraphImage({
  params,
}: ProjectOpenGraphImageProps) {
  const { slug } = await params;
  const project = await getProject(slug);
  const title = project?.title ?? "Project";
  const tagline = project?.tagline ?? "Sai Ganesh case study";
  const domain = project?.domain ?? "Work";

  return new ImageResponse(
    (
      <div
        style={{
          background: "#0A0B0F",
          color: "#FFFFFF",
          display: "flex",
          flexDirection: "column",
          fontFamily: "Syne",
          height: "100%",
          padding: "82px 92px",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            alignSelf: "flex-start",
            border: "1px solid #6EE7B7",
            borderRadius: 999,
            color: "#6EE7B7",
            fontSize: 22,
            fontWeight: 600,
            padding: "10px 18px",
          }}
        >
          {domain}
        </div>
        <div
          style={{
            color: "#FFFFFF",
            fontSize: 72,
            fontWeight: 700,
            letterSpacing: "-1px",
            lineHeight: 1.05,
            marginTop: 72,
            maxWidth: 940,
          }}
        >
          {title}
        </div>
        <div
          style={{
            color: "#94A3B8",
            fontSize: 30,
            lineHeight: 1.35,
            marginTop: 28,
            maxWidth: 900,
          }}
        >
          {tagline}
        </div>
        <div
          style={{
            bottom: 58,
            color: "#475569",
            fontSize: 24,
            position: "absolute",
            right: 76,
          }}
        >
          saiganesh.online
        </div>
      </div>
    ),
    size,
  );
}
