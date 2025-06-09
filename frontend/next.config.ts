// next.config.js

require("dotenv").config({ path: "../.env" });

const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'galeria.bankier.pl',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ipla.pluscdn.pl',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.polsatnews.pl',
        pathname: '/**',
      }
    ],
  },
  reactStrictMode: true,

  // --- START: PROXY CONFIGURATION CORRECTED ---
  async rewrites() {
    return [
      {
        // MODIFIED: This source uses a compatible custom regex for the `:path` parameter.
        // It tells Next.js to match any path under `/api/` where the path
        // itself does not start with `auth`.
        source: '/api/:path((?!auth).*)',

        // The destination remains the same, proxying to your backend.
        destination: 'http://backend:8080/:path*',
      },
    ]
  },
  // --- END: PROXY CONFIGURATION CORRECTED ---

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = withPWA(nextConfig);