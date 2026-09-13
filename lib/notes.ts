import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const NOTES_DIR = path.join(process.cwd(), "content", "notes");

export type Note = {
  slug: string;
  title: string;
  date: string;
  updated?: string;
  category?: string;
  excerpt: string;
  body: string;
};

function read(slug: string): Note {
  const raw = fs.readFileSync(path.join(NOTES_DIR, `${slug}.mdx`), "utf8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title as string,
    date: data.date as string,
    updated: data.updated as string | undefined,
    category: data.category as string | undefined,
    excerpt: data.excerpt as string,
    body: content,
  };
}

/** Every note, newest first. */
export function allNotes(): Note[] {
  return fs
    .readdirSync(NOTES_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => read(f.replace(/\.mdx$/, "")))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function noteSlugs(): string[] {
  return allNotes().map((n) => n.slug);
}

export function getNote(slug: string): Note | undefined {
  if (!/^[a-z0-9-]+$/.test(slug)) return undefined;
  if (!fs.existsSync(path.join(NOTES_DIR, `${slug}.mdx`))) return undefined;
  return read(slug);
}

/** "February 19, 2017" */
export function longDate(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** The stacked gutter stamp: year over month.day */
export function stampDate(iso: string): { year: string; day: string } {
  const [year, month, day] = iso.split("-");
  return { year, day: `${month}.${day}` };
}
