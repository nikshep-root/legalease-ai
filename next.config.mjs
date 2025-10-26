/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Required for Cloud Run deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  swcMinify: true,
  optimizeFonts: true,
}

export default nextConfig
