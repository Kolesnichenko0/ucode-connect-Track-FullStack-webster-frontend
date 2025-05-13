
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, 
  onDemandEntries: {
    
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  devIndicators: false,
  trailingSlash: true,
};

module.exports = nextConfig;