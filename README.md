# 云文档 (Cloud Document)

一个现代化的本地文档编辑器，采用飞书云文档风格设计，支持实时保存、全局搜索、虚拟滚动等功能。

## ✨ 功能特性

### 核心功能
- 📝 **富文本编辑器** - 支持多种块类型（段落、标题、列表、引用、代码块等）
- 💾 **实时自动保存** - 1秒防抖自动保存，数据持久化到本地存储
- 🔍 **全局搜索** - 搜索所有页面标题和内容
- ⌨️ **键盘快捷键** - 支持 Ctrl+N/S/K/Z 等常用快捷键
- 📊 **数据库表格** - 支持创建和管理表格数据

### 性能优化
- 🚀 **虚拟滚动** - 使用 @tanstack/react-virtual 实现大列表高性能渲染
- ⚡ **响应式设计** - 流畅的用户体验

### 界面设计
- 🎨 **飞书云文档风格** - 现代化的紫色主题设计
- 🌙 **深色模式** - 支持明暗主题切换
- 📱 **响应式布局** - 适配不同屏幕尺寸

## 🛠️ 技术栈

- **框架**: Next.js 16
- **语言**: TypeScript
- **状态管理**: Zustand
- **编辑器**: BlockNote (@blocknote/react)
- **样式**: Tailwind CSS 4
- **虚拟滚动**: @tanstack/react-virtual
- **图标**: Lucide React
- **存储**: IndexedDB (idb)

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:3000 查看应用。

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 📁 项目结构

```
├── src/
│   ├── app/                 # Next.js 应用入口
│   │   ├── layout.tsx       # 布局组件
│   │   └── page.tsx         # 首页
│   ├── components/          # UI 组件
│   │   ├── editor/          # 编辑器组件
│   │   ├── layout/          # 布局组件
│   │   ├── database/        # 数据库组件
│   │   ├── search/          # 搜索组件
│   │   └── ui/              # 基础 UI 组件
│   ├── hooks/               # 自定义 Hooks
│   ├── stores/              # Zustand 状态管理
│   ├── lib/                 # 工具函数和存储
│   └── types/               # TypeScript 类型定义
├── public/                  # 静态资源
├── next.config.ts           # Next.js 配置
├── wrangler.toml           # Cloudflare Pages 配置
└── package.json            # 项目依赖
```

## ⌨️ 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl + N` | 新建页面 |
| `Ctrl + K` | 打开搜索 |
| `Ctrl + S` | 手动保存 |
| `Ctrl + Z` | 撤销 |
| `Ctrl + Shift + Z` | 重做 |
| `Escape` | 关闭弹窗 |

## 🚀 部署

### Cloudflare Pages

1. 配置构建命令：`npm run build`
2. 配置输出目录：`out`
3. 框架预设：`Next.js`

### Vercel

直接导入 GitHub 仓库即可自动部署。

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

⭐ 如果这个项目对你有帮助，请给个 Star！
