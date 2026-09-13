import { raceStats } from "@/content/races";

export function StatBand() {
  const stats = raceStats();
  const cells = [
    { n: String(stats.count), label: "Races" },
    { n: stats.vert, label: "Feet climbed" },
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
