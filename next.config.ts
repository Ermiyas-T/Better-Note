import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for server components to access external packages
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
  experimental: {
    serverComponentsExternalPackages: ["@neondatabase/serverless"],
  },
};

export default nextConfig;
