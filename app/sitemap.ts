import type { MetadataRoute } from "next";
import { allNotes } from "@/lib/notes";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/notes", "/speaking", "/contact"].map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: "yearly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const notes = allNotes().map((note) => ({
    url: `${site.url}/${note.slug}`,
    lastModified: new Date(`${note.updated ?? note.date}T12:00:00Z`),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  return [...pages, ...notes];
}
