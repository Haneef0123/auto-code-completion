import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Publicly exposed (embedded at build) values should NEVER include secrets.
  // BITBUCKET_TOKEN is intentionally omitted to prevent leaking.
  env: {
    BITBUCKET_BASE_URL:
      process.env.BITBUCKET_BASE_URL || "https://bitbucket.upstox.com",
    NEXT_PUBLIC_BITBUCKET_PROJECT_KEY:
      process.env.NEXT_PUBLIC_BITBUCKET_PROJECT_KEY || "GROWTH",
  },
};

export default nextConfig;
