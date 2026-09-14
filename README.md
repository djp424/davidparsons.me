# davidparsons.me

Personal site. Next.js 16 (App Router), Tailwind CSS v4, MDX content, deployed on Vercel.

## Running it

```bash
npm install
npm run dev
```

## How it's put together

| Path | What it holds |
| --- | --- |
| `app/` | Routes. `app/[slug]/` renders posts at the top level so the old WordPress URLs still work. |
| `content/notes/*.mdx` | The posts, with frontmatter. Filename is the URL slug. |
| `content/speaking.ts` | Every talk, with its venue link and any video/case-study links. |
| `content/races.ts` | The race log, plus `racesByYear()` and `raceStats()`. |
| `content/athlete.ts` | Climbing, gear, objectives, and the sample Strava week. |
| `app/athlete/` | The athlete section — its own palette and chrome, three routes. |
| `components/athlete/` | Chrome and rows for that section only; the writing side is untouched. |
| `lib/notes.ts` | Reads and sorts the MDX files. |
| `lib/strava.ts` | The live Strava feed and the race log. Server-only; holds the credentials. |
| `content/race-details.json` | Per-race details Strava cannot know. |
| `scripts/strava-token.mjs` | One-time Strava authorisation. Not part of the build. |
| `lib/site.ts` | Name, URL, email, nav and social links — one place to change them. |
| `components/mdx-components.tsx` | Prose styling for post bodies. |
| `design/` | The design canvas artboards the visual direction came from. Not part of the build. |

### Design tokens

Colours and fonts live in one `@theme` block at the top of `app/globals.css`.
The design is a single warm paper ground with one ink colour and no accent —
links are a hairline that firms up on hover (`.lk`), not a colour change.

`/athlete` is the deliberate exception. It runs a second palette in the same
`@theme` block, prefixed `--color-alp-*`: night granite with one alpenglow
accent, Bebas Neue over Barlow instead of Newsreader. It is a different room,
not a different house — the nav carries the same four items everywhere so
nobody lands there and hits a dead end.

The ground has to cover the whole viewport, and `app/athlete/layout.tsx` is a
child of `<body>` rather than the body itself, so `globals.css` repaints the
body from `body:has(.alpenglow)`. Change the wrapper class and that selector
together or the paper ground shows through in overscroll.

## Adding a race

The race log comes from Strava, merged with `content/race-details.json`.
Strava supplies the date, distance, vert, time and sport; the JSON supplies
everything Strava cannot know — the event's real name, where it was, how you
placed, and the organisers' links.

To add a race, open the activity on Strava, take the id off the end of the
URL, and add a block keyed by it:

```json
"20147865866": {
  "date": "2026-09-12",
  "event": "Rattlesnake Ramble",
  "location": "Eldorado Canyon State Park, CO",
  "placing": { "overall": 40, "field": 114 },
  "links": [{ "kind": "results", "url": "…" }]
}
```

Every field is optional except `date`, which is there so the file reads on
its own and so the page still has a log if Strava is unreachable during a
build. A race with only half its details still lists cleanly — a missing
figure shows as an em dash rather than a zero. `distance`, `vert`, `time` and
`sport` override Strava when the official result disagrees with the GPS.

### Which activities count as races

Strava marks races with `workout_type` — 1 on a run, 11 on a ride. **There is
no equivalent for ski touring**, so a skimo race cannot be flagged at all.
That is why the detail file has a `race` field:

- `"race": true` — a race Strava does not flag. Every ski race needs this.
- `"race": false` — drop something Strava flagged that was not really a race.
- omitted — trust Strava's flag.

A race that Strava already flags needs no entry at all; it will appear using
the activity's own name. Add an entry when you want to correct the name or
fill in the details.

Times come from Strava's *elapsed* time rather than moving time, since a race
clock does not stop when you do — override `time` with the official chip time
where you have it.

A multi-activity race (a triathlon logged as five legs, say) gets one entry
on any one of its activities, with `distance`, `vert` and `time` overridden to
the totals for the whole event.

## Adding a post

Drop a `.mdx` file in `content/notes/`. The filename becomes the URL.

```mdx
---
title: "A Post"
date: "2026-09-12"
category: "General"   # optional
excerpt: "One sentence for the index and the feed."
---

Body goes here.
```

It appears on `/notes`, in `/rss.xml` and in `/sitemap.xml` automatically.

## Contact form

No API key, no account, no third party. The form validates in the browser,
posts to `app/contact/compose/route.ts`, and gets back a prefilled `mailto:`
link — subject and body already written. The visitor's own email app opens with
the message ready, and because they press send, it arrives from their real
address and replying just works.

### Where the address lives

In the `CONTACT_EMAIL` environment variable, read server-side only. It is
never rendered into a page, never bundled into client JavaScript, and never
written into the DOM — not even after a successful submit, where the link is
held in React state and "try again" is a button rather than an anchor.

That is deliberate: a `mailto:` link sitting in the markup is exactly what
address harvesters scrape. This is obfuscation from bulk scraping, not
secrecy — anyone who posts a valid payload to `/contact/compose` gets the
address back. The endpoint validates input and rate limits to 20 requests per
IP per hour to make that tedious.

Set it locally in `.env.local` and in the Vercel project settings:

```
CONTACT_EMAIL=you@example.com
```

If it is missing the endpoint returns 503 and the form says so plainly instead
of failing silently.

