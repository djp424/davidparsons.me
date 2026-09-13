import type { Metadata } from "next";
import { AlpenglowHeader, AlpenglowFooter } from "@/components/athlete/athlete-chrome";
import { RaceRow, RaceTableHead } from "@/components/athlete/race-row";
import { racesByYear, raceStats } from "@/content/races";

const stats = raceStats();

export const metadata: Metadata = {
  title: "Race results",
  description: `Every race David Parsons has finished — ${stats.count} of them between ${stats.firstYear} and ${stats.lastYear}, across skimo, trail, gravel and road.`,
  alternates: { canonical: "/athlete/races" },
};

export default function RacesPage() {
  const groups = racesByYear();

  return (
    <>
      <AlpenglowHeader current="/athlete" />

      <main id="content" className="flex flex-1 flex-col">
        <section className="px-6 pt-14 sm:px-12 sm:pt-16 lg:px-20">
          <span className="font-mono text-[11px] tracking-[0.16em] text-alp-muted uppercase">
            The log
          </span>
          <h1 className="pt-3 font-display text-[56px] leading-[0.9] sm:text-[72px] lg:text-[88px]">
            Race results
          </h1>
          <p className="max-w-[640px] pt-4 text-[16px] leading-[1.6] text-alp-body text-pretty sm:text-[18px]">
            Every race I have finished, {stats.firstYear} to {stats.lastYear} —
            skimo, trail, gravel and one road 10K. Kept mostly so I can find it
            later; mid-pack is the honest word for most of it.
          </p>
        </section>

        <section className="px-6 pt-10 pb-14 sm:px-12 sm:pt-11 sm:pb-16 lg:px-20">
          <RaceTableHead />
          {groups.map((group) => (
            <div key={group.year}>
              <div className="flex items-baseline gap-[18px] px-3 pt-7 pb-3">
                <h2 className="font-display text-[34px] leading-none text-alp-accent sm:text-[40px]">
                  {group.year}
                </h2>
                <span className="font-mono text-[11px] tracking-[0.12em] text-alp-faint uppercase">
                  {group.races.length} races
                </span>
                <span className="h-px flex-grow bg-alp-hair" />
              </div>
              {group.races.map((race) => (
                <RaceRow key={`${race.event}-${race.date}`} race={race} />
              ))}
            </div>
          ))}
          <div className="border-t border-alp-hair" />
        </section>
      </main>

      <AlpenglowFooter />
    </>
  );
}
