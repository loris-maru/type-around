import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "Cross-Origin-Resource-Policy",
    value: "same-origin",
  },
];

const nextConfig: NextConfig = {
  experimental: {
    turbopackFileSystemCacheForDev: false,
  },
  // Source maps are heavy and not useful to end users – keep them for error
  // trackers via sentry-cli / vercel uploads but don't ship to browsers.
  productionBrowserSourceMaps: false,
  // Ensure gzip/brotli compression is applied at the edge.
  compress: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      // Long cache for hashed static assets (immutable) - improves repeat visit performance
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Cache for fonts and images in public folder
      {
        source: "/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  images: {
    // Serve modern formats first for much smaller payloads over slow
    // trans-Pacific links. Next will fall back to original on unsupported
    // clients.
    formats: ["image/avif", "image/webp"],
    // Cache the optimised variant on Vercel's CDN for 1 year.
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
    ],
  },
};

export default nextConfig;
