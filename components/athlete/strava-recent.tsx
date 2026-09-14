import { elsewhere } from "@/content/athlete";
import { external } from "@/lib/links";
import {
  fetchRecentTraining,
  type RecentTraining,
  type SportSplit,
} from "@/lib/strava";
import { SportGlyph } from "./sport-glyph";

/**
 * The last two weeks of training, live from Strava.
 *
 * An async server component: the fetch, the credentials and the raw payload
 * stay on the server (see lib/strava.ts) and the browser is handed finished
 * strings. `/athlete` sets a segment `revalidate`, so this renders on a
 * schedule rather than on every request.
 *
 * Three states, deliberately distinct:
 *   null      Strava unconfigured or unreachable — render nothing at all,
 *             rather than an error or a stale-looking empty table.
 *   no rows   a real fortnight off, which is worth saying out loud.
 *   rows      the training.
 */
export async function StravaRecent() {
  const recent = await fetchRecentTraining();
  if (!recent) return null;
  return <TrainingBand recent={recent} />;
}

/**
 * The band itself, given a window. Split out from the fetch above so the
 * markup can be rendered from a fixture without a network call or a
 * credential.
 */
export function TrainingBand({ recent }: { recent: RecentTraining }) {
  const { totals, sports, activities, hidden } = recent;
  const resting = activities.length === 0;

  return (
    <section className="px-6 pt-12 sm:px-12 sm:pt-14 lg:px-20">
      <div className="flex flex-col gap-3 pb-4 sm:flex-row sm:items-baseline sm:justify-between">
        <h2 className="font-display text-[30px] tracking-[0.03em] sm:text-[34px]">
          The last two weeks
        </h2>
        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
          {!resting && (
            <>
              <span className="font-mono text-[13px] text-alp-body">
                {totals.distance}
              </span>
              <span className="font-mono text-[13px] text-alp-body">
                {totals.vert}
              </span>
              <span className="font-mono text-[13px] text-alp-body">
                {totals.time}
              </span>
            </>
          )}
          <a
            className="font-mono text-[11px] tracking-[0.12em] text-alp-accent uppercase hover:underline"
            href={elsewhere.strava}
            {...external}
          >
            On Strava &rarr;
          </a>
        </div>
      </div>

      {/* The spread, before the rows. Four sports in a fortnight is the point
          of this section, and a reader scanning the table alone would miss it. */}
      {sports.length > 1 && <SportSplits sports={sports} />}

      {resting ? (
        <p className="border border-alp-hair bg-alp-panel px-6 py-5 text-[15px] text-alp-muted">
          Nothing logged in the last two weeks.
        </p>
      ) : (
        <div className="flex flex-col border border-alp-hair bg-alp-panel">
          {activities.map((a, i) => (
            <a
              key={a.id}
              href={a.url}
              {...external}
              className={`grid grid-cols-[52px_22px_minmax(0,1fr)] items-center gap-x-4 gap-y-1 px-4 py-3 hover:bg-alp-raised sm:grid-cols-[68px_26px_minmax(0,1fr)_92px_96px_84px] sm:gap-x-[18px] sm:px-6 sm:py-4 ${i ? "border-t border-alp-hair" : ""}`}
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
            </a>
          ))}
        </div>
      )}

      {hidden > 0 && (
        <p className="pt-[10px] font-mono text-[11px] tracking-[0.1em] text-alp-faint uppercase">
          <a className="hover:text-alp-accent" href={elsewhere.strava} {...external}>
            +{hidden} more on Strava &rarr;
          </a>
        </p>
      )}
    </section>
  );
}

/**
 * One cell per discipline, biggest first — the multisport week stated rather
 * than left to be inferred from a column of glyphs.
 */
function SportSplits({ sports }: { sports: SportSplit[] }) {
  return (
    <div className="mb-[10px] flex flex-wrap gap-x-5 gap-y-2 border-y border-alp-hair py-[10px]">
      {sports.map((s) => (
        <div key={s.sport} className="flex items-center gap-[9px]">
          <span className="text-alp-accent">
            <SportGlyph sport={s.sport} size={16} />
          </span>
          <span className="font-mono text-[11px] tracking-[0.14em] text-alp-muted uppercase">
            {s.sport}
          </span>
          <span className="font-mono text-[12px] text-alp-body tabular-nums">
            {s.time}
          </span>
          <span className="font-mono text-[11px] text-alp-faint tabular-nums">
            &times;{s.count}
          </span>
        </div>
      ))}
    </div>
  );
}
