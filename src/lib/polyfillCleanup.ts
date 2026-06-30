/**
 * polyfillCleanup.ts — Polyfill 剔除说明
 *
 * 问题定位：
 * 原 Turbopack 构建产物中包含了以下 Node.js polyfill：
 * - process polyfill（module 35451 → "next/dist/compiled/process/"）
 * - Buffer polyfill（module 67034）
 * - setImmediate / nextTick polyfill（module 229）
 *
 * 这些 polyfill 由 Turbopack 自动注入，因为某些依赖（如 next/dist/compiled/process）
 * 引用 Node.js 全局变量。在现代浏览器（Chrome 90+, Firefox 90+, Safari 15+）中，
 * fetch、Object.assign、Promise.all、Map、Set、Array.from 等都是原生支持的。
 *
 * 剔除方案：
 * 1. 在 next.config.js 或 turbopack 配置中关闭 Node.js polyfill 注入
 * 2. 或使用 webpack 的 resolve.fallback 配置（如果使用 webpack 构建）
 * 3. 移除项目中对 process 和 Buffer 的任何显式引用
 * 4. 确认所有第三方库的 browser field 指向了浏览器版本
 */

/**
 * Next.js 配置示例（关闭 polyfill 注入）
 *
 * ```ts
 * // next.config.ts
 * import type { NextConfig } from 'next';
 *
 * const nextConfig: NextConfig = {
 *   // Turbopack 配置
 *   experimental: {
 *     turbo: {
 *       // 禁用 Node.js polyfill
 *       resolveAlias: {
 *         process: false,
 *         buffer: false,
 *       },
 *     },
 *   },
 *   // Webpack fallback（用于非 Turbopack 构建）
 *   webpack: (config) => {
 *     config.resolve.fallback = {
 *       ...config.resolve.fallback,
 *       process: false,
 *       buffer: false,
 *       crypto: false,
 *       stream: false,
 *       util: false,
 *     };
 *     return config;
 *   },
 * };
 * ```
 */

/**
 * 需要移除的显式 polyfill 引用：
 *
 * 1. 在 src/ 源码中搜索以下全局引用并移除：
 *    - `globalThis.process` 或 `typeof process !== 'undefined'`
 *    - `Buffer.from` 或 `Buffer.alloc`
 *    - `setImmediate` 或 `clearImmediate`
 *
 * 2. 检查 package.json 中的依赖，移除不再需要的 polyfill 包：
 *    - `buffer`
 *    - `process`
 *    - `util`（如果只用于 polyfill）
 */

export {};
