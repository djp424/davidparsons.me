import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Gutter } from "@/components/page-heading";
import { getNote, noteSlugs, longDate, stampDate } from "@/lib/notes";
import { mdxComponents } from "@/components/mdx-components";

export function generateStaticParams() {
  return noteSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const note = getNote(slug);
  if (!note) return {};
  return {
    title: note.title,
    description: note.excerpt,
    alternates: { canonical: `/${note.slug}` },
    openGraph: {
      type: "article",
      title: note.title,
      description: note.excerpt,
      publishedTime: note.date,
      modifiedTime: note.updated,
    },
  };
}

export default async function NotePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const note = getNote(slug);
  if (!note) notFound();

  const { content } = await compileMDX({
    source: note.body,
    components: mdxComponents,
  });
  const stamp = stampDate(note.date);

  return (
    <>
      <SiteHeader current="/notes" />
      <main
        id="content"
        className="mx-auto w-full max-w-[720px] px-6 pt-16 sm:px-0 sm:pt-22"
      >
        <article>
          <Gutter label={stamp.year} labelClassName="pt-[14px] !normal-case">
            <div className="flex flex-col gap-[10px]">
              <h1 className="text-[clamp(30px,6vw,38px)] leading-[1.15] font-normal tracking-[-0.012em] text-pretty">
                {note.title}
              </h1>
              <p className="font-mono text-[12px] tracking-[0.04em] text-faint">
                <time dateTime={note.date}>{longDate(note.date)}</time>
                {note.category ? (
                  <>
                    <span className="px-2 text-hair">/</span>
                    <span className="tracking-[0.1em] uppercase">
                      {note.category}
                    </span>
                  </>
                ) : null}
              </p>
            </div>
          </Gutter>

          <Gutter>
            <div className="flex flex-col gap-[22px] pt-12 text-[18px] leading-[1.75] text-body">
              {content}
            </div>
          </Gutter>
        </article>

        <Gutter>
          <p className="border-t border-rule pt-6 font-mono text-[12px] tracking-[0.1em] uppercase">
            <Link href="/notes" className="text-muted hover:text-ink">
              ← All notes
            </Link>
          </p>
        </Gutter>
      </main>
      <SiteFooter />
    </>
  );
}
