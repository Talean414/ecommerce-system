import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ⛔ Skips ESLint checks during build
  },
};

export default nextConfig;
