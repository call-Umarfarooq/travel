import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
      },
      // Add production domain from environment variable if set
      ...(process.env.NEXT_PUBLIC_APP_URL
        ? [
            {
              protocol: process.env.NEXT_PUBLIC_APP_URL.startsWith('https') ? 'https' as const : 'http' as const,
              hostname: new URL(process.env.NEXT_PUBLIC_APP_URL).hostname,
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;
