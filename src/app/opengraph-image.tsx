import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "flex-start",
          background: "#0A0B0F",
          color: "#FFFFFF",
          display: "flex",
          flexDirection: "column",
          fontFamily: "Syne",
          height: "100%",
          justifyContent: "center",
          padding: "96px",
          width: "100%",
        }}
      >
        <div
          style={{
            color: "#FFFFFF",
            fontSize: 88,
            fontWeight: 700,
            lineHeight: 1,
          }}
        >
          Sai Ganesh
        </div>
        <div
          style={{
            color: "#6EE7B7",
            fontSize: 34,
            fontWeight: 600,
            marginTop: 28,
          }}
        >
          Full-Stack Product Engineer
        </div>
        <div
          style={{
            bottom: 72,
            color: "#94A3B8",
            fontSize: 28,
            position: "absolute",
          }}
        >
          React · Supabase · Flutter · TypeScript
        </div>
      </div>
    ),
    size,
  );
}
