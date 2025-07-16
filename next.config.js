/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure proper handling of file uploads and external packages
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse'],
  },
}

module.exports = {
  ...nextConfig,
  env: {
    NEXT_PUBLIC_TEST_MODE: process.env.TEST_MODE || 'true',
  },
}; 