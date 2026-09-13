import { allNotes } from "@/lib/notes";
import { site } from "@/lib/site";

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function GET() {
  const notes = allNotes();
  const items = notes
    .map(
      (note) => `    <item>
      <title>${escape(note.title)}</title>
      <link>${site.url}/${note.slug}</link>
      <guid isPermaLink="true">${site.url}/${note.slug}</guid>
      <pubDate>${new Date(`${note.date}T12:00:00Z`).toUTCString()}</pubDate>
      <description>${escape(note.excerpt)}</description>
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(site.name)}</title>
    <link>${site.url}</link>
    <description>${escape(site.description)}</description>
    <language>en-us</language>
    <atom:link href="${site.url}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=3600",
    },
  });
}
