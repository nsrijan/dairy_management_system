import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
    NEXT_PUBLIC_USE_MOCK_DATA: process.env.NEXT_PUBLIC_USE_MOCK_DATA || 'false',
    NEXT_PUBLIC_DEVELOPMENT_MODE: process.env.NEXT_PUBLIC_DEVELOPMENT_MODE || 'true'
  }
};

export default nextConfig;
