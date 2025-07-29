/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Replace with your Vercel URL
    allowedDevOrigins: ["https://haven-project-tau.vercel.app"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
