/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponents: true,
    serverComponentsExternalModules: ['mongoose']
  },
  images: {
    domains: ['m.media-amazon.com']
  }
};

export default nextConfig;