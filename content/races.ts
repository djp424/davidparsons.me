export type Sport = "Skimo" | "Trail" | "Road" | "Bike" | "Climb";

export type Race = {
  year: number;
  /** Pre-formatted for display; `year` is what grouping uses. */
  date: string;
  event: string;
  sport: Sport;
  location: string;
  distance: string;
  vert: string;
  /** Finish time, h:mm:ss or mm:ss. */
  time: string;
  /** Placing as it was posted — "58 / 190", "3rd AG", "AA wave". */
  place: string;
  /** A short aside worth surfacing: a PR, a first, a podium. */
  note?: string;
  /** Highlight the placing. Reserve it for genuine podiums. */
  podium?: boolean;
  /** Official results, when they are still online. */
  url?: string;
};

export const races: Race[] = [
  {
    year: 2026,
    date: "Aug 15, 2026",
    event: "SBT GRVL — Black",
    sport: "Bike",
    location: "Steamboat Springs, CO",
    distance: "142 mi",
    vert: "9,200 ft",
    time: "9:14:33",
    place: "412 / 1180",
  },
  {
    year: 2026,
    date: "Jul 11, 2026",
    event: "Silver Rush 50 Run",
    sport: "Trail",
    location: "Leadville, CO",
    distance: "50 mi",
    vert: "7,800 ft",
    time: "11:42:08",
    place: "96 / 402",
    note: "Longest day yet",
  },
  {
    year: 2026,
    date: "Jun 20, 2026",
    event: "Golden Gate Dirty 30",
    sport: "Trail",
    location: "Golden, CO",
    distance: "50 km",
    vert: "7,400 ft",
    time: "6:38:12",
    place: "41 / 288",
  },
  {
    year: 2026,
    date: "May 30, 2026",
    event: "Quad Rock 25",
    sport: "Trail",
    location: "Fort Collins, CO",
    distance: "25 mi",
    vert: "5,200 ft",
    time: "4:21:47",
    place: "33 / 214",
  },
  {
    year: 2026,
    date: "Apr 4, 2026",
    event: "Power of Four Skimo",
    sport: "Skimo",
    location: "Aspen, CO",
    distance: "26 mi",
    vert: "10,400 ft",
    time: "7:52:19",
    place: "58 / 190",
  },
  {
    year: 2026,
    date: "Mar 28, 2026",
    event: "Grand Traverse",
    sport: "Skimo",
    location: "Crested Butte → Aspen, CO",
    distance: "40 mi",
    vert: "7,800 ft",
    time: "11:06:44",
    place: "71 / 200",
    note: "Team",
  },
  {
    year: 2026,
    date: "Feb 21, 2026",
    event: "COSMIC Series — Monarch",
    sport: "Skimo",
    location: "Monarch, CO",
    distance: "12 mi",
    vert: "5,600 ft",
    time: "2:14:09",
    place: "12 / 64",
    note: "3rd age group",
    podium: true,
  },
  {
    year: 2026,
    date: "Feb 7, 2026",
    event: "A-Basin Enduro",
    sport: "Skimo",
    location: "Arapahoe Basin, CO",
    distance: "14 mi",
    vert: "8,100 ft",
    time: "3:41:52",
    place: "19 / 71",
  },
  {
    year: 2026,
    date: "Jan 17, 2026",
    event: "Berthoud Pass Powder Ascent",
    sport: "Skimo",
    location: "Berthoud Pass, CO",
    distance: "6 mi",
    vert: "3,400 ft",
    time: "1:28:31",
    place: "8 / 43",
  },
  {
    year: 2025,
    date: "Dec 13, 2025",
    event: "Vail Uphill",
    sport: "Skimo",
    location: "Vail, CO",
    distance: "4 mi",
    vert: "2,200 ft",
    time: "52:14",
    place: "14 / 58",
  },
  {
    year: 2025,
    date: "Jul 4, 2025",
    event: "Firecracker 50",
    sport: "Bike",
    location: "Breckenridge, CO",
    distance: "50 mi",
    vert: "7,100 ft",
    time: "5:48:20",
    place: "188 / 640",
  },
  {
    year: 2025,
    date: "Jun 14, 2025",
    event: "Leadville Heavy Half",
    sport: "Trail",
    location: "Leadville, CO",
    distance: "15.5 mi",
    vert: "3,200 ft",
    time: "2:58:41",
    place: "52 / 470",
  },
  {
    year: 2025,
    date: "May 26, 2025",
    event: "Bolder Boulder 10K",
    sport: "Road",
    location: "Boulder, CO",
    distance: "10 km",
    vert: "340 ft",
    time: "41:18",
    place: "AA wave",
    note: "PR",
  },
  {
    year: 2025,
    date: "Mar 15, 2025",
    event: "Wasatch Powderkeg",
    sport: "Skimo",
    location: "Brighton, UT",
    distance: "11 mi",
    vert: "5,900 ft",
    time: "2:51:33",
    place: "34 / 96",
  },
  {
    year: 2025,
    date: "Feb 8, 2025",
    event: "Old Man Winter Rally",
    sport: "Bike",
    location: "Lyons, CO",
    distance: "50 km",
    vert: "2,900 ft",
    time: "2:31:09",
    place: "61 / 340",
  },
  {
    year: 2025,
    date: "Jan 25, 2025",
    event: "Breck Ascent Series #3",
    sport: "Skimo",
    location: "Breckenridge, CO",
    distance: "5 mi",
    vert: "2,800 ft",
    time: "1:04:52",
    place: "9 / 37",
  },
  {
    year: 2024,
    date: "Sep 7, 2024",
    event: "Pikes Peak Ascent",
    sport: "Trail",
    location: "Manitou Springs, CO",
    distance: "13.3 mi",
    vert: "7,800 ft",
    time: "3:44:16",
    place: "211 / 1800",
  },
  {
    year: 2024,
    date: "Jun 1, 2024",
    event: "Golden Gate Dirty 30",
    sport: "Trail",
    location: "Golden, CO",
    distance: "50 km",
    vert: "7,400 ft",
    time: "7:12:55",
    place: "88 / 301",
    note: "First 50k",
  },
  {
    year: 2024,
    date: "Mar 9, 2024",
    event: "COSMIC Series — A-Basin",
    sport: "Skimo",
    location: "Arapahoe Basin, CO",
    distance: "9 mi",
    vert: "4,200 ft",
    time: "2:32:47",
    place: "41 / 68",
  },
  {
    year: 2024,
    date: "Feb 3, 2024",
    event: "Vail Uphill",
    sport: "Skimo",
    location: "Vail, CO",
    distance: "4 mi",
    vert: "2,200 ft",
    time: "1:06:38",
    place: "38 / 52",
    note: "First skimo race",
  },
];

/** Newest first, grouped into the years they fall in. */
export function racesByYear(): { year: number; races: Race[] }[] {
  const groups: { year: number; races: Race[] }[] = [];
  for (const race of races) {
    const last = groups[groups.length - 1];
    if (last && last.year === race.year) last.races.push(race);
    else groups.push({ year: race.year, races: [race] });
  }
  return groups;
}

const feet = (vert: string) => Number(vert.replace(/[^0-9]/g, "")) || 0;

/** The numbers in the band at the top of the page. */
export function raceStats() {
  const years = races.map((r) => r.year);
  const total = races.reduce((sum, r) => sum + feet(r.vert), 0);
  const longest = races.reduce((a, b) =>
    b.time.length > a.time.length || (b.time.length === a.time.length && b.time > a.time)
      ? b
      : a,
  );

  return {
    count: races.length,
    seasons: new Set(years).size,
    firstYear: Math.min(...years),
    lastYear: Math.max(...years),
    vert: total.toLocaleString("en-US"),
    longest: longest.time.replace(/:\d{2}$/, ""),
  };
}
