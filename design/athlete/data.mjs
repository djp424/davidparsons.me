// Sample content for the athlete-section mockups. Invented but plausible —
// these rows double as the eventual `content/races.ts` shape.

export const races = [
  { date: "Aug 15, 2026", year: 2026, event: "SBT GRVL — Black", sport: "Bike", loc: "Steamboat Springs, CO", dist: "142 mi", vert: "9,200 ft", time: "9:14:33", place: "412 / 1180", note: "" },
  { date: "Jul 11, 2026", year: 2026, event: "Silver Rush 50 Run", sport: "Trail", loc: "Leadville, CO", dist: "50 mi", vert: "7,800 ft", time: "11:42:08", place: "96 / 402", note: "Longest day yet" },
  { date: "Jun 20, 2026", year: 2026, event: "Golden Gate Dirty 30", sport: "Trail", loc: "Golden, CO", dist: "50 km", vert: "7,400 ft", time: "6:38:12", place: "41 / 288", note: "" },
  { date: "May 30, 2026", year: 2026, event: "Quad Rock 25", sport: "Trail", loc: "Fort Collins, CO", dist: "25 mi", vert: "5,200 ft", time: "4:21:47", place: "33 / 214", note: "" },
  { date: "Apr 4, 2026", year: 2026, event: "Power of Four Skimo", sport: "Skimo", loc: "Aspen, CO", dist: "26 mi", vert: "10,400 ft", time: "7:52:19", place: "58 / 190", note: "" },
  { date: "Mar 28, 2026", year: 2026, event: "Grand Traverse", sport: "Skimo", loc: "Crested Butte → Aspen, CO", dist: "40 mi", vert: "7,800 ft", time: "11:06:44", place: "71 / 200", note: "Team" },
  { date: "Feb 21, 2026", year: 2026, event: "COSMIC Series — Monarch", sport: "Skimo", loc: "Monarch, CO", dist: "12 mi", vert: "5,600 ft", time: "2:14:09", place: "12 / 64", note: "3rd age group", podium: true },
  { date: "Feb 7, 2026", year: 2026, event: "A-Basin Enduro", sport: "Skimo", loc: "Arapahoe Basin, CO", dist: "14 mi", vert: "8,100 ft", time: "3:41:52", place: "19 / 71", note: "" },
  { date: "Jan 17, 2026", year: 2026, event: "Berthoud Pass Powder Ascent", sport: "Skimo", loc: "Berthoud Pass, CO", dist: "6 mi", vert: "3,400 ft", time: "1:28:31", place: "8 / 43", note: "" },

  { date: "Dec 13, 2025", year: 2025, event: "Vail Uphill", sport: "Skimo", loc: "Vail, CO", dist: "4 mi", vert: "2,200 ft", time: "52:14", place: "14 / 58", note: "" },
  { date: "Jul 4, 2025", year: 2025, event: "Firecracker 50", sport: "Bike", loc: "Breckenridge, CO", dist: "50 mi", vert: "7,100 ft", time: "5:48:20", place: "188 / 640", note: "" },
  { date: "Jun 14, 2025", year: 2025, event: "Leadville Heavy Half", sport: "Trail", loc: "Leadville, CO", dist: "15.5 mi", vert: "3,200 ft", time: "2:58:41", place: "52 / 470", note: "" },
  { date: "May 26, 2025", year: 2025, event: "Bolder Boulder 10K", sport: "Road", loc: "Boulder, CO", dist: "10 km", vert: "340 ft", time: "41:18", place: "AA wave", note: "PR" },
  { date: "Mar 15, 2025", year: 2025, event: "Wasatch Powderkeg", sport: "Skimo", loc: "Brighton, UT", dist: "11 mi", vert: "5,900 ft", time: "2:51:33", place: "34 / 96", note: "" },
  { date: "Feb 8, 2025", year: 2025, event: "Old Man Winter Rally", sport: "Bike", loc: "Lyons, CO", dist: "50 km", vert: "2,900 ft", time: "2:31:09", place: "61 / 340", note: "" },
  { date: "Jan 25, 2025", year: 2025, event: "Breck Ascent Series #3", sport: "Skimo", loc: "Breckenridge, CO", dist: "5 mi", vert: "2,800 ft", time: "1:04:52", place: "9 / 37", note: "" },

  { date: "Sep 7, 2024", year: 2024, event: "Pikes Peak Ascent", sport: "Trail", loc: "Manitou Springs, CO", dist: "13.3 mi", vert: "7,800 ft", time: "3:44:16", place: "211 / 1800", note: "" },
  { date: "Jun 1, 2024", year: 2024, event: "Golden Gate Dirty 30", sport: "Trail", loc: "Golden, CO", dist: "50 km", vert: "7,400 ft", time: "7:12:55", place: "88 / 301", note: "First 50k" },
  { date: "Mar 9, 2024", year: 2024, event: "COSMIC Series — A-Basin", sport: "Skimo", loc: "Arapahoe Basin, CO", dist: "9 mi", vert: "4,200 ft", time: "2:32:47", place: "41 / 68", note: "" },
  { date: "Feb 3, 2024", year: 2024, event: "Vail Uphill", sport: "Skimo", loc: "Vail, CO", dist: "4 mi", vert: "2,200 ft", time: "1:06:38", place: "38 / 52", note: "First skimo race" },
];

