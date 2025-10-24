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
  },
}

export default nextConfig
