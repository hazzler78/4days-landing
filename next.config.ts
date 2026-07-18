import type { NextConfig } from "next";

const legacyPages = [
  "4-dagarsvecka-sverige",
  "4-dagarsvecka-lonsamhet",
  "kortare-arbetsvecka-myter",
  "ai-automatisering-foretag",
  "100-80-100-modellen",
  "ai-verktyg-spara-tid",
  "4-dagarsvecka-it-konsultbolag",
  "ai-guide-ledningsgrupper",
  "bemanningsplanering-ai",
  "integritetspolicy",
  "cookies",
];

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
      ...legacyPages.map((slug) => ({
        source: `/${slug}`,
        destination: `/legacy/${slug}.html`,
      })),
    ];
  },
};

export default nextConfig;
