import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: [
    "pod3-test",
    "pod3-test:3000",
    "10.140.8.242",
    "10.140.8.242:3000",
    "localhost",
    "localhost:3000",
  ],
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
