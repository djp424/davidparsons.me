import { NextResponse } from "next/server";

/**
 * Builds the mailto: link for the contact form.
 *
 * The address lives only in CONTACT_EMAIL, server-side, and is never rendered
 * into any page. That keeps it out of the HTML that address harvesters scrape.
 * It is not a secret — anyone who posts here gets it back — but bulk scrapers
 * read markup, they don't fill in forms.
 */

const hits = new Map<string, number[]>();
const WINDOW = 60 * 60 * 1000;
const MAX_PER_HOUR = 20;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW);
  hits.set(ip, [...recent, now]);
  if (hits.size > 5000) hits.clear();
  return recent.length >= MAX_PER_HOUR;
}

export async function POST(request: Request) {
  const to = process.env.CONTACT_EMAIL;
  if (!to) {
    console.error("CONTACT_EMAIL is not set — the contact form cannot build a link.");
    return NextResponse.json({ error: "unconfigured" }, { status: 503 });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: { name?: unknown; email?: unknown; message?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim().slice(0, 120);
  const from = String(body.email ?? "").trim().slice(0, 200);
  const message = String(body.message ?? "").trim().slice(0, 5000);

  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(from) || message.length < 10) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const subject = `davidparsons.me — ${name}`;
  const text = `${message}\n\n— ${name} (${from})`;
  const href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;

  return NextResponse.json(
    { href },
    { headers: { "cache-control": "no-store", "x-robots-tag": "noindex" } },
  );
}
