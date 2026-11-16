/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    // Expose commit SHA to client bundles so timeline/education logos get a fresh `?v=` per deploy.
    NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA || '',
  },
  async redirects() {
    return [{ source: '/favicon.svg', destination: '/icon.svg', permanent: false }]
  },
  async headers() {
    return [
      {
        // Something rides along with every response. (iii)
        source: '/:path*',
        headers: [{ key: 'x-iii', value: '7374617273636f75726765' }],
      },
      {
        source: '/logos/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
      {
        source: '/icon.svg',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ]
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
  },
  experimental: {
    optimizePackageImports: ['framer-motion'],
  },
  // Enable compiler optimizations
  compiler: {
    // console.info survives on purpose: the site mutters something to whoever opens the console.
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn', 'info'] } : false,
  },
  // Performance optimizations
  poweredByHeader: false,
  compress: true,
}

module.exports = nextConfig

