import "server-only";

import {
  sortRaces,
  type GlyphSport,
  type Placing,
  type Race,
  type RaceLink,
} from "@/content/races";
import raceDetails from "@/content/race-details.json";

/**
 * The live Strava feed behind the "recent activities" band on /athlete, and
 * the year-to-date vert in the stat band above it.
 *
 * `server-only` is the first line of defence: importing this module from a
 * client component is a build error, so the credentials below can never end
 * up in the JavaScript a browser downloads. What crosses to the browser is
 * finished display strings ("6.2 mi", "1:12:08") and a public activity URL.
 * The access token, the refresh token and the raw Strava payload stay here.
 *
 * Strava's API is not an API key you attach to a request — access tokens
 * expire after six hours. The long-lived credential is a refresh token,
 * exchanged at /oauth/token for a short-lived access token. Three env vars,
 * none of them NEXT_PUBLIC_:
 *
 *   STRAVA_CLIENT_ID       the app's numeric id
 *   STRAVA_CLIENT_SECRET   the app's secret
 *   STRAVA_REFRESH_TOKEN   from `npm run strava:token` (see the README)
 *
 * Missing any of the three, this returns null and the section is simply not
 * rendered — the page never half-loads or shows a broken state.
 */

const TOKEN_ENDPOINT = "https://www.strava.com/oauth/token";
const ACTIVITIES_ENDPOINT = "https://www.strava.com/api/v3/athlete/activities";

/**
 * How long a rendered band stays good. This app's limits (per the
 * x-ratelimit-limit header) are 400 requests per fifteen minutes and 4,000 a
 * day; at this interval the site spends two per half hour and the access
 * token below is reused across all of them.
 *
 * `app/athlete/page.tsx` sets the same number as its segment `revalidate`.
 * Next needs that one to be a literal it can read statically, so the two are
 * written out separately — change them together.
 */
export const TRAINING_REVALIDATE_SECONDS = 1800;

/**
 * How long the year-to-date vert stays cached: one day.
 *
 * That figure needs several requests to total up a year of training, so it
 * gets its own, much longer TTL than the activity band. The page still
 * regenerates every half hour; this number just comes out of Next's data
 * cache all but once a day.
 */
export const YTD_REVALIDATE_SECONDS = 86_400;

/**
 * Boulder. Strava already reports each activity's local wall clock, so the
 * only thing this is needed for is deciding where the window starts — a late
 * evening ski should not fall outside it because the server is UTC.
 */
const HOME_TIME_ZONE = "America/Denver";

/** A hung Strava request must not hang the page render. */
const REQUEST_TIMEOUT_MS = 8_000;

/** How many activities the band lists. */
const RECENT_LIMIT = 10;

/**
 * Activities to ask for to fill those rows. Anything not public is dropped
 * before the slice, so the request has to over-fetch or a couple of private
 * sessions would short the list.
 */
const RECENT_FETCH = 30;

/** Strava's per-page maximum, used when totalling the year. */
const MAX_PER_PAGE = 200;

/**
 * Pages to walk before giving up on the year total. At 200 an activity
 * that is 2,000 sessions — far past a heavy year, so hitting this means
 * something is wrong rather than that the athlete is busy.
 */
const MAX_YTD_PAGES = 10;

/** Strava's `sport_type`, collapsed onto the marks the site actually draws. */
const SPORTS: Record<string, GlyphSport> = {
  AlpineSki: "Skimo",
  BackcountrySki: "Skimo",
  NordicSki: "Skimo",
  RollerSki: "Skimo",
  Snowboard: "Skimo",
  Snowshoe: "Skimo",
  TrailRun: "Trail",
  Hike: "Trail",
  Walk: "Trail",
  // Strava cannot tell trail from road: almost everything is logged as the
  // generic `Run`, and out of Boulder almost all of it is on dirt. So the
  // runner mark is the honest default and `Road` — a finish flag — is left
  // to the race log, where it is set by hand for an actual road race. Flip
  // this one line if the balance ever changes.
  Run: "Trail",
  // A treadmill is training time, not a trail.
  VirtualRun: "Other",
  Ride: "Bike",
  GravelRide: "Bike",
  MountainBikeRide: "Bike",
  EBikeRide: "Bike",
  EMountainBikeRide: "Bike",
  VirtualRide: "Bike",
  Handcycle: "Bike",
  Velomobile: "Bike",
  RockClimbing: "Climb",
  IceClimb: "Climb",
};

