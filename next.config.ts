import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "4days.ai" }],
        destination: "https://www.4days.ai/:path*",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/:filename.txt",
        destination: "/api/indexnow-verify?filename=:filename",
      },
    ];
  },
};

export default nextConfig;
