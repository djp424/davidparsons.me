/**
 * Race types, formatting and the helpers the race table is built from.
 *
 * The log itself is no longer written here — it comes from Strava, merged
 * with content/race-details.json. See `fetchRaces` in lib/strava.ts and the
 * notes at the top of that JSON file for how to add a race.
 */

export type Sport = "Skimo" | "Trail" | "Road" | "Bike" | "Climb";

/**
 * Everything the site can draw a mark for.
 *
 * A race is always one of the five above — those are the ones raced. The
 * Strava feed is wider than the race log, though: a swim, a lift or a yoga
 * class is a real part of a multisport week and lands on `Other` rather than
 * being dropped or dressed up as a run.
 */
export type GlyphSport = Sport | "Other";

/** Known link kinds, so every race's links render with a consistent label. */
export type RaceLinkKind =
  | "event"
  | "results"
  | "result"
  | "splits"
  | "strava"
  | "photos"
  | "instagram"
  | "report";

export type RaceLink = {
  kind: RaceLinkKind;
  url: string;
  /** Overrides the default label for the kind. */
  label?: string;
};

export const linkLabels: Record<RaceLinkKind, string> = {
  event: "race",
  results: "results",
  result: "my result",
  splits: "splits",
  strava: "strava",
  photos: "photos",
  instagram: "instagram",
  report: "write-up",
};

export type Placing = {
  overall?: number;
  /** Finishers, when the results posted a field size. */
  field?: number;
  /** "Male 30–39", "P4 Coed" — whatever the results called it. */
  division?: string;
  divisionPlace?: number;
  divisionField?: number;
};

export type Race = {
  /** ISO. The single source of truth for ordering, grouping and display. */
  date: string;
  event: string;
  sport: GlyphSport;
  /** Optional: Strava does not report it, so a Strava-found race may lack it. */
  location?: string;
  distance?: string;
  vert?: string;
  time?: string;
  placing?: Placing;
  note?: string;
  links?: RaceLink[];
};

/** Newest first. */
export function sortRaces(races: Race[]): Race[] {
  return [...races].sort((a, b) => b.date.localeCompare(a.date));
}

export const raceYear = (race: Race) => Number(race.date.slice(0, 4));

/** "Sep 12, 2026" */
export function raceDate(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

const ordinal = (n: number) => {
  const rem100 = n % 100;
  if (rem100 >= 11 && rem100 <= 13) return `${n}th`;
  return `${n}${["th", "st", "nd", "rd"][n % 10] ?? "th"}`;
};

/** "40th of 114", or "1st, P4 Coed" when only the division was placed. */
export function formatPlacing(placing?: Placing): string | undefined {
  if (!placing) return undefined;
  if (placing.overall) {
    return placing.field
      ? `${ordinal(placing.overall)} of ${placing.field}`
      : ordinal(placing.overall);
  }
  if (placing.divisionPlace) {
    return placing.divisionField
      ? `${ordinal(placing.divisionPlace)} of ${placing.divisionField}`
      : ordinal(placing.divisionPlace);
  }
  return undefined;
}

/** "6th, Male 30–39" — only when it says something the overall place didn't. */
export function formatDivision(placing?: Placing): string | undefined {
  if (!placing?.division || !placing.divisionPlace) return undefined;
  if (!placing.overall) return placing.division;
  return `${ordinal(placing.divisionPlace)}, ${placing.division}`;
}

/** Top three overall or in a division. Derived, never hand-set. */
export function isPodium(race: Race): boolean {
  const p = race.placing;
  if (!p) return false;
  return (
    (p.overall !== undefined && p.overall <= 3) ||
    (p.divisionPlace !== undefined && p.divisionPlace <= 3)
  );
}

/** Newest first, grouped into the years they fall in. */
export function racesByYear(races: Race[]): { year: number; races: Race[] }[] {
  const groups: { year: number; races: Race[] }[] = [];
  for (const race of races) {
    const year = raceYear(race);
    const last = groups[groups.length - 1];
    if (last && last.year === year) last.races.push(race);
    else groups.push({ year, races: [race] });
  }
  return groups;
}

const feet = (vert?: string) => Number(vert?.replace(/[^0-9]/g, "") ?? 0) || 0;

const seconds = (time?: string) => {
  if (!time) return 0;
  const parts = time.split(":").map(Number);
  if (parts.some(Number.isNaN)) return 0;
  return parts.reduce((total, part) => total * 60 + part, 0);
};

/**
 * The numbers in the band at the top of the page.
 *
 * Guards an empty list: the log comes off the network now, so "no races" is
 * a state that can actually happen, and Math.min of nothing is -Infinity.
 */
export function raceStats(races: Race[]) {
  if (!races.length) {
    return {
      count: 0,
      firstYear: undefined,
      lastYear: undefined,
      span: "",
      vert: "0",
      longest: "—",
      podiums: 0,
    };
  }

  const years = races.map(raceYear);
  const first = Math.min(...years);
  const last = Math.max(...years);
  const longest = races.reduce(
    (a, b) => (seconds(b.time) > seconds(a.time) ? b : a),
    races[0],
  );

  return {
    count: races.length,
    firstYear: first as number | undefined,
    lastYear: last as number | undefined,
    /** "2026", or "2024–2026" once there is more than one year. */
    span: first === last ? `${first}` : `${first}–${last}`,
    vert: races
      .reduce((sum, r) => sum + feet(r.vert), 0)
      .toLocaleString("en-US"),
    longest: longest.time?.replace(/:\d{2}$/, "") ?? "—",
    podiums: races.filter(isPodium).length,
  };
}
