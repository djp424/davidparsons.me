/**
 * Carries the section's theme, nothing else. The header and footer are
 * rendered per page, the way the writing side does it.
 *
 * `.alpenglow` is the hook globals.css uses to repaint the body ground, so
 * the palette covers the whole viewport rather than just this box.
 */
export default function AthleteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="alpenglow flex min-h-dvh flex-1 flex-col bg-alp-page font-sans text-alp-ink">
      {children}
    </div>
  );
}
