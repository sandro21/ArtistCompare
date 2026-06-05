import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure TTF font files are bundled into the OG image serverless function
  outputFileTracingIncludes: {
    '/api/og/share': ['./public/fonts/*.ttf'],
  },

  // Performance optimizations
  experimental: {
    optimizePackageImports: ['gsap', 'three'],
  },
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
        port: '',
        pathname: '/image/**',
      },
    ],
  },
  
  // Headers for better caching
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=3600, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
