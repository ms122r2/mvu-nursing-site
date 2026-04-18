import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@ms122r2/puck-renderer"],
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
