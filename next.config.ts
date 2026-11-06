import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Fully static export → out/
  output: 'export',

  // Every route becomes a directory with index.html, which works on GitHub
  // Pages, S3 + CloudFront and plain nginx without rewrite rules.
  trailingSlash: true,

  images: {
    // REQUIRED under output: 'export' — the default optimiser is not available.
    // next/image still emits width/height (so there is no layout shift) but
    // serves the pre-processed file from public/ as-is.
    unoptimized: true,
  },

  reactStrictMode: true,
}

export default nextConfig
