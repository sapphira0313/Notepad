import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  
  // 启用压缩
  compress: true,
  
  // Turbopack 配置（Next.js 16 默认使用 Turbopack）
  turbopack: {},
  
  // 优化字体加载
  experimental: {
    optimizeCss: true,
  },
  
  // 配置 HTTP 缓存头
  headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  
  // 优化构建输出
  webpack(config, { isServer }) {
    // 客户端构建时启用代码分割
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
          },
          mantine: {
            test: /[\\/]node_modules[\\/](@mantine|@base-ui)[\\/]/,
            name: "mantine",
            chunks: "all",
            priority: 10,
          },
          blocknote: {
            test: /[\\/]node_modules[\\/](@blocknote)[\\/]/,
            name: "blocknote",
            chunks: "all",
            priority: 10,
          },
          tanstack: {
            test: /[\\/]node_modules[\\/](@tanstack)[\\/]/,
            name: "tanstack",
            chunks: "all",
            priority: 10,
          },
        },
      };
    }
    
    return config;
  },
};

export default nextConfig;