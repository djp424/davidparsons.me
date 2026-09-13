import { week, elsewhere } from "@/content/athlete";
import { external } from "@/lib/links";
import { SportGlyph } from "./sport-glyph";

/**
 * Sample data for now. See the note on `week` in content/athlete.ts for what
 * wiring the real Strava feed involves — this component is the only thing
 * that has to change.
 */
export function StravaWeek() {
  const { totals, activities } = week;

  return (
    <section className="px-6 pt-12 sm:px-12 sm:pt-14 lg:px-20">
      <div className="flex flex-col gap-3 pb-4 sm:flex-row sm:items-baseline sm:justify-between">
        <h2 className="font-display text-[30px] tracking-[0.03em] sm:text-[34px]">
          This week
        </h2>
        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
          <span className="font-mono text-[13px] text-alp-body">
            {totals.distance}
          </span>
          <span className="font-mono text-[13px] text-alp-body">
            {totals.vert}
          </span>
          <span className="font-mono text-[13px] text-alp-body">
            {totals.time}
          </span>
          <a
            className="font-mono text-[11px] tracking-[0.12em] text-alp-accent uppercase hover:underline"
            href={elsewhere.strava}
            {...external}
          >
            On Strava &rarr;
          </a>
        </div>
      </div>

      <div className="flex flex-col border border-alp-hair bg-alp-panel">
        {activities.map((a, i) => (
          <div
            key={a.name}
            className={`grid grid-cols-[38px_22px_minmax(0,1fr)] items-center gap-x-4 gap-y-1 px-4 py-3 hover:bg-alp-raised sm:grid-cols-[52px_26px_minmax(0,1fr)_92px_96px_84px] sm:gap-x-[18px] sm:px-6 sm:py-4 ${i ? "border-t border-alp-hair" : ""}`}
          >
            <span className="font-mono text-[11px] tracking-[0.1em] text-alp-faint uppercase">
              {a.day}
            </span>
            <span className="text-alp-accent">
              <SportGlyph sport={a.sport} />
            </span>
            <span className="text-[16px] text-alp-ink">{a.name}</span>
            <span className="col-span-3 flex gap-x-4 font-mono text-[13px] text-alp-body sm:col-span-1 sm:block sm:text-right">
              {a.distance}
              <span className="font-mono text-[13px] text-alp-body sm:hidden">
                {a.vert}
              </span>
              <span className="font-mono text-[13px] text-alp-muted sm:hidden">
                {a.time}
              </span>
            </span>
            <span className="hidden font-mono text-[13px] text-alp-body sm:block sm:text-right">
              {a.vert}
            </span>
            <span className="hidden font-mono text-[13px] text-alp-muted sm:block sm:text-right">
              {a.time}
            </span>
          </div>
        ))}
      </div>

      <p className="pt-[10px] font-mono text-[10px] tracking-[0.1em] text-alp-faint uppercase">
        [ Sample data — live Strava feed to be wired ]
      </p>
    </section>
  );
}
