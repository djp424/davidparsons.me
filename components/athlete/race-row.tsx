import type { Race } from "@/content/races";
import { external } from "@/lib/links";
import { SportGlyph } from "./sport-glyph";

/** The shared column track — kept next to the row so the two never drift. */
export const raceColumns =
  "sm:grid-cols-[104px_26px_minmax(0,1fr)_84px_92px_96px_100px] lg:grid-cols-[104px_26px_minmax(0,1fr)_84px_92px_96px_100px_96px]";

export function RaceTableHead() {
  return (
    <div
      className={`hidden gap-x-[18px] border-b border-alp-hair px-3 pb-3 sm:grid ${raceColumns}`}
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

export function RaceRow({ race }: { race: Race }) {
  const placeColor = race.podium ? "text-alp-accent" : "text-alp-muted";

  return (
    <div
      className={`grid grid-cols-[22px_minmax(0,1fr)] items-baseline gap-x-3 gap-y-1 border-t border-alp-hair px-3 py-3 hover:bg-alp-raised sm:items-center sm:gap-x-[18px] sm:py-[14px] ${raceColumns}`}
    >
      {/* Mobile puts the date on the metadata line instead. */}
      <span className="order-2 col-span-2 hidden font-mono text-[12px] text-alp-faint sm:order-none sm:col-span-1 sm:block">
        {race.date}
      </span>

      <span className="text-alp-muted">
        <SportGlyph sport={race.sport} />
      </span>

      <span className="flex flex-col gap-[2px]">
        {race.url ? (
          <a
            className="text-[16px] text-alp-ink hover:text-alp-accent sm:text-[17px]"
            href={race.url}
            {...external}
          >
            {race.event}
          </a>
        ) : (
          <span className="text-[16px] text-alp-ink sm:text-[17px]">
            {race.event}
          </span>
        )}
        <span className="font-mono text-[11px] text-alp-faint">
          {race.location}
        </span>
      </span>

      {/* One packed line on phones; the columns below take over at sm. */}
      <span className="col-start-2 flex flex-wrap gap-x-2 font-mono text-[11px] text-alp-faint sm:hidden">
        <span>{race.date}</span>
        <span aria-hidden="true">·</span>
        <span>{race.distance}</span>
        <span aria-hidden="true">·</span>
        <span>{race.vert}</span>
        <span aria-hidden="true">·</span>
        <span className="text-alp-body">{race.time}</span>
        <span aria-hidden="true">·</span>
        <span className={placeColor}>{race.place}</span>
        {race.note ? (
          <>
            <span aria-hidden="true">·</span>
            <span className={race.podium ? "text-alp-accent" : ""}>
              {race.note}
            </span>
          </>
        ) : null}
      </span>

      <span className="hidden text-right font-mono text-[13px] text-alp-body sm:block">
        {race.distance}
      </span>
      <span className="hidden text-right font-mono text-[13px] text-alp-body sm:block">
        {race.vert}
      </span>
      <span className="hidden text-right font-mono text-[13px] text-alp-ink sm:block">
        {race.time}
      </span>
      <span
        className={`hidden text-right font-mono text-[12px] sm:block ${placeColor}`}
      >
        {race.place}
      </span>
      <span
        className={`hidden font-mono text-[11px] lg:block ${race.podium ? "text-alp-accent" : "text-alp-faint"}`}
      >
        {race.note ?? ""}
      </span>
    </div>
  );
}
