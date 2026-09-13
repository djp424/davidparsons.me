import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The WordPress feed lived here for a decade.
      { source: "/feed", destination: "/rss.xml", permanent: true },
      { source: "/feed/:path*", destination: "/rss.xml", permanent: true },
      // Author and category archives are gone; send them to the notes index.
      { source: "/author/:slug", destination: "/notes", permanent: true },
      { source: "/category/:slug", destination: "/notes", permanent: true },
    ];
  },
};

export default nextConfig;
