import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PageHeading } from "@/components/page-heading";
import { talks, talksByYear } from "@/content/speaking";

const years = talks.map((t) => t.year);
const span = `${Math.min(...years)} and ${Math.max(...years)}`;

export const metadata: Metadata = {
  title: "Speaking",
  description: `${talks.length} talks at WordCamps, BarCamps and meetups between ${span}.`,
  alternates: { canonical: "/speaking" },
};

export default function SpeakingPage() {
  const groups = talksByYear();

  return (
    <>
      <SiteHeader current="/speaking" />
      <main
        id="content"
        className="mx-auto w-full max-w-[720px] px-6 pt-16 sm:px-0 sm:pt-22"
      >
        <PageHeading label="Talks" title="Speaking">
          {talks.length} talks at WordCamps, BarCamps and meetups between {span}.
        </PageHeading>

        <div className="flex flex-col pt-12">
          {groups.map((group) => (
            <section
              key={group.year}
              className="grid grid-cols-1 gap-x-6 border-t border-rule pt-[22px] pb-[26px] sm:grid-cols-[96px_minmax(0,1fr)]"
            >
              <h2 className="pb-3 font-mono text-[13px] tracking-[0.06em] text-faint sm:pt-[5px] sm:pb-0">
                {group.year}
              </h2>
              <div className="flex flex-col gap-[11px]">
                {group.talks.map((talk) => (
                  <div
                    key={`${talk.event}-${talk.date}`}
                    className="grid grid-cols-1 items-baseline gap-x-4 sm:grid-cols-[minmax(0,1fr)_auto]"
                  >
                    <p className="text-[18px] leading-[1.4]">
                      <a className="lk" href={talk.url}>
                        {talk.event}
                      </a>
                      {talk.extras.map((extra) => (
                        <a
                          key={extra.label}
                          href={extra.url}
                          className="ml-[6px] font-mono text-[11px] tracking-[0.06em] text-faint hover:text-ink"
                        >
                          [{extra.label}]
                        </a>
                      ))}
                    </p>
                    <p className="font-mono text-[12px] tracking-[0.03em] whitespace-nowrap text-faint">
                      {talk.date}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
