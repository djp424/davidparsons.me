/**
 * The race log.
 *
 * TO ADD A RACE: copy the block below to anywhere in `races` and edit it.
 * Order does not matter — the list sorts itself by date. Everything except
 * `date`, `event`, `sport` and `location` is optional, so a race with only
 * half its details still lists cleanly.
 *
 *   {
 *     date: "2027-03-27",              // ISO. The year and the pretty date
 *     event: "Grand Traverse",         // are both derived from this.
 *     sport: "Skimo",                  // Skimo | Trail | Road | Bike | Climb
 *     location: "Crested Butte, CO",
 *     distance: "40 mi",
 *     vert: "7,800 ft",
 *     time: "11:06:44",
 *     placing: { overall: 71, field: 200 },
 *     note: "Team, with Annie Weinmann",
 *     links: [
 *       { kind: "results", url: "…" },
 *       { kind: "strava", url: "…" },
 *     ],
 *   },
 *
 * A top-three finish overall or in a division is highlighted automatically —
 * there is no flag to remember to set.
 */

export type Sport = "Skimo" | "Trail" | "Road" | "Bike" | "Climb";

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
  sport: Sport;
  location: string;
  distance?: string;
  vert?: string;
  time?: string;
  placing?: Placing;
  note?: string;
  links?: RaceLink[];
};

const log: Race[] = [
  {
    date: "2026-09-12",
    event: "Rattlesnake Ramble",
    sport: "Trail",
    location: "Eldorado Canyon State Park, CO",
    distance: "4.3 mi",
    time: "38:12",
    placing: { overall: 40, field: 114 },
    links: [
      { kind: "event", url: "https://www.rattlesnakeramble.org/" },
      {
        kind: "results",
        url: "https://www.opensplittime.org/events/2026-rattlesnake-ramble-full-course/spread",
      },
      {
        kind: "splits",
        url: "https://www.opensplittime.org/efforts/2026-rattlesnake-ramble-full-course-david-parsons",
      },
      { kind: "strava", url: "https://www.strava.com/activities/20147865866" },
    ],
  },
  {
    date: "2026-08-15",
    event: "Ed Anacker Bridger Ridge Run",
    sport: "Trail",
    location: "Bozeman, MT",
    distance: "19.9 mi",
    vert: "6,800 ft",
    time: "4:44:25",
    placing: {
      overall: 34,
      division: "Male 30–39",
      divisionPlace: 6,
    },
    note: "9,500 ft of descent off the ridge",
    links: [
      { kind: "results", url: "https://my.raceresult.com/415694/" },
      {
        kind: "result",
        url: "https://my.raceresult.com/415694/details1?pid=41",
      },
      { kind: "strava", url: "https://www.strava.com/activities/19758708717" },
      {
        kind: "photos",
        url: "https://www.kurtwehde.com/Bridger-Ridge-Run-2026",
      },
      {
        kind: "instagram",
        url: "https://www.instagram.com/p/DcG9AQMkV2Z/?img_index=1",
      },
    ],
  },
  {
    date: "2026-02-21",
    event: "Audi Power of Four",
    sport: "Skimo",
    location: "Aspen, CO",
    distance: "24 mi",
    vert: "10,000 ft",
    time: "7:43:41",
    placing: { division: "P4 Coed", divisionPlace: 1, divisionField: 13 },
    note: "Freaks in the Steeps, with Annie Weinmann",
    links: [
      { kind: "results", url: "https://my.raceresult.com/369443/" },
      {
        kind: "result",
        url: "https://my.raceresult.com/369443/details?pid=76",
      },
    ],
  },
];

/** Newest first, whatever order they were written in above. */
export const races: Race[] = [...log].sort((a, b) =>
  b.date.localeCompare(a.date),
);

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
export function racesByYear(): { year: number; races: Race[] }[] {
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

/** The numbers in the band at the top of the page. */
export function raceStats() {
  const years = races.map(raceYear);
  const first = Math.min(...years);
  const last = Math.max(...years);
  const longest = races.reduce(
    (a, b) => (seconds(b.time) > seconds(a.time) ? b : a),
    races[0],
  );

  return {
    count: races.length,
    firstYear: first,
    lastYear: last,
    /** "2026", or "2024–2026" once there is more than one year. */
    span: first === last ? `${first}` : `${first}–${last}`,
    vert: races
      .reduce((sum, r) => sum + feet(r.vert), 0)
      .toLocaleString("en-US"),
    longest: longest.time?.replace(/:\d{2}$/, "") ?? "—",
    podiums: races.filter(isPodium).length,
  };
}
