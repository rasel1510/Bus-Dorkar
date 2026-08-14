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
};

export default nextConfig;
