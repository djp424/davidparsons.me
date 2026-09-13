import type { Metadata } from "next";
import { AlpenglowHeader, AlpenglowFooter } from "@/components/athlete/athlete-chrome";
import { climbing, gear, objectives } from "@/content/athlete";
import { external } from "@/lib/links";
import { elsewhere } from "@/content/athlete";

export const metadata: Metadata = {
  title: "Training & gear",
  description:
    "Climbing ticklist, the kit I race on, and what I am pointed at next.",
  alternates: { canonical: "/athlete/training" },
};

function Block({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="px-6 pt-12 sm:px-12 sm:pt-14 lg:px-20">
      <div className="flex items-baseline gap-4 pb-5">
        <h2 className="font-display text-[32px] tracking-[0.03em] sm:text-[38px]">
          {title}
        </h2>
        <span className="font-mono text-[11px] tracking-[0.16em] text-alp-muted uppercase">
          {label}
        </span>
        <span className="h-px flex-grow bg-alp-hair" />
      </div>
      {children}
    </section>
  );
}

export default function TrainingPage() {
  return (
    <>
      <AlpenglowHeader current="/athlete" />

      <main id="content" className="flex flex-1 flex-col">
        <section className="px-6 pt-14 sm:px-12 sm:pt-16 lg:px-20">
          <span className="font-mono text-[11px] tracking-[0.16em] text-alp-muted uppercase">
            Off the clock
          </span>
          <h1 className="pt-3 font-display text-[56px] leading-[0.9] sm:text-[72px] lg:text-[88px]">
            Training &amp; gear
          </h1>
        </section>

        <Block label="Rock" title="Climbing">
          <div className="grid grid-cols-1 gap-[22px] pb-7 sm:grid-cols-3">
            {climbing.bests.map((best) => (
              <div
                key={best.label}
                className="border border-alp-hair bg-alp-panel px-6 py-5"
              >
                <div className="font-display text-[42px] leading-none text-alp-accent sm:text-[46px]">
                  {best.value}
                </div>
                <div className="mt-[6px] font-mono text-[11px] tracking-[0.16em] text-alp-muted uppercase">
                  {best.label}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-9 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
            <div className="flex flex-col">
              <span className="pb-3 font-mono text-[11px] tracking-[0.16em] text-alp-muted uppercase">
                Sends worth remembering
              </span>
              {climbing.sends.map((send) => (
                <div
                  key={send.route}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 gap-y-1 border-t border-alp-hair px-[10px] py-3 hover:bg-alp-raised sm:grid-cols-[minmax(0,1fr)_64px_180px_52px]"
                >
                  <span className="text-[16px]">{send.route}</span>
                  <span className="font-mono text-[13px] text-alp-accent">
                    {send.grade}
                  </span>
                  <span className="col-span-2 font-mono text-[12px] text-alp-muted sm:col-span-1">
                    {send.crag}
                  </span>
                  <span className="hidden text-right font-mono text-[12px] text-alp-faint sm:block">
                    {send.year}
                  </span>
                </div>
              ))}
              <div className="border-t border-alp-hair" />
              <p className="pt-4 font-mono text-[11px] tracking-[0.1em] text-alp-muted uppercase">
                <a
                  className="hover:text-alp-accent"
                  href={elsewhere.mountainProject}
                  {...external}
                >
                  Full ticklist on Mountain Project &rarr;
                </a>
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <span className="font-mono text-[11px] tracking-[0.16em] text-alp-muted uppercase">
                Home crags
              </span>
              <div className="flex flex-wrap gap-2">
                {climbing.crags.map((crag) => (
                  <span
                    key={crag}
                    className="border border-alp-hair px-3 py-[7px] font-mono text-[12px] text-alp-body"
                  >
                    {crag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Block>

        <Block label="Kit" title="Gear">
          <div className="grid grid-cols-1 gap-x-11 sm:grid-cols-2">
            {gear.map((g) => (
              <div
                key={g.category}
                className="grid grid-cols-[100px_minmax(0,1fr)] items-baseline gap-x-[18px] border-t border-alp-hair px-[10px] py-3 hover:bg-alp-raised sm:grid-cols-[116px_minmax(0,1fr)]"
              >
                <span className="font-mono text-[10px] tracking-[0.16em] text-alp-muted uppercase">
                  {g.category}
                </span>
                <span className="text-[16px] text-alp-body">{g.item}</span>
              </div>
            ))}
          </div>
        </Block>

        <Block label="Ahead" title="What's next">
          <div className="grid grid-cols-1 gap-[22px] pb-14 sm:grid-cols-2 lg:grid-cols-3">
            {objectives.map((o) => (
              <div
                key={o.what + o.when}
                className="flex flex-col gap-[7px] border border-alp-hair border-l-2 border-l-alp-accent bg-alp-panel px-6 py-5"
              >
                <span className="font-mono text-[11px] tracking-[0.12em] text-alp-accent uppercase">
                  {o.when}
                </span>
                <span className="text-[19px] text-alp-ink">{o.what}</span>
                <span className="font-mono text-[12px] text-alp-muted">
                  {o.goal}
                </span>
              </div>
            ))}
          </div>
        </Block>
      </main>

      <AlpenglowFooter />
    </>
  );
}
