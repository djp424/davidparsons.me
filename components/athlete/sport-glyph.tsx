import type { Sport } from "@/content/races";

/**
 * Stroke-based sport marks on a 20px grid — drawn rather than set in a font
 * so they scale and pick up currentColor.
 */
const paths: Record<Sport, string> = {
  Skimo: "M3 16.5h14 M6.5 16.2 9.4 4.6 M13.5 16.2 10.6 4.6 M5.2 10.6h9.6",
  Trail: "M2 16h16 M4 16l4.5-8.5 3 5 2-3.2L18 16",
  Road: "M5 3v14 M5 4.4h10l-2.4 3.4L15 11.2H5z",
  Bike: "M5 14 8.4 7.8h4.2L15 14 M8.4 7.8h4",
  Climb:
    "M10 3.2c3 0 5 2.4 5 5.4v3.6c0 2.6-2.2 4.6-5 4.6s-5-2-5-4.6V8.6c0-3 2-5.4 5-5.4Z M10 3.2v6",
};

export function SportGlyph({
  sport,
  size = 18,
}: {
  sport: Sport;
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
      <path d={paths[sport]} />
      {sport === "Bike" ? (
        <>
          <circle cx="5" cy="14" r="3.2" />
          <circle cx="15" cy="14" r="3.2" />
        </>
      ) : null}
    </svg>
  );
}
