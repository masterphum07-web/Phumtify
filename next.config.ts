import type { NextConfig } from 'next';

const isPages = process.env.GITHUB_ACTIONS === 'true';
const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(isPages ? { output: 'export', basePath: '/Phumtify', images: { unoptimized: true } } : {}),
};

export default nextConfig;
