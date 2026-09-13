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
| `lib/notes.ts` | Reads and sorts the MDX files. |
| `lib/site.ts` | Name, URL, email, nav and social links — one place to change them. |
| `components/mdx-components.tsx` | Prose styling for post bodies. |
| `design/` | The design canvas artboards the visual direction came from. Not part of the build. |

### Design tokens

Colours and fonts live in one `@theme` block at the top of `app/globals.css`.
The design is a single warm paper ground with one ink colour and no accent —
links are a hairline that firms up on hover (`.lk`), not a colour change.

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

## Redirects from the old site

Handled in `next.config.ts`: `/feed` to `/rss.xml`, and the WordPress
`/category/*` and `/author/*` archives to `/notes`. Post URLs are unchanged.
