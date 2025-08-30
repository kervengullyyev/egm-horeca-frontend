import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: process.env.NEXT_PUBLIC_BACKEND_HOSTNAME || 'localhost',
        pathname: '/api/v1/images/**',
      },
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_BACKEND_HOSTNAME || 'localhost',
        pathname: '/api/v1/images/**',
      },
    ],
  },
};

export default nextConfig;
