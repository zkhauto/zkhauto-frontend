/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/zkhauto_bucket/**',
      },
    ],
    unoptimized: true,
  },
};

module.exports = nextConfig;