export type LoggedActivity = {
  id: number;
  /** "Sat" */
  day: string;
  name: string;
  sport: GlyphSport;
  distance: string;
  vert: string;
  time: string;
  url: string;
};

/** One discipline's share of the window — the multisport spread, summarised. */
export type SportSplit = {
  sport: GlyphSport;
  count: number;
  time: string;
};

export type RecentTraining = {
  totals: { distance: string; vert: string; time: string };
  /** Biggest discipline first. Empty if nothing was logged. */
  sports: SportSplit[];
  activities: LoggedActivity[];
};

/** The handful of fields used here, out of a very large response. */
type RawActivity = {
  id?: number;
  name?: string;
  sport_type?: string;
  type?: string;
  distance?: number;
  total_elevation_gain?: number;
  moving_time?: number;
  elapsed_time?: number;
  start_date_local?: string;
  /** 1 on a run and 11 on a ride mean "race". Absent on most sports. */
  workout_type?: number | null;
  private?: boolean;
  visibility?: string;
};

const warned = new Set<string>();

/** Log a given problem once per server instance rather than once per render. */
function warnOnce(key: string, message: string) {
  if (warned.has(key)) return;
  warned.add(key);
  console.warn(message);
}

const METERS_TO_MILES = 0.000621371;
const METERS_TO_FEET = 3.28084;

const miles = (meters: number) => `${(meters * METERS_TO_MILES).toFixed(1)} mi`;

const feet = (meters: number) =>
  `${Math.round(meters * METERS_TO_FEET).toLocaleString("en-US")} ft`;

const pad = (n: number) => String(n).padStart(2, "0");

/** "1:12:08" for an hour-plus, "38:12" under it — how a result reads. */
function duration(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return h ? `${h}:${pad(m)}:${pad(s % 60)}` : `${m}:${pad(s % 60)}`;
}

/** "6h 22m" — a running total, where seconds are noise. */
function hoursAndMinutes(totalSeconds: number): string {
  const minutes = Math.round(Math.max(0, totalSeconds) / 60);
  const h = Math.floor(minutes / 60);
  return h ? `${h}h ${minutes % 60}m` : `${minutes}m`;
}

/** The current year where the athlete lives, not where the server runs. */
function currentYear(now: Date): number {
  return Number(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: HOME_TIME_ZONE,
      year: "numeric",
    }).format(now),
  );
}

/**
 * "Sep 13". Noon UTC on the local calendar date, so the day can never slip.
 *
 * A weekday was enough while the band was a bounded fortnight. "The last ten"
 * has no span to lean on — after a quiet spell it can reach back weeks — so
 * the label carries a month and a date instead.
 */
function dayLabel(startDateLocal: string): string {
  return new Date(`${startDateLocal.slice(0, 10)}T12:00:00Z`).toLocaleDateString(
    "en-US",
    { month: "short", day: "numeric", timeZone: "UTC" },
  );
}

/**
 * Only activities the world can already see.
 *
 * The token is scoped `activity:read_all`, which can read private activities
 * too — so this is the guard that stops one from being republished here just
 * because the scope permits it. Strava sends `visibility` on current
 * responses and `private` on older ones; either saying "not public" is
 * enough to drop the row.
 */
function isPublic(activity: RawActivity): boolean {
  if (activity.private) return false;
  if (activity.visibility && activity.visibility !== "everyone") return false;
  return true;
}

let cachedToken: { token: string; expiresAt: number } | null = null;

/**
 * A valid access token, refreshed only when the one in hand is close to
 * expiring. The cache is per server instance and holds nothing on disk.
 */
