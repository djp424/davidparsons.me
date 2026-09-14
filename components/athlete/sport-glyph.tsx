import type { ReactNode } from "react";
import type { GlyphSport } from "@/content/races";

/**
 * Stroke-based sport marks on a 20px grid — drawn rather than set in a font
 * so they scale and pick up currentColor. Keep them to a handful of strokes:
 * they render at 18px in the race table, where detail turns to mush.
 */
const marks: Record<GlyphSport, ReactNode> = {
  // A pair of skis side-on. The upturned tip is the only thing that says
  // "ski" at this size, so it gets a real hook and everything else goes.
  Skimo: (
    <>
      <path d="M2.4 8.2h8.9c3 0 4.8-1.2 5.9-3.6" />
      <path d="M2.4 14h8.9c3 0 4.8-1.2 5.9-3.6" />
    </>
  ),
  // A runner mid-stride. Six strokes, nothing behind it.
  Trail: (
    <>
      <circle cx="11.9" cy="3.9" r="1.8" />
      <path d="M11.1 6.9 8.7 11.3l3.1 2.1-.6 4" />
      <path d="M8.7 11.3 5.1 12.6 3.9 16.4" />
      <path d="m9.9 8.2 3.7 1.5 1.9-2" />
      <path d="M10.4 7.7 7.1 6.9" />
    </>
  ),
  // A finish flag.
  Road: <path d="M5 3v14 M5 4.4h10l-2.4 3.4L15 11.2H5z" />,
  Bike: (
    <>
      <circle cx="5" cy="14" r="3.2" />
      <circle cx="15" cy="14" r="3.2" />
      <path d="M5 14 8.4 7.8h4.2L15 14 M8.4 7.8h4" />
    </>
  ),
  // A carabiner.
  Climb: (
    <path d="M10 3.2c3 0 5 2.4 5 5.4v3.6c0 2.6-2.2 4.6-5 4.6s-5-2-5-4.6V8.6c0-3 2-5.4 5-5.4Z M10 3.2v6" />
  ),
  // An effort trace, for the swim, the gym session, the yoga class — the
  // parts of a multisport week that are training time rather than a
  // discipline the site races. A stopwatch was the obvious choice and the
  // wrong one: at 16px its round body and top stem read as the carabiner
  // above. This shares no silhouette with any of the five.
  Other: <path d="M2.4 10h3.1l2-4.8 2.7 9.6 2-4.8h5.4" />,
};

export function SportGlyph({
  sport,
  size = 18,
}: {
  sport: GlyphSport;
  size?: number;
}) {
  return (
    <svg
      viewBox="0 0 20 20"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label={sport}
    >
      {marks[sport]}
    </svg>
  );
}
