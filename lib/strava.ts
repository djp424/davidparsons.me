import "server-only";

import type { GlyphSport } from "@/content/races";

/**
 * The live Strava feed behind the "last two weeks" band on /athlete.
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
 * How far back the band reaches, in calendar days including today.
 *
 * A rolling window rather than "since Monday": two calendar weeks would be
 * eight days long on a Monday morning and fourteen on a Sunday night, so the
 * band would keep emptying out at the start of each week. Rolling keeps it
 * honest to its own heading and always has something in it.
 */
const WINDOW_DAYS = 14;

/**
 * Boulder. Strava already reports each activity's local wall clock, so the
 * only thing this is needed for is deciding where the window starts — a late
 * evening ski should not fall outside it because the server is UTC.
 */
const HOME_TIME_ZONE = "America/Denver";

/** A hung Strava request must not hang the page render. */
const REQUEST_TIMEOUT_MS = 8_000;

/**
 * Rows before the table gives up and points at Strava. Two weeks of this
 * athlete's training runs past twenty sessions, so this is a deliberate
 * trim rather than a ceiling nobody reaches — `hidden` below reports what
 * it cut.
 */
const MAX_ROWS = 12;

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
  /**
   * Activities in the window beyond MAX_ROWS. The totals and the split
   * above count them, so the table saying so keeps the two from
   * contradicting each other on a big fortnight.
   */
  hidden: number;
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

/**
 * The oldest date the band shows, as it reads on a wall in Boulder.
 *
 * Compared against each activity's `start_date_local`, which Strava has
 * already converted to the athlete's local clock, this makes the boundary
 * exact without the server needing to know its own timezone.
 */
function windowStart(now: Date): string {
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: HOME_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);

  const start = new Date(`${today}T00:00:00Z`);
  start.setUTCDate(start.getUTCDate() - (WINDOW_DAYS - 1));
  return start.toISOString().slice(0, 10);
}

/**
 * "Sat 13". Noon UTC on the local calendar date, so the weekday can never
 * slip. The day number is what makes it readable over a fortnight — a bare
 * "Sat" appears twice in this window and says nothing about which.
 */
function dayLabel(startDateLocal: string): string {
  const at = new Date(`${startDateLocal.slice(0, 10)}T12:00:00Z`);
  // Composed rather than asked for as one format: en-US renders a
  // weekday+day request as "9 Wed", which reads backwards here.
  const weekday = at.toLocaleDateString("en-US", {
    weekday: "short",
    timeZone: "UTC",
  });
  const day = at.toLocaleDateString("en-US", {
    day: "numeric",
    timeZone: "UTC",
  });
  return `${weekday} ${day}`;
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

/**
 * The window's public activities, newest first, formatted for display.
 *
 * Returns null when Strava is unconfigured or unreachable, which the caller
 * renders as nothing at all. An empty `activities` array is a different
 * thing: a real, successfully fetched stretch with nothing in it.
 */
export async function fetchRecentTraining(): Promise<RecentTraining | null> {
  const token = await accessToken();
  if (!token) return null;

  const start = windowStart(new Date());
  // Ask Strava for a day and a half more than the window so no timezone edge
  // can clip the oldest morning; the exact boundary is applied below.
  const after =
    Math.floor(Date.parse(`${start}T00:00:00Z`) / 1000) - 36 * 60 * 60;

  // 100 is Strava's per-page maximum, and a fortnight of this athlete's
  // training runs well past the 50 a single week needed.
  const url = `${ACTIVITIES_ENDPOINT}?after=${after}&per_page=100`;

  let response: Response;
  try {
    response = await fetch(url, {
      headers: { authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      next: { revalidate: TRAINING_REVALIDATE_SECONDS },
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

  const logged = (payload as RawActivity[]).filter(
    (a) =>
      typeof a?.id === "number" &&
      typeof a.start_date_local === "string" &&
      a.start_date_local.slice(0, 10) >= start &&
      isPublic(a),
  );

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

  const newestFirst = [...logged].sort((a, b) =>
    (b.start_date_local ?? "").localeCompare(a.start_date_local ?? ""),
  );

  const activities: LoggedActivity[] = newestFirst
    .slice(0, MAX_ROWS)
    .map((a) => ({
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
    // Every discipline in the window, not just the rows that fit above.
    sports: splitBySport(logged),
    activities,
    hidden: Math.max(0, logged.length - activities.length),
  };
}

const sportOf = (activity: RawActivity): GlyphSport =>
  SPORTS[activity.sport_type ?? activity.type ?? ""] ?? "Other";

/**
 * The window grouped by discipline, biggest first.
 *
 * This is the point of the band: a fortnight here is never one sport, and a
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
