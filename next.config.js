/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "res.cloudinary.com",
      "lh3.googleusercontent.com",
      "www.leafrootfruit.com.au",
      "loremflickr.com",
      "mcprod.hyperone.com.eg",
      "cdnprod.mafretailproxy.com",
      "cdn.mafrservices.com",
    ],
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  eslint: {
    ignoreDuringBuilds: true, // Only if you have separate CI checks
  },
  typescript: {
    ignoreBuildErrors: true, // Keep false to catch TS errors
  },
};

module.exports = nextConfig;
