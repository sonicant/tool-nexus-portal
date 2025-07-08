# 🛠️ Tool Nexus Portal

> 为开发者、系统管理员和技术爱好者提供的全面IT工具集合平台。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[🇺🇸 English](./README.md) | [🤝 贡献指南](./CONTRIBUTING.md) | [📋 行为准则](./CODE_OF_CONDUCT.md)

## ✨ 特性

- 🎯 **一体化平台**：在统一界面中集成多个必备IT工具
- 🌐 **多语言支持**：完整的国际化支持，包含英文和中文
- 🎨 **现代化UI/UX**：基于shadcn/ui和Tailwind CSS构建的美观响应式设计
- ⚡ **高性能**：由React和Vite驱动的快速高效工具
- 🔧 **开发者友好**：使用TypeScript编写的清洁、可维护代码
- 📱 **移动端响应式**：在所有设备上无缝工作
- 🌙 **深色模式**：内置主题切换支持

## 🛠️ 可用工具

### 🔄 转换器和编码器
- **JSON/XML转换器**：在JSON和XML格式之间转换
- **URL编码/解码器**：安全地编码和解码URL
- **文本哈希生成器**：生成MD5、SHA1、SHA256和Base64哈希

### 🔍 实用工具
- **JSON差异检查器**：比较并可视化JSON对象之间的差异
- **文本差异检查器**：比较文本文件并突出显示差异
- **UUID生成器**：生成各种类型的UUID
- **二维码生成器**：创建可自定义颜色选项的二维码

### 🌐 网络工具
- **子网计算器**：计算网络子网和IP范围

*更多工具正在持续添加中！*

## 🚀 快速开始

### 前置要求

- Node.js 18+ 和 npm（推荐使用 [nvm](https://github.com/nvm-sh/nvm) 安装）
- Git

### 安装

```bash
# 克隆仓库
git clone https://github.com/your-username/tool-nexus-portal.git

# 进入项目目录
cd tool-nexus-portal

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

应用程序将在 `http://localhost:8080` 可用

### 生产环境构建

```bash
# 构建项目
npm run build

# 预览构建结果
npm run preview
```

## 🏗️ 项目结构

```
src/
├── components/          # 可复用UI组件
│   ├── layout/         # 布局组件（Header、Footer等）
│   └── ui/             # shadcn/ui组件
├── hooks/              # 自定义React hooks
├── i18n/               # 国际化
├── pages/              # 页面组件
├── tools/              # 各个工具实现
│   ├── json-diff/
│   ├── qr-generator/
│   └── ...
├── registry/           # 工具注册和路由
├── types/              # TypeScript类型定义
└── lib/                # 工具函数
```

## 🛠️ 技术栈

- **前端框架**：React 18 with TypeScript
- **构建工具**：Vite
- **样式**：Tailwind CSS + shadcn/ui
- **路由**：React Router DOM
- **状态管理**：React Hooks
- **国际化**：自定义i18n实现
- **图标**：Lucide React
- **代码质量**：ESLint + TypeScript

## 🤝 贡献

我们欢迎社区贡献！请阅读我们的[贡献指南](./CONTRIBUTING.md)开始参与。

### 快速贡献步骤

1. Fork 仓库
2. 创建功能分支：`git checkout -b feature/amazing-tool`
3. 进行更改并添加测试
4. 提交更改：`git commit -m 'Add amazing new tool'`
5. 推送到分支：`git push origin feature/amazing-tool`
6. 打开Pull Request

## 📝 添加新工具

要向平台添加新工具：

1. 在 `src/tools/your-tool-name/` 中创建新目录
2. 按照现有模式实现工具组件
3. 创建包含工具元数据的 `meta.ts` 文件
4. 在 `src/registry/toolRegistry.ts` 中注册工具
5. 在 `src/i18n/translations.ts` 中添加翻译

详细指南请参见我们的[编码标准](./CODING_STANDARDS.md)。

## 🌐 国际化

项目支持多种语言：

- **英语**（默认）
- **中文（简体）**

要添加新语言，请在 `src/i18n/translations.ts` 中更新翻译。

## 📄 许可证

本项目采用MIT许可证 - 详情请参见 [LICENSE](./LICENSE) 文件。

## 🙏 致谢

- [shadcn/ui](https://ui.shadcn.com/) 提供的美观UI组件
- [Lucide](https://lucide.dev/) 提供的图标集
- [Tailwind CSS](https://tailwindcss.com/) 提供的实用优先CSS框架
- 所有帮助改进此项目的贡献者

## 📞 支持

如果您有任何问题或需要帮助：

- 📧 创建 [Issue](https://github.com/your-username/tool-nexus-portal/issues)
- 💬 开始 [讨论](https://github.com/your-username/tool-nexus-portal/discussions)
- 📖 查看我们的 [文档](https://github.com/your-username/tool-nexus-portal/wiki)

---

<div align="center">
  <p>由Tool Nexus Portal团队用❤️制作</p>
  <p>⭐ 如果您觉得有帮助，请为此仓库点星！</p>
</div>