### The tradeoff

Delivery depends on the visitor having a mail app set up, and a message only
arrives if they press send there. Nothing is stored server-side, so an
abandoned draft is lost. True server-side capture needs a credential of some
kind (a [Resend](https://resend.com) API key, or SMTP details) — a server
cannot send mail as nobody.

## The Strava feed

Two things on `/athlete` come from Strava.

**Recent activities** — the last ten logged (`RECENT_LIMIT`), rendered as a
table plus a per-discipline split. The spread is the point of the section, and
a column of glyphs alone does not say it. The request over-fetches
(`RECENT_FETCH`) because anything not public is dropped before the slice, so
a couple of private sessions would otherwise short the list.

**Feet climbed this year** — the vert cell in the stat band, every foot
climbed in the current year rather than just on race days. That needs several
requests to total up, so it is cached for a day
(`YTD_REVALIDATE_SECONDS`) while the page around it regenerates every half
hour. If Strava is unreachable the cell falls back to the race log's own
total and relabels itself, so it never reads as a yearly figure while showing
a races-only one.

Unlike the activity band, the year total counts private activities. It is an
aggregate — one number about the year, revealing no individual session — and
excluding them would quietly understate a real total the moment one is marked
private. There is a one-line note in `fetchYearVert` showing how to change
that.

### Setting it up

Strava has no "API key you paste into a config". Access tokens expire after six
hours, so the credential the site stores is a **refresh token**, exchanged for
a fresh access token whenever one is needed.

1. Create an app at <https://www.strava.com/settings/api>. Set **Authorization
   Callback Domain** to exactly `localhost`.
2. Put the client id and secret in `.env.local`:

   ```
   STRAVA_CLIENT_ID=12345
   STRAVA_CLIENT_SECRET=…
   ```

3. Authorise it once, in a browser:

   ```
   npm run strava:token
   ```

   It prints an authorise URL, catches the callback on the first free port it
   finds (8787 upwards), exchanges the code and prints a refresh token. Nothing
   is written to disk. Strava checks the callback *domain*, not the port, so
   whichever it lands on is fine; `PORT=9000 npm run strava:token` pins one.

4. Add that token to `.env.local` and to the Vercel project settings, for all
   three environments:

   ```
   STRAVA_REFRESH_TOKEN=…
   ```

   ```bash
   vercel env add STRAVA_CLIENT_ID
   vercel env add STRAVA_CLIENT_SECRET
   vercel env add STRAVA_REFRESH_TOKEN
   ```

With any of the three missing, `fetchRecentTraining` returns null and the
section is not rendered — the page has no gap and no error state. A
successfully fetched account with nothing in it is a different thing, and
says "Nothing logged on Strava yet."

### How it stays secure

None of the three variables is `NEXT_PUBLIC_`, so none is inlined into client
JavaScript. The stronger guarantee is the first line of `lib/strava.ts`:

```ts
import "server-only";
```

Importing that module from a client component fails the build rather than
shipping a credential to a browser. That is the property worth keeping — it
holds even if someone later adds an innocent-looking import.

What actually crosses to the browser is finished display strings (`"6.2 mi"`,
`"1:12:08"`) and public `strava.com/activities/…` URLs. The access token, the
refresh token and the raw API payload never leave the server, and no GPS or
location data is read at all.

Strava cannot distinguish trail from road — nearly everything logs as the
generic `Run` — so `SPORTS` in `lib/strava.ts` maps `Run` to `Trail`, which is
where almost all of it happens. `Road` is left to the race log, where it is set
by hand for an actual road race. It is one line to flip.

**Private activities are filtered out.** The token is scoped
`activity:read_all`, which *can* read them — so `isPublic()` drops anything
whose `visibility` is not `everyone` (or that carries the older `private`
flag) before it reaches the page. Being able to read a private ski tour and
republishing it are different decisions, and only the second one is the
site's to make. Narrow the scope to `activity:read` in
`scripts/strava-token.mjs` if you would rather the token could not see them.

Requests carry an eight-second timeout so a slow Strava cannot hang a render,
and failures log a status code rather than a response body — an OAuth error
body echoes back what was sent, secret included.

### Rate limits and freshness

`/athlete` is statically rendered with a 30-minute `revalidate`, so the page is
regenerated on a schedule rather than per visitor. That is two Strava requests a
half hour, plus roughly three more once a day for the year total, against this
app's limits of 400 per fifteen minutes and 4,000 a day. The access token is
reused across renders until it actually expires.

The two halves of that number live in `TRAINING_REVALIDATE_SECONDS`
(`lib/strava.ts`) and the `revalidate` export in `app/athlete/page.tsx` —
Next needs the second to be a literal it can read statically, so they are
written out separately. Change them together.

### If the feed stops updating

Strava may hand back a **new refresh token** at any exchange. There is nowhere
for a serverless render to write one, so `lib/strava.ts` logs a warning when it
sees one change rather than failing quietly six hours later. If the band stops
updating, check the Vercel function logs — a 400 on the token refresh means
`STRAVA_REFRESH_TOKEN` is stale. Re-run `npm run strava:token` and update it.

## Redirects from the old site

Handled in `next.config.ts`: `/feed` to `/rss.xml`, and the WordPress
`/category/*` and `/author/*` archives to `/notes`. Post URLs are unchanged.