export const stats = [
  { n: "20", label: "Races" },
  { n: "3", label: "Seasons" },
  { n: "118,400", label: "Feet climbed" },
  { n: "11:42", label: "Longest day" },
];

export const week = {
  totals: { dist: "41.7 mi", vert: "7,850 ft", time: "6h 22m" },
  activities: [
    { day: "Sat", name: "Green Mountain via Amphitheater", sport: "Run", dist: "6.2 mi", vert: "2,540 ft", time: "1:12:08" },
    { day: "Thu", name: "Marshall Mesa tempo", sport: "Run", dist: "9.4 mi", vert: "620 ft", time: "1:08:44" },
    { day: "Wed", name: "Flagstaff repeats", sport: "Ride", dist: "18.1 mi", vert: "2,100 ft", time: "1:34:02" },
    { day: "Tue", name: "Eldo approach + Bastille Crack", sport: "Climb", dist: "1.8 mi", vert: "1,100 ft", time: "2:27:00" },
  ],
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
  ],
  crags: ["Eldorado Canyon", "Boulder Canyon", "Flagstaff Mountain", "The Flatirons", "Lumpy Ridge, RMNP"],
};

export const gear = [
  { cat: "Skis", item: "Ski Trab Gara Aero World Cup" },
  { cat: "Boots", item: "Scarpa Alien 1.0" },
  { cat: "Skins", item: "Pomoca Race Pro" },
  { cat: "Trail shoes", item: "Hoka Tecton X 3" },
  { cat: "Vest", item: "Black Diamond Distance 15" },
  { cat: "Gravel bike", item: "Allied Able" },
  { cat: "Climbing shoes", item: "La Sportiva Katana Lace" },
  { cat: "Watch", item: "Coros Vertix 2" },
];

export const nextUp = [
  { when: "Dec 2026", what: "Vail Uphill", goal: "Sub 48:00" },
  { when: "Jan–Mar 2027", what: "COSMIC Series", goal: "Finish the full series" },
  { when: "Mar 2027", what: "Grand Traverse", goal: "Sub 10:00" },
  { when: "Apr 2027", what: "Power of Four", goal: "Top 40" },
  { when: "Summer 2027", what: "First 100K", goal: "Race TBD" },
  { when: "Ongoing", what: "Boulder Canyon", goal: "Send a 5.13" },
];

export const nav = [
  { label: "Notes", href: "#" },
  { label: "Speaking", href: "#" },
  { label: "Athlete", href: "#", current: true },
  { label: "Contact", href: "#" },
];
