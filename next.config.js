/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '/**',
      },
    ],
  },
  eslint: {
    // Warning instead of error during builds
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig 