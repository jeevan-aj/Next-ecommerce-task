import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['fakestoreapi.com'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
