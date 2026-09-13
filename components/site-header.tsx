import Link from "next/link";
import { site } from "@/lib/site";

export function SiteHeader({ current }: { current?: string }) {
  return (
    <header className="mx-auto flex w-full max-w-[720px] flex-col items-start gap-3 border-b border-rule px-6 pt-11 pb-[18px] sm:flex-row sm:items-baseline sm:justify-between sm:gap-6 sm:px-0">
      <Link
        href="/"
        className="font-mono text-[12px] tracking-[0.14em] whitespace-nowrap text-ink uppercase"
      >
        {site.name}
      </Link>
      <nav className="flex gap-5 font-mono text-[12px] tracking-[0.1em] uppercase sm:gap-[26px]">
        {site.nav.map((item) => {
          const active = item.href === current;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={
                active
                  ? "border-b border-ink pb-[2px] text-ink"
                  : "text-muted hover:text-ink"
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
