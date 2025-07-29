/** @type {import('next').NextConfig} */
const nextConfig = {
  // The key is moved to the root level, NOT inside 'experimental'
  allowedDevOrigins: [
    "https://haven-project-tau.vercel.app", // Paste your final Vercel URL here
    "https://3000-firebase-haven-1753564061535.cluster-rhptpnrfenhe4qarq36djxjqmg.cloudworkstations.dev", // Paste your IDX preview URL here
  ],

  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
