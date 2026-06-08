/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['react-map-gl', 'mapbox-gl'],
  // Avoid treating legacy CRA entry as routes
  pageExtensions: ['jsx', 'js', 'tsx', 'ts'],
  async redirects() {
    return [
      {
        source: '/favicon.ico',
        destination: '/favicon.png?v=3',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
