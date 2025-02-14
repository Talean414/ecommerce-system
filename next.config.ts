import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ⛔ Skips ESLint during build
  },
  typescript: {
    ignoreBuildErrors: true, // ⛔ Skips TypeScript type checking during build
  },
};

export default nextConfig;
