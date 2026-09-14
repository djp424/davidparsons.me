import { raceStats } from "@/content/races";
import { fetchYearVert } from "@/lib/strava";

/**
 * The four figures under the hero.
 *
 * Three come from the race log. The vert comes from Strava — every foot
 * climbed this year, training included, not just the handful of days that
 * were races. That number needs several requests to total up, so it is
 * cached for a day (see YTD_REVALIDATE_SECONDS) while the page around it
 * regenerates every half hour.
 *
 * If Strava is unconfigured or unreachable it falls back to the race log's
 * own total, and the label changes with it — the cell never reads as a
 * yearly figure while showing a races-only one.
 */
export async function StatBand() {
  const stats = raceStats();
  const yearVert = await fetchYearVert();
  const year = new Date().getFullYear();

  const cells = [
    { n: String(stats.count), label: "Races" },
    yearVert
      ? { n: yearVert, label: `Feet climbed in ${year}` }
      : { n: stats.vert, label: "Feet climbed racing" },
    { n: stats.longest, label: "Longest day" },
    {
      n: String(stats.podiums),
      label: stats.podiums === 1 ? "Podium" : "Podiums",
    },
  ];

  return (
    <section className="grid grid-cols-2 border-b border-alp-hair sm:grid-cols-4">
      {cells.map((cell, i) => (
        <div
          key={cell.label}
          className={`px-6 py-7 sm:px-8 ${i % 2 !== 0 ? "border-l border-alp-hair" : ""} ${i >= 2 ? "border-t border-alp-hair sm:border-t-0" : ""} ${i !== 0 ? "sm:border-l" : ""} sm:first:pl-12 sm:last:pr-12 lg:first:pl-20 lg:last:pr-20`}
        >
          <div className="font-display text-[40px] leading-none text-alp-accent tabular-nums sm:text-[54px]">
            {cell.n}
          </div>
          <div className="mt-2 font-mono text-[11px] tracking-[0.16em] text-alp-muted uppercase">
            {cell.label}
          </div>
        </div>
      ))}
    </section>
  );
}
