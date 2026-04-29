/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    qualities: [75, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '**'
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '**'
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '**'
      }
    ]
  },
  redirects: async () => [
    {
      source: '/home',
      destination: '/',
      permanent: true
    }
  ],
  rewrites: async () => [
    {
      source: '/',
      destination: '/home'
    }
  ]
};

export default nextConfig;
