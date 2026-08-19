import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: "/chaines",
        destination: "/channel",
      },
      {
        source: "/chaines/:channelSlug",
        destination: "/channel/:channelSlug",
      },
      {
        source: "/chaines/:channelSlug/:path*",
        destination: "/channel/:channelSlug/:path*",
      },
    ];
  },
};

export default nextConfig;
