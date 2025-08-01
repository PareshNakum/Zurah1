/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: true,
  // output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: ['rpdiamondsandjewellery-staging.s3.ap-southeast-1.amazonaws.com','rpdiamondsandjewellery-uat.s3.ap-southeast-1.amazonaws.com'],
  },
};

export default nextConfig;
