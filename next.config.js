/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  // 静态导出配置（适配 Cloudflare Pages 部署）
  // 仅在生产构建时启用，开发模式下禁用以避免 RSC/Fast Refresh 错误
  // Cloudflare Pages 直接托管 out/ 目录的静态文件，无需 basePath
  ...(isProd ? { output: "export" } : {}),

  // 禁用 image optimization（静态导出要求）
  images: { unoptimized: true },

  // 优化包导入，让编译器更好地 tree-shake 按需引入的子模块
  experimental: {
    optimizePackageImports: [
      "@mantine/core",
      "@mantine/hooks",
      "@mantine/dates",
      "lucide-react",
      "date-fns",
      "@blocknote/react",
      "@blocknote/mantine",
      "@blocknote/core",
    ],
  },

  // 移除 X-Powered-By 响应头
  poweredByHeader: false,

  // Webpack fallback（非 Turbopack 构建时使用）
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        process: false,
        buffer: false,
        crypto: false,
        stream: false,
        util: false,
        fs: false,
        path: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