async function accessToken(): Promise<string | null> {
  const clientId = process.env.STRAVA_CLIENT_ID;
  const clientSecret = process.env.STRAVA_CLIENT_SECRET;
  const refreshToken = process.env.STRAVA_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    warnOnce(
      "unconfigured",
      "Strava is not configured — set STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET " +
        "and STRAVA_REFRESH_TOKEN. The training band stays hidden until then.",
    );
    return null;
  }

  // A minute of headroom so a token cannot expire mid-render.
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.token;
  }

  let response: Response;
  try {
    response = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    console.error("Strava token refresh could not be sent:", describe(error));
    return null;
  }

  if (!response.ok) {
    // The error body echoes back what was sent, secret included. Log the
    // status and nothing else.
    console.error(
      `Strava token refresh failed with ${response.status}. If this is a 400, ` +
        "STRAVA_REFRESH_TOKEN is stale — run `npm run strava:token` again.",
    );
    return null;
  }

  let data: {
    access_token?: string;
    expires_at?: number;
    refresh_token?: string;
  };
  try {
    data = await response.json();
  } catch {
    console.error("Strava token response was not readable JSON.");
    return null;
  }

  if (!data.access_token) {
    console.error("Strava token refresh returned no access token.");
    return null;
  }

  // Strava may hand back a new refresh token at any exchange. There is
  // nowhere to write it to from here, so say so loudly rather than let the
  // site quietly stop updating in six hours' time.
  if (data.refresh_token && data.refresh_token !== refreshToken) {
    console.warn(
      "Strava rotated the refresh token. Update STRAVA_REFRESH_TOKEN in the " +
        "Vercel project settings (re-run `npm run strava:token`) or the feed " +
        "will stop refreshing once the current token expires.",
    );
  }

  cachedToken = {
    token: data.access_token,
    expiresAt: (data.expires_at ?? Math.floor(Date.now() / 1000) + 3600) * 1000,
  };
  return cachedToken.token;
}

/** Never let an upstream error object reach a log verbatim. */
function describe(error: unknown): string {
  if (error instanceof Error) return `${error.name}: ${error.message}`;
  return "unknown error";
}

const sportOf = (activity: RawActivity): GlyphSport =>
  SPORTS[activity.sport_type ?? activity.type ?? ""] ?? "Other";

/**
 * A shared guard for the activity endpoints: turns a Response into a list, or
 * null, logging the reason without ever echoing a body.
 */
