import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));

/** Wrap artboard markup in the Design Component shell and write it out. */
export function artboard(name, { fonts, style, body }) {
  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
  <link rel="stylesheet" href="${fonts}">
  <style>
${style}
  </style>
</helmet>
${body}
</x-dc>
</body>
</html>
`;
  writeFileSync(join(here, name), html);
  return name;
}

export const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Group a newest-first race list into [{ year, races }] descending. */
export function byYear(races) {
  const out = [];
  for (const r of races) {
    const last = out[out.length - 1];
    if (last && last.year === r.year) last.races.push(r);
    else out.push({ year: r.year, races: [r] });
  }
  return out;
}

/** Stroke-based sport glyphs on a 20px grid. */
export function glyph(sport, color, size = 18) {
  const open = `<svg viewBox="0 0 20 20" width="${size}" height="${size}" fill="none" stroke="${color}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">`;
  const paths = {
    // ski tips crossed over a slope
    Skimo: '<path d="M3 16.5h14"/><path d="M6.5 16.2 9.4 4.6"/><path d="M13.5 16.2 10.6 4.6"/><path d="M5.2 10.6h9.6"/>',
    // mountain profile with a footprint notch
    Trail: '<path d="M2 16h16"/><path d="m4 16 4.5-8.5 3 5 2-3.2L18 16"/>',
    // road: a flag
    Road: '<path d="M5 3v14"/><path d="M5 4.4h10l-2.4 3.4L15 11.2H5z"/>',
    // two wheels and a frame
    Bike: '<circle cx="5" cy="14" r="3.2"/><circle cx="15" cy="14" r="3.2"/><path d="m5 14 3.4-6.2h4.2L15 14"/><path d="M8.4 7.8h4"/>',
    // carabiner-ish oval with a gate
    Climb: '<path d="M10 3.2c3 0 5 2.4 5 5.4v3.6c0 2.6-2.2 4.6-5 4.6s-5-2-5-4.6V8.6c0-3 2-5.4 5-5.4Z"/><path d="M10 3.2v6"/>',
  };
  return `${open}${paths[sport] ?? paths.Trail}</svg>`;
}
