import type { Sport } from "./races";

export type Activity = {
  day: string;
  name: string;
  sport: Sport;
  distance: string;
  vert: string;
  time: string;
};

export type Send = {
  route: string;
  grade: string;
  crag: string;
  year: string;
};

export type GearItem = { category: string; item: string };

export type Objective = { when: string; what: string; goal: string };

/**
 * Sample week. Swap `week` for a Strava fetch once the API app exists:
 * exchange STRAVA_REFRESH_TOKEN at /oauth/token for an access token (they
 * expire after ~6 hours, so a static token will not hold), call
 * /athlete/activities, and cache the result with `revalidate` so the page
 * is not hitting Strava on every request. Nothing outside this module and
 * <StravaWeek /> needs to change.
 */
export const week = {
  totals: { distance: "41.7 mi", vert: "7,850 ft", time: "6h 22m" },
  activities: [
    {
      day: "Sat",
      name: "Green Mountain via Amphitheater",
      sport: "Trail",
      distance: "6.2 mi",
      vert: "2,540 ft",
      time: "1:12:08",
    },
    {
      day: "Thu",
      name: "Marshall Mesa tempo",
      sport: "Trail",
      distance: "9.4 mi",
      vert: "620 ft",
      time: "1:08:44",
    },
    {
      day: "Wed",
      name: "Flagstaff repeats",
      sport: "Bike",
      distance: "18.1 mi",
      vert: "2,100 ft",
      time: "1:34:02",
    },
    {
      day: "Tue",
      name: "Eldo approach + Bastille Crack",
      sport: "Climb",
      distance: "1.8 mi",
      vert: "1,100 ft",
      time: "2:27:00",
    },
  ] satisfies Activity[],
};

export const climbing = {
  bests: [
    { label: "Hardest redpoint", value: "5.12c" },
    { label: "Hardest boulder", value: "V7" },
    { label: "Hardest trad lead", value: "5.11a" },
  ],
  sends: [
    { route: "The Naked Edge", grade: "5.11b", crag: "Eldorado Canyon", year: "2026" },
    { route: "The Yellow Spur", grade: "5.10a", crag: "Eldorado Canyon", year: "2025" },
    { route: "Monkey Traverse", grade: "V4", crag: "Flagstaff Mountain", year: "2025" },
    { route: "Bastille Crack", grade: "5.7", crag: "Eldorado Canyon", year: "2024" },
  ] satisfies Send[],
  crags: [
    "Eldorado Canyon",
    "Boulder Canyon",
    "Flagstaff Mountain",
    "The Flatirons",
    "Lumpy Ridge, RMNP",
  ],
};

export const gear: GearItem[] = [
  { category: "Skis", item: "Ski Trab Gara Aero World Cup" },
  { category: "Boots", item: "Scarpa Alien 1.0" },
  { category: "Skins", item: "Pomoca Race Pro" },
  { category: "Trail shoes", item: "Hoka Tecton X 3" },
  { category: "Vest", item: "Black Diamond Distance 15" },
  { category: "Gravel bike", item: "Allied Able" },
  { category: "Climbing shoes", item: "La Sportiva Katana Lace" },
  { category: "Watch", item: "Coros Vertix 2" },
];

export const objectives: Objective[] = [
  { when: "Dec 2026", what: "Vail Uphill", goal: "Sub 48:00" },
  { when: "Jan–Mar 2027", what: "COSMIC Series", goal: "Finish the full series" },
  { when: "Mar 2027", what: "Grand Traverse", goal: "Sub 10:00" },
  { when: "Apr 2027", what: "Power of Four", goal: "Top 40" },
  { when: "Summer 2027", what: "First 100K", goal: "Race TBD" },
  { when: "Ongoing", what: "Boulder Canyon", goal: "Send a 5.13" },
];

export const elsewhere = {
  strava: "https://www.strava.com/athletes/djp424",
  mountainProject: "https://www.mountainproject.com/user/djp424",
};