async function readActivities(
  url: string,
  token: string,
  revalidate: number,
): Promise<RawActivity[] | null> {
  let response: Response;
  try {
    response = await fetch(url, {
      headers: { authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      next: { revalidate },
    });
  } catch (error) {
    console.error("Strava activities request failed:", describe(error));
    return null;
  }

  if (response.status === 401) {
    // The cached token was rejected. Drop it so the next render refreshes.
    cachedToken = null;
    console.error("Strava rejected the access token (401).");
    return null;
  }

  if (response.status === 429) {
    console.error("Strava rate limit hit (429) — serving nothing this render.");
    return null;
  }

  if (!response.ok) {
    console.error(`Strava activities request returned ${response.status}.`);
    return null;
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch (error) {
    console.error("Strava activities response was unreadable:", describe(error));
    return null;
  }

  if (!Array.isArray(payload)) {
    console.error("Strava activities response was not a list.");
    return null;
  }

  return payload as RawActivity[];
}

/**
 * The ten most recent public activities, newest first, ready for display.
 *
 * Returns null when Strava is unconfigured or unreachable, which the caller
 * renders as nothing at all. An empty `activities` array is a different
 * thing: a real, successfully fetched account with nothing in it.
 */
export async function fetchRecentTraining(): Promise<RecentTraining | null> {
  const token = await accessToken();
  if (!token) return null;

  // No `after`: the band is "the last ten", not a date range, so Strava's
  // default newest-first ordering is the whole query.
  const payload = await readActivities(
    `${ACTIVITIES_ENDPOINT}?per_page=${RECENT_FETCH}`,
    token,
    TRAINING_REVALIDATE_SECONDS,
  );
  if (!payload) return null;

  const logged = payload
    .filter(
      (a) =>
        typeof a?.id === "number" &&
        typeof a.start_date_local === "string" &&
        isPublic(a),
    )
    .sort((a, b) =>
      (b.start_date_local ?? "").localeCompare(a.start_date_local ?? ""),
    )
    .slice(0, RECENT_LIMIT);

  const totals = logged.reduce<{
    distance: number;
    vert: number;
    seconds: number;
  }>(
    (sum, a) => ({
      distance: sum.distance + (a.distance ?? 0),
      vert: sum.vert + (a.total_elevation_gain ?? 0),
      seconds: sum.seconds + (a.moving_time ?? a.elapsed_time ?? 0),
    }),
    { distance: 0, vert: 0, seconds: 0 },
  );

  const activities: LoggedActivity[] = logged.map((a) => ({
    id: a.id as number,
    day: dayLabel(a.start_date_local as string),
    name: (a.name ?? "Untitled").trim().slice(0, 90),
    sport: sportOf(a),
    distance: miles(a.distance ?? 0),
    vert: feet(a.total_elevation_gain ?? 0),
    time: duration(a.moving_time ?? a.elapsed_time ?? 0),
    url: `https://www.strava.com/activities/${a.id}`,
  }));

  return {
    totals: {
      distance: miles(totals.distance),
      vert: feet(totals.vert),
      time: hoursAndMinutes(totals.seconds),
    },
    // The same ten the table lists, so the header can never contradict it.
    sports: splitBySport(logged),
    activities,
  };
}

/**
 * Total feet climbed so far this year, formatted "142,318" — or null if
 * Strava cannot be reached, which the stat band falls back from.
 *
 * This walks every activity since 1 January, which is several requests, so
 * it is cached for a day (YTD_REVALIDATE_SECONDS) rather than at the band's
 * half-hourly rate.
 *
 * Unlike the band, this counts private activities too. It is an aggregate:
 * it publishes a single number about the year and reveals no individual
 * session, and leaving them out would quietly understate a real total the
 * moment one gets marked private. Add `.filter(isPublic)` below to change
 * that.
 */
export async function fetchYearVert(): Promise<string | null> {
  const token = await accessToken();
  if (!token) return null;

  const year = currentYear(new Date());
  // Local midnight on 1 January, minus a day so no zone offset can clip it.
  const after = Math.floor(Date.parse(`${year}-01-01T00:00:00Z`) / 1000) - 86_400;

  let meters = 0;
  let counted = 0;

  for (let page = 1; page <= MAX_YTD_PAGES; page++) {
    const batch = await readActivities(
      `${ACTIVITIES_ENDPOINT}?after=${after}&per_page=${MAX_PER_PAGE}&page=${page}`,
      token,
      YTD_REVALIDATE_SECONDS,
    );

    // A failure part-way through would silently undercount the year, which
    // is worse than showing the race-log figure the stat band falls back to.
    if (!batch) return null;

    for (const activity of batch) {
      // Strava pages by start_date; re-check the year on the local clock so a
      // late-December session cannot leak in from the slack above.
      if (activity.start_date_local?.slice(0, 4) !== String(year)) continue;
      meters += activity.total_elevation_gain ?? 0;
      counted++;
    }

    if (batch.length < MAX_PER_PAGE) break;

    if (page === MAX_YTD_PAGES) {
      console.warn(
        `Strava year total stopped at ${MAX_YTD_PAGES} pages — the figure ` +
          "may be short. Raise MAX_YTD_PAGES if this is a real year.",
      );
    }
  }

  if (!counted) return null;
  return Math.round(meters * METERS_TO_FEET).toLocaleString("en-US");
}

/**
 * The ten grouped by discipline, biggest first.
 *
 * This is the point of the band: ten sessions here are never one sport, and a
 * column of running rows reads as a running block unless the spread is said
 * out loud.
 */
function splitBySport(logged: RawActivity[]): SportSplit[] {
  const bySport = new Map<GlyphSport, { count: number; seconds: number }>();

  for (const activity of logged) {
    const sport = sportOf(activity);
    const running = bySport.get(sport) ?? { count: 0, seconds: 0 };
    running.count += 1;
    running.seconds += activity.moving_time ?? activity.elapsed_time ?? 0;
    bySport.set(sport, running);
  }

  return [...bySport.entries()]
    .sort(([, a], [, b]) => b.seconds - a.seconds)
    .map(([sport, { count, seconds }]) => ({
      sport,
      count,
      time: hoursAndMinutes(seconds),
    }));
}


/* -------------------------------------------------------------------------
   Races
   ---------------------------------------------------------------------- */

/**
 * What content/race-details.json holds for one activity — everything Strava
 * cannot know, plus overrides for the things it reports differently from the
 * official results.
 */
type RaceDetail = {
  date?: string;
  event?: string;
  location?: string;
  sport?: GlyphSport;
  distance?: string;
  vert?: string;
  time?: string;
  placing?: Placing;
  note?: string;
  links?: RaceLink[];
  /** Overrides Strava: true forces a race in, false forces one out. */
  race?: boolean;
};

const DETAILS = raceDetails as unknown as Record<string, RaceDetail>;

/**
 * Strava's `workout_type` values that mean "this was a race": 1 on a run,
 * 11 on a ride.
 *
 * There is no equivalent for ski touring, which is why the detail file has a
 * `race` flag at all — a skimo race cannot be marked as one on Strava, so
 * every one of them would otherwise be invisible here.
 */
const RACE_WORKOUT_TYPES = new Set([1, 11]);

/** Pages of history to walk when rebuilding the race log. */
const MAX_RACE_PAGES = 12;

function isRace(activity: RawActivity): boolean {
  const detail = DETAILS[String(activity.id)];
  if (detail?.race !== undefined) return detail.race;
  return RACE_WORKOUT_TYPES.has(activity.workout_type ?? -1);
}

/**
 * Every race, newest first: Strava for the date and the numbers, the detail
 * file for the name, the placing and the links.
 *
 * Walks the whole history rather than a window — a race log is not a recent
 * feed — so it shares the year total's daily cache rather than the activity
 * band's half-hourly one.
 *
 * Returns null if Strava cannot be reached, which the pages fall back from
 * using the detail file alone.
 */
export async function fetchRaces(): Promise<Race[] | null> {
  const token = await accessToken();
  if (!token) return null;

  const races: Race[] = [];

  for (let page = 1; page <= MAX_RACE_PAGES; page++) {
    const batch = await readActivities(
      `${ACTIVITIES_ENDPOINT}?per_page=${MAX_PER_PAGE}&page=${page}`,
      token,
      YTD_REVALIDATE_SECONDS,
    );

    // Half a history is a wrong race log, not a short one.
    if (!batch) return null;

    for (const activity of batch) {
      if (typeof activity.id !== "number") continue;
      if (typeof activity.start_date_local !== "string") continue;
      if (!isRace(activity)) continue;

      const detail = DETAILS[String(activity.id)] ?? {};
      races.push({
        date: activity.start_date_local.slice(0, 10),
        event: detail.event ?? activity.name?.trim() ?? "Untitled",
        sport: detail.sport ?? sportOf(activity),
        location: detail.location,
        distance: detail.distance ?? miles(activity.distance ?? 0),
        vert: detail.vert ?? feet(activity.total_elevation_gain ?? 0),
        // Official chip time when the detail file has one; Strava's elapsed
        // time otherwise, since a race clock does not stop when you do.
        time: detail.time ?? duration(activity.elapsed_time ?? activity.moving_time ?? 0),
        placing: detail.placing,
        note: detail.note,
        links: [
          ...(detail.links ?? []),
          { kind: "strava" as const, url: `https://www.strava.com/activities/${activity.id}` },
        ],
      });
    }

    if (batch.length < MAX_PER_PAGE) break;
  }

  return sortRaces(races);
}

/**
 * The race log as the detail file alone describes it.
 *
 * Only reached when Strava is unavailable during a build. It keeps the page
 * from deploying with an empty race section, at the cost of the figures the
 * detail file does not carry.
 */
export function racesFromDetailsOnly(): Race[] {
  const races: Race[] = [];
  for (const [id, detail] of Object.entries(DETAILS)) {
    if (!detail?.date || detail.race === false) continue;
    races.push({
      date: detail.date,
      event: detail.event ?? "Untitled",
      sport: detail.sport ?? "Other",
      location: detail.location,
      distance: detail.distance,
      vert: detail.vert,
      time: detail.time,
      placing: detail.placing,
      note: detail.note,
      links: [
        ...(detail.links ?? []),
        { kind: "strava" as const, url: `https://www.strava.com/activities/${id}` },
      ],
    });
  }
  return sortRaces(races);
}

/**
 * The race log, with the detail-file fallback already applied.
 *
 * Both the athlete page and the results page call this; React memoises the
 * underlying fetches for the render, so asking twice costs one walk.
 */
export async function getRaces(): Promise<Race[]> {
  return (await fetchRaces()) ?? racesFromDetailsOnly();
}
