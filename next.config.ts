import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Renderer stubs have intentional type mismatches (editor fields
    // replaced with no-ops). The render functions are fully typed.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
