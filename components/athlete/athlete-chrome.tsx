import Link from "next/link";
import { site } from "@/lib/site";
import { external } from "@/lib/links";
import { elsewhere } from "@/content/athlete";

/**
 * Same nav items as the writing side — nobody who lands here from a search
 * result should hit a dead end — wearing the section's own skin.
 */
export function AlpenglowHeader({ current }: { current?: string }) {
  return (
    <header className="flex w-full flex-col items-start gap-3 border-b border-alp-hair px-6 pt-8 pb-5 sm:flex-row sm:items-center sm:justify-between sm:gap-10 sm:px-12 lg:px-20">
      <Link
        href="/"
        className="font-mono text-[12px] tracking-[0.16em] whitespace-nowrap text-alp-ink uppercase"
      >
        {site.name}
      </Link>
      <nav className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[12px] tracking-[0.12em] uppercase sm:gap-x-[30px]">
        {site.nav.map((item) => {
          const active = item.href === current;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={
                active
                  ? "border-b border-alp-accent pb-[3px] text-alp-accent"
                  : "text-alp-muted hover:text-alp-ink"
              }
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}

export function AlpenglowFooter() {
  return (
    <footer className="mt-auto flex w-full flex-col gap-4 border-t border-alp-hair px-6 py-8 font-mono text-[11px] tracking-[0.12em] uppercase sm:flex-row sm:items-center sm:justify-between sm:px-12 lg:px-20">
      <span className="text-alp-faint">Boulder, Colorado</span>
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        <a
          className="text-alp-muted hover:text-alp-accent"
          href={elsewhere.strava}
          {...external}
        >
          Strava
        </a>
        <a
          className="text-alp-muted hover:text-alp-accent"
          href={elsewhere.mountainProject}
          {...external}
        >
          Mountain Project
        </a>
        <Link className="text-alp-muted hover:text-alp-accent" href="/">
          Back to the writing &rarr;
        </Link>
      </div>
    </footer>
  );
}
