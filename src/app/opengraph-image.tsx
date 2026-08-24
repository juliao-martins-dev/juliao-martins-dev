import { ImageResponse } from "next/og";

import { heroCopy } from "@/content/hero";

/**
 * Generated OG card, 1200x630.
 *
 * The previous metadata pointed at /juliao_martins.jpg and *declared* it as
 * 1200x630 — the file is actually 354x472 portrait, so every social preview
 * was cropping or letterboxing it badly.
 *
 * All copy here comes from content/hero.ts. Nothing is invented.
 */
export const alt = `${heroCopy.en.name} — ${heroCopy.en.roleA}, ${heroCopy.en.connector.toLowerCase()} ${heroCopy.en.roleB}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const { name, connector, roleB, current } = heroCopy.en;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#020617",
          color: "#f8fafc",
        }}
      >
        <div
          style={{
            fontSize: 26,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#efb146",
            marginBottom: 28,
          }}
        >
          {connector}
        </div>

        <div style={{ fontSize: 104, fontWeight: 700, lineHeight: 1.05 }}>
          {roleB}
        </div>

        <div
          style={{
            marginTop: 40,
            height: 2,
            width: 220,
            backgroundColor: "#efb146",
          }}
        />

        <div style={{ fontSize: 44, fontWeight: 600, marginTop: 40 }}>
          {name}
        </div>

        <div style={{ fontSize: 28, color: "#94a3b8", marginTop: 14 }}>
          {`${current.prefix} ${current.role} ${current.suffix}`}
        </div>
      </div>
    ),
    size
  );
}
