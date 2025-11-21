import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  webpack: (config) => {
    // Support pour les Web Components
    config.module.rules.push({
      test: /\.ts$/,
      use: 'ts-loader',
      exclude: /node_modules/,
    });
    return config;
  },
};

export default nextConfig;
