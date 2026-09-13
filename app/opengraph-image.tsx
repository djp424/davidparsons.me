import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = site.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#fafaf8",
          color: "#17191a",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "84px 96px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            fontSize: 24,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#9a9e9b",
          }}
        >
          davidparsons.me
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 88, letterSpacing: -2, lineHeight: 1.05 }}>
            Hello, I&rsquo;m David.
          </div>
          <div style={{ fontSize: 34, color: "#6b706e" }}>
            Fifteen years building software for the web.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            borderTop: "1px solid #e4e4e0",
            paddingTop: 28,
            fontSize: 24,
            color: "#9a9e9b",
          }}
        >
          Notes · Speaking · Contact
        </div>
      </div>
    ),
    size,
  );
}
