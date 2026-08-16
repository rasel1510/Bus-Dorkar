import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Enable Brotli & Gzip compression for minimal payload size over the wire
  compress: true,

  // 2. Serve ultra-compact AVIF and WebP images (saving 60-80% bandwidth)
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
  },

  // 3. Strip console.log statements from production client bundles
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // 4. PWA — Offline support: Next.js auto-retries failed navigations/Server Actions
  experimental: {
    useOffline: true,
  },

  // 5. Security headers (required for PWA / service worker)
  async headers() {
    return [
      {
        // Global security headers
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
        ],
      },
      {
        // Service worker — must NOT be cached, always fresh
        source: "/sw.js",
        headers: [
          {
            key: "Content-Type",
            value: "application/javascript; charset=utf-8",
          },
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self'",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
