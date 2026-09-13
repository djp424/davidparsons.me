import type { ReactNode } from "react";

/**
 * The gutter/column pair every page is built on: a mono label sitting in the
 * left gutter, content in the measure beside it.
 */
export function Gutter({
  label,
  labelClassName,
  children,
}: {
  label?: string;
  labelClassName?: string;
  children: ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-[96px_minmax(0,1fr)]">
      <div
        className={`hidden font-mono text-[11px] tracking-[0.12em] text-faint uppercase sm:block ${labelClassName ?? "pt-[14px]"}`}
      >
        {label}
      </div>
      <div>{children}</div>
    </div>
  );
}

export function PageHeading({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <Gutter label={label}>
      <div className="flex flex-col gap-[10px]">
        <h1 className="text-[clamp(30px,6vw,38px)] leading-[1.15] font-normal tracking-[-0.012em]">
          {title}
        </h1>
        {children ? (
          <p className="text-[17px] leading-[1.7] text-muted text-pretty">
            {children}
          </p>
        ) : null}
      </div>
    </Gutter>
  );
}
