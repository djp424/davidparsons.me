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

`/contact` needs no API key, no account and no environment variables. It
validates in the browser, then hands the message to the visitor's own email
app through a prefilled `mailto:` link — subject and body already written,
addressed to `site.email` in `lib/site.ts`. They press send in their mail
client and it arrives from their real address, so replying just works.

The tradeoff is that delivery depends on the visitor having a mail app set up,
and a message is only sent if they press send there. Nothing is stored or sent
server-side. Without JavaScript the form is replaced by the plain address.

To change where messages go, edit `email` in `lib/site.ts` — that is the only
place it appears.

If you ever want true server-side delivery — the message captured whether or
not the visitor has a mail client — that needs a credential of some kind
(a [Resend](https://resend.com) API key, or SMTP details). There is no way
around that; a server cannot send mail as nobody.

## Redirects from the old site

Handled in `next.config.ts`: `/feed` to `/rss.xml`, and the WordPress
`/category/*` and `/author/*` archives to `/notes`. Post URLs are unchanged.
