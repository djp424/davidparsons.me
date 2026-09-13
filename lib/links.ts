import { site } from "./site";

/** True for any absolute URL pointing somewhere other than this site. */
export function isExternal(href?: string): boolean {
  if (!href || !/^https?:\/\//i.test(href)) return false;
  try {
    return new URL(href).origin !== new URL(site.url).origin;
  } catch {
    return true;
  }
}

/** Spread onto an outbound anchor: new tab, and no window.opener handle. */
export const external = {
  target: "_blank",
  rel: "noopener noreferrer",
} as const;
