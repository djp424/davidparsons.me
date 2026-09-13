import {
  formatDivision,
  formatPlacing,
  isPodium,
  linkLabels,
  raceDate,
  type Race,
} from "@/content/races";
import { external } from "@/lib/links";
import { SportGlyph } from "./sport-glyph";

/** The shared column track — kept next to the row so the two never drift. */
const columns =
  "sm:grid-cols-[104px_26px_minmax(0,1fr)_84px_92px_96px_112px] lg:grid-cols-[104px_26px_minmax(0,1fr)_84px_92px_96px_112px_130px]";

export function RaceTableHead() {
  return (
    <div
      className={`hidden gap-x-[18px] border-b border-alp-hair px-3 pb-3 sm:grid ${columns}`}
    >
      {["Date", "", "Event", "Dist", "Vert", "Time", "Place"].map((h, i) => (
        <span
          key={h || i}
          className={`font-mono text-[10px] tracking-[0.16em] text-alp-muted uppercase ${i >= 3 ? "text-right" : ""}`}
        >
          {h}
        </span>
      ))}
      <span className="hidden font-mono text-[10px] tracking-[0.16em] text-alp-muted uppercase lg:block">
        Note
      </span>
    </div>
  );
}

/** The [results] [strava] chips, borrowed from the speaking page's idiom. */
function RaceLinks({ race }: { race: Race }) {
  if (!race.links?.length) return null;
  return (
    <span className="flex flex-wrap gap-x-[6px]">
      {race.links.map((link) => (
        <a
          key={link.url}
          href={link.url}
          className="font-mono text-[11px] tracking-[0.06em] text-alp-faint hover:text-alp-accent"
          {...external}
        >
          [{link.label ?? linkLabels[link.kind]}]
        </a>
      ))}
    </span>
  );
}

export function RaceRow({ race }: { race: Race }) {
  const podium = isPodium(race);
  const place = formatPlacing(race.placing);
  const division = formatDivision(race.placing);
  const placeColor = podium ? "text-alp-accent" : "text-alp-muted";
  const date = raceDate(race.date);

  return (
    <div
      className={`grid grid-cols-[22px_minmax(0,1fr)] items-baseline gap-x-3 gap-y-1 border-t border-alp-hair px-3 py-3 hover:bg-alp-raised sm:items-center sm:gap-x-[18px] sm:py-[14px] ${columns}`}
    >
      {/* On phones the date moves down onto the metadata line instead. */}
      <span className="hidden font-mono text-[12px] text-alp-faint sm:block">
        {date}
      </span>

      <span className="text-alp-muted">
        <SportGlyph sport={race.sport} />
      </span>

      <span className="flex flex-col gap-[3px]">
        <span className="text-[16px] text-alp-ink sm:text-[17px]">
          {race.event}
        </span>
        <span className="font-mono text-[11px] text-alp-faint">
          {race.location}
        </span>
        <RaceLinks race={race} />
      </span>

      {/* One packed line on phones; the columns below take over at sm. */}
      <span className="col-start-2 flex flex-wrap gap-x-2 font-mono text-[11px] text-alp-faint sm:hidden">
        <span>{date}</span>
        {[race.distance, race.vert].filter(Boolean).map((bit) => (
          <span key={bit}>
            <span aria-hidden="true" className="pr-2">
              ·
            </span>
            {bit}
          </span>
        ))}
        {race.time ? (
          <span>
            <span aria-hidden="true" className="pr-2">
              ·
            </span>
            <span className="text-alp-body">{race.time}</span>
          </span>
        ) : null}
        {place ? (
          <span>
            <span aria-hidden="true" className="pr-2">
              ·
            </span>
            <span className={placeColor}>{place}</span>
          </span>
        ) : null}
        {division ? (
          <span>
            <span aria-hidden="true" className="pr-2">
              ·
            </span>
            <span className={podium ? "text-alp-accent" : ""}>{division}</span>
          </span>
        ) : null}
      </span>

      <span className="hidden text-right font-mono text-[13px] text-alp-body sm:block">
        {race.distance ?? "—"}
      </span>
      <span className="hidden text-right font-mono text-[13px] text-alp-body sm:block">
        {race.vert ?? "—"}
      </span>
      <span className="hidden text-right font-mono text-[13px] text-alp-ink sm:block">
        {race.time ?? "—"}
      </span>
      <span className="hidden flex-col items-end gap-[2px] sm:flex">
        <span className={`font-mono text-[12px] ${placeColor}`}>
          {place ?? "—"}
        </span>
        {division ? (
          <span
            className={`font-mono text-[10px] ${podium ? "text-alp-accent" : "text-alp-faint"}`}
          >
            {division}
          </span>
        ) : null}
      </span>
      <span className="hidden font-mono text-[11px] leading-[1.5] text-alp-faint lg:block">
        {race.note ?? ""}
      </span>
    </div>
  );
}
