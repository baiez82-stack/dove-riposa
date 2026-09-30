/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  images: {
    minimumCacheTTL: 86400,
  },
};

module.exports = nextConfig;
