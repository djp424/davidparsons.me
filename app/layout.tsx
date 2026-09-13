import type { Metadata } from "next";
import { Newsreader, IBM_Plex_Mono } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.name,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": `${site.url}/rss.xml` },
  },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.name,
    description: site.description,
    url: site.url,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${plexMono.variable}`}
    >
      <body className="flex min-h-dvh flex-col">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-10 focus:bg-ink focus:px-4 focus:py-2 focus:font-mono focus:text-[12px] focus:tracking-[0.12em] focus:text-paper focus:uppercase"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
