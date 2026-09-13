import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Gutter } from "@/components/page-heading";
import { allNotes } from "@/lib/notes";
import { talks } from "@/content/speaking";

function IndexRow({
  href,
  label,
  detail,
  span,
  last,
}: {
  href: string;
  label: string;
  detail: string;
  span: string;
  last?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-5 gap-y-1 border-t border-rule py-[18px] sm:grid-cols-[108px_minmax(0,1fr)_auto] ${
        last ? "border-b" : ""
      }`}
    >
      <span className="text-[19px] group-hover:underline group-hover:decoration-hair group-hover:underline-offset-[5px]">
        {label}
      </span>
      <span className="order-last col-span-2 text-[15px] text-muted sm:order-none sm:col-span-1">
        {detail}
      </span>
      <span className="font-mono text-[12px] tracking-[0.04em] text-faint">
        {span}
      </span>
    </Link>
  );
}

export default function Home() {
  const notes = allNotes();
  const noteYears = notes.map((n) => Number(n.date.slice(0, 4)));
  const talkYears = talks.map((t) => t.year);
  const range = (ys: number[]) => `${Math.min(...ys)}–${Math.max(...ys)}`;

  return (
    <>
      <SiteHeader />
      <main
        id="content"
        className="mx-auto w-full max-w-[720px] px-6 pt-16 sm:px-0 sm:pt-24"
      >
        <Gutter label="About" labelClassName="pt-[22px]">
          <div className="flex flex-col gap-[26px]">
            <h1 className="text-[clamp(34px,8vw,50px)] leading-[1.08] font-normal tracking-[-0.015em] text-pretty">
              Hello, I&rsquo;m David.
            </h1>
            <p className="text-[19px] leading-[1.75] text-body text-pretty">
              I&rsquo;ve spent 15 years building software for the web. You might
              also know me as the lead organizer of{" "}
              <a className="lk" href="https://2017.nyc.wordcamp.org/">
                WordCamp NYC 2017
              </a>
              .
            </p>
            <p className="text-[19px] leading-[1.75] text-body text-pretty">
              I speak at local meetups and conferences when I can. I&rsquo;ve
              taken a lot from this community, and it feels good to give back.
            </p>
            <p className="text-[19px] leading-[1.75] text-body text-pretty">
              If you want to get in touch,{" "}
              <Link className="lk" href="/contact">
                say hello
              </Link>
              .
            </p>
          </div>
        </Gutter>

        <div className="pt-20 sm:pt-22">
          <Gutter label="Index" labelClassName="pt-[20px]">
            <div className="flex flex-col">
              <IndexRow
                href="/notes"
                label="Notes"
                detail={`${notes.length} posts, mostly conference notes`}
                span={range(noteYears)}
              />
              <IndexRow
                href="/speaking"
                label="Speaking"
                detail={`${talks.length} talks at meetups and camps`}
                span={range(talkYears)}
              />
              <IndexRow
                href="/contact"
                label="Contact"
                detail="Send a note, or find me elsewhere"
                span="—"
                last
              />
            </div>
          </Gutter>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
