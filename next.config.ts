import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net', // Contentful image CDN
        pathname: '/**', // Match any path
      },
      {
        protocol: 'https',
        hostname: 'images.contentful.com', // Contentful image CDN
        pathname: '/**', // Match any path
      },
    ],
  },
};

export default nextConfig;
