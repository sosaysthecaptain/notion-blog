import type { NextConfig } from "next";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'file.notion.so',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.notion.so',  // This will allow images from any Notion subdomain
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig;
