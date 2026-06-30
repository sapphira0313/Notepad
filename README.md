# 云文档 (Cloud Docs)

本地优先的 Notion-like 富文本记事本，所有数据保存在浏览器 IndexedDB 中。

## 技术栈

- **Next.js 14** (静态导出模式)
- **BlockNote** 富文本编辑器
- **Tailwind CSS** + **Mantine** UI
- **Zustand** 状态管理
- **IndexedDB** (idb) 本地存储

## 本地开发

```bash
npm install
npm run dev
```

访问 http://localhost:3000

## 构建生产版本

```bash
npm run build
```

构建产物输出到 `out/` 目录。

## 部署到 Cloudflare Pages

### 方式一：通过 GitHub 自动部署（推荐）

1. **推送代码到 GitHub**

   ```bash
   git init
   git add -A
   git commit -m "feat: cloud-docs editor"
   git remote add origin https://github.com/<你的用户名>/<仓库名>.git
   git branch -M main
   git push -u origin main
   ```

2. **在 Cloudflare 创建 Pages 项目**

   - 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
   - 进入 **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
   - 选择你的 GitHub 仓库

3. **配置构建（关键！）**

   | 配置项 | 值 |
   |--------|-----|
   | **Framework preset** | `Next.js (Static HTML Export)` |
   | **Build command** | `npm run build` |
   | **Build output directory** | `out` |
   | **Root directory** | `/`（留空） |

   > ⚠️ **不要**使用 `npx @cloudflare/next-on-pages` 作为构建命令！
   > 本项目是静态导出（`output: "export"`），不是 SSR 应用。

4. **设置环境变量（可选）**

   | 变量名 | 值 |
   |--------|-----|
   | `NODE_VERSION` | `20` |

5. **点击 Save and Deploy**，等待构建完成即可访问。

### 方式二：通过 Wrangler CLI 手动部署

1. **安装 Wrangler**

   ```bash
   npm install -g wrangler
   ```

2. **登录 Cloudflare**

   ```bash
   wrangler login
   ```

3. **构建并部署**

   ```bash
   npm run build
   wrangler pages deploy out --project-name cloud-docs
   ```

## 功能特性

- 富文本编辑（标题、列表、代码块、引用、表格等）
- Slash 菜单（输入 `/` 唤出，支持 40+ 功能项）
- 多级文档树管理
- 收藏 / 最近访问
- 面包屑导航
- 深色 / 浅色主题
- 撤销 / 重做（Ctrl+Z / Ctrl+Y）
- Markdown / HTML 导入导出
- 数据完全本地存储，无需后端

## 项目结构

```
├── app/
│   ├── layout.tsx          # 根布局
│   └── page.tsx            # 主页面
├── src/
│   ├── components/         # React 组件
│   ├── hooks/              # 自定义 Hooks
│   ├── lib/                # 工具库（存储、历史等）
│   ├── store/              # Zustand 状态管理
│   └── styles/             # 全局样式
├── next.config.js          # Next.js 配置（静态导出）
├── wrangler.toml           # Cloudflare Pages 配置
└── tailwind.config.js      # Tailwind 配置
```
