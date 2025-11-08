/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["papaparse", "zustand", "zod", "clsx"],
  },
};

export default nextConfig;
