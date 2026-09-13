import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageHeading } from "@/components/page-heading";
import { allNotes, stampDate } from "@/lib/notes";

export const metadata: Metadata = {
  title: "Notes",
  description:
    "Conference notes, a server rebuild, and a couple of posts from a long time ago.",
  alternates: { canonical: "/notes" },
};

export default function NotesPage() {
  const notes = allNotes();

  return (
    <>
      <SiteHeader current="/notes" />
      <main
        id="content"
        className="mx-auto w-full max-w-[720px] px-6 pt-16 sm:px-0 sm:pt-22"
      >
        <PageHeading label="Notes" title="Notes">
          Conference notes, a server rebuild, and a couple of posts from a long
          time ago.
        </PageHeading>

        <div className="flex flex-col pt-14">
          {notes.map((note, i) => {
            const stamp = stampDate(note.date);
            return (
              <Link
                key={note.slug}
                href={`/${note.slug}`}
                className={`group grid grid-cols-1 gap-x-6 border-t border-rule py-[26px] sm:grid-cols-[96px_minmax(0,1fr)] ${
                  i === notes.length - 1 ? "border-b" : ""
                }`}
              >
                <div className="pb-2 font-mono text-[12px] leading-[1.8] tracking-[0.04em] text-faint sm:pt-[6px] sm:pb-0">
                  {stamp.year}
                  <span className="sm:hidden">.</span>
                  <br className="hidden sm:block" />
                  {stamp.day}
                </div>
                <div className="flex flex-col gap-[7px]">
                  <h2 className="text-[23px] leading-[1.3] font-normal tracking-[-0.008em] group-hover:underline group-hover:decoration-hair group-hover:underline-offset-[5px]">
                    {note.title}
                  </h2>
                  <p className="text-[16px] leading-[1.65] text-muted text-pretty">
                    {note.excerpt}
                  </p>
                  {note.category ? (
                    <p className="pt-[3px] font-mono text-[11px] tracking-[0.1em] text-fainter uppercase">
                      {note.category}
                    </p>
                  ) : null}
                </div>
              </Link>
            );
          })}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
