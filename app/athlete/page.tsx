import type { Metadata } from "next";
import Link from "next/link";
import {
  AlpenglowHeader,
  AlpenglowFooter,
} from "@/components/athlete/athlete-chrome";
import { StatBand } from "@/components/athlete/stat-band";
import { StravaRecent } from "@/components/athlete/strava-recent";
import { RaceRow } from "@/components/athlete/race-row";
import { races, raceStats } from "@/content/races";
import { climbing, gear, objectives } from "@/content/athlete";

const stats = raceStats();

export const metadata: Metadata = {
  title: "Athlete",
  description: `Multisport athlete out of Boulder, Colorado — skimo, trail, bike and rock. Every race logged, ${stats.count} of them so far.`,
  alternates: { canonical: "/athlete" },
};

/**
 * The Strava band below is live, so this page is regenerated on a schedule
 * rather than pinned at build time. Matches TRAINING_REVALIDATE_SECONDS in
 * lib/strava.ts — Next needs this one to be a literal it can read statically,
 * so the two are written out separately. Change them together.
 */
export const revalidate = 1800;

/** Layered ridge line standing in until a real hero photograph lands. */
function Ridge() {
  return (
    <svg
      viewBox="0 0 1280 480"
      preserveAspectRatio="none"
      className="absolute inset-0 block h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="alp-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1b1418" />
          <stop offset="46%" stopColor="#14161a" />
          <stop offset="100%" stopColor="#0e1012" />
        </linearGradient>
        <radialGradient id="alp-glow" cx="0.72" cy="0.52" r="0.5">
          <stop offset="0%" stopColor="#ff6b3d" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#ff6b3d" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1280" height="480" fill="url(#alp-sky)" />
      <rect width="1280" height="480" fill="url(#alp-glow)" />
      <path
        d="M0 372 L182 250 L286 306 L438 186 L556 268 L690 156 L838 258 L968 200 L1112 288 L1280 214 L1280 480 L0 480 Z"
        fill="#1a2024"
        opacity="0.9"
      />
      <path
        d="M0 424 L150 344 L300 396 L470 300 L628 372 L790 292 L946 358 L1108 306 L1280 372 L1280 480 L0 480 Z"
        fill="#12171a"
      />
      <path
        d="M0 462 L220 414 L432 452 L662 400 L900 448 L1120 412 L1280 444 L1280 480 L0 480 Z"
        fill="#0e1012"
      />
    </svg>
  );
}

function Card({
  label,
  title,
  rows,
  cta,
  href,
}: {
  label: string;
  title: string;
  rows: [string, string][];
  cta: string;
  href: string;
}) {
  return (
    <div className="flex flex-col gap-[14px] border border-alp-hair bg-alp-panel p-6">
      <span className="font-mono text-[11px] tracking-[0.16em] text-alp-muted uppercase">
        {label}
      </span>
      <h3 className="font-display text-[26px] tracking-[0.03em] text-alp-ink">
        {title}
      </h3>
      <div className="flex flex-col gap-[7px]">
        {rows.map(([left, right]) => (
          <div
            key={left}
            className="flex justify-between gap-4 text-[14px] text-alp-body"
          >
            <span>{left}</span>
            <span className="font-mono whitespace-nowrap text-alp-muted">
              {right}
            </span>
          </div>
        ))}
      </div>
      <Link
        href={href}
        className="mt-1 font-mono text-[11px] tracking-[0.12em] text-alp-accent uppercase hover:underline"
      >
        {cta} &rarr;
      </Link>
    </div>
  );
}

export default function AthletePage() {
  return (
    <>
      <AlpenglowHeader current="/athlete" />

      <main id="content" className="flex flex-1 flex-col">
        {/* min-h, not h: the copy has to be able to push the ridge taller on
            a narrow screen rather than spilling out of it. */}
        <section className="relative flex min-h-[420px] flex-col justify-end overflow-hidden sm:min-h-[480px]">
          <Ridge />
          <div className="relative flex flex-col gap-4 px-6 pt-14 pb-10 sm:px-12 sm:pb-14 lg:px-20">
            <span className="font-mono text-[11px] tracking-[0.2em] text-alp-accent uppercase">
              Multisport athlete · Boulder, Colorado
            </span>
            <h1 className="font-display text-[52px] leading-[0.88] text-alp-ink sm:text-[88px] lg:text-[104px]">
              Four sports.
              <br />
              Still counting.
            </h1>
            <p className="max-w-[620px] text-[16px] leading-[1.6] text-alp-body text-pretty sm:text-[18px]">
              Skimo through the winter, trail races all summer, the bike in
              between, and rock whenever the Flatirons are dry. Every race I
              finish gets logged here — {stats.count} of them so far.
            </p>
          </div>
        </section>

        <StatBand />
        <StravaRecent />

        <section className="px-6 pt-12 sm:px-12 sm:pt-13 lg:px-20">
          <div className="flex flex-col gap-3 pb-4 sm:flex-row sm:items-baseline sm:justify-between">
            <h2 className="font-display text-[30px] tracking-[0.03em] sm:text-[34px]">
              Latest results
            </h2>
            <Link
              href="/athlete/races"
              className="font-mono text-[11px] tracking-[0.12em] text-alp-accent uppercase hover:underline"
            >
              The full log &rarr;
            </Link>
          </div>
          <div className="flex flex-col border-b border-alp-hair">
            {races.slice(0, 5).map((race) => (
              <RaceRow key={`${race.event}-${race.date}`} race={race} />
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-[22px] px-6 py-12 sm:grid-cols-2 sm:px-12 sm:py-14 lg:grid-cols-3 lg:px-20">
          <Card
            label="Rock"
            title="Climbing"
            rows={climbing.bests.map((b) => [b.label, b.value])}
            cta="Ticklist"
            href="/athlete/training"
          />
          <Card
            label="Kit"
            title="What I race on"
            rows={gear.slice(0, 3).map((g) => [g.category, g.item])}
            cta="Full setup"
            href="/athlete/training"
          />
          <Card
            label="Ahead"
            title="What's next"
            rows={objectives.slice(0, 3).map((o) => [o.what, o.when])}
            cta="Season goals"
            href="/athlete/training"
          />
        </section>
      </main>

      <AlpenglowFooter />
    </>
  );
}
