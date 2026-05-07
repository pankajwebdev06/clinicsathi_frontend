import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Explicitly use Turbopack (Next.js 16 default)
  // This silences the webpack/turbopack conflict warning
  turbopack: {},

  // Image optimization for faster loading on 3G
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Enable compression for 3G networks
  compress: true,

  // Production optimizations
  productionBrowserSourceMaps: false,

  // Experimental features for performance
  experimental: {
    // Optimize package imports for common libraries
    optimizePackageImports: ['lucide-react', '@tanstack/react-query'],
  },

  // webpack optimizations
  webpack: (config, { isServer }) => {
    // Optimize bundle size
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
            common: {
              minChunks: 2,
              chunks: 'all',
              enforce: true,
            },
          },
        },
      };
    }
    return config;
  },

  // Headers for caching and performance
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png|webp|avif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:all*(js|css)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Trailing slash for SEO
  trailingSlash: true,
};

export default nextConfig;
