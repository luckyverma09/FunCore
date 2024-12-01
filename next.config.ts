import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack(config) {
    // Add rule to handle .graphql files using graphql-tag loader
    config.module.rules.push({
      test: /\.graphql$/,
      loader: 'graphql-tag/loader',
    });

    return config;
  },
};

export default nextConfig;
