
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
};

module.exports = withPWA(nextConfig);
