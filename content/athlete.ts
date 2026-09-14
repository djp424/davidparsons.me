export type Send = {
  route: string;
  grade: string;
  crag: string;
  year: string;
};

export type GearItem = { category: string; item: string };

export type Objective = { when: string; what: string; goal: string };

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
  strava: "https://www.strava.com/athletes/34512686",
  mountainProject: "https://www.mountainproject.com/user/djp424",
};
