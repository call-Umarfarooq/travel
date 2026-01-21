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
  // Add this headers section to resolve CORS
  async headers() {
    return [
      {
        // matching all API routes in your /api directory
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" }, // Set to your specific domain in production
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization" },
        ]
      }
    ]
  },
  async rewrites() {
    return [
      {
        source: '/remote-api/:path*',
        destination: 'http://v8k8w04088ggcksg0c8wocs4.72.62.242.32.sslip.io/api/:path*',
      },
    ]
  },

};

export default nextConfig;