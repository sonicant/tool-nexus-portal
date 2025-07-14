# 🛠️ Tool Nexus Portal

> A comprehensive collection of essential IT tools for developers, system administrators, and tech enthusiasts.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[🇨🇳 中文文档](./README_zh.md) | [🤝 Contributing](./CONTRIBUTING.md) | [📋 Code of Conduct](./CODE_OF_CONDUCT.md)

[🌍 Online version](https://www.tool-nexus.pro/)


## ✨ Features

- 🎯 **All-in-One Platform**: Multiple essential IT tools in a single, unified interface
- 🌐 **Multilingual Support**: Full internationalization with English and Chinese support
- 🎨 **Modern UI/UX**: Beautiful, responsive design built with shadcn/ui and Tailwind CSS
- ⚡ **High Performance**: Fast and efficient tools powered by React and Vite
- 🔧 **Developer Friendly**: Clean, maintainable code with TypeScript
- 📱 **Mobile Responsive**: Works seamlessly across all devices
- 🌙 **Dark Mode**: Built-in theme switching support

## 🛠️ Available Tools

### 🔄 Converters & Encoders
- **JSON/XML Converter**: Convert between JSON and XML formats
- **URL Encoder/Decoder**: Encode and decode URLs safely
- **Text Hash Generator**: Generate MD5, SHA1, SHA256, and Base64 hashes

### 🔍 Utilities
- **JSON Diff Checker**: Compare and visualize differences between JSON objects
- **Text Diff Checker**: Compare text files and highlight differences
- **UUID Generator**: Generate various types of UUIDs
- **QR Code Generator**: Create customizable QR codes with color options

### 🌐 Network Tools
- **Subnet Calculator**: Calculate network subnets and IP ranges

*More tools are continuously being added!*

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm (recommended: install with [nvm](https://github.com/nvm-sh/nvm))
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/tool-nexus-portal.git

# Navigate to project directory
cd tool-nexus-portal

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:8080`

### Build for Production

```bash
# Build the project
npm run build

# Preview the build
npm run preview
```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (Header, Footer, etc.)
│   └── ui/             # shadcn/ui components
├── hooks/              # Custom React hooks
├── i18n/               # Internationalization
├── pages/              # Page components
├── tools/              # Individual tool implementations
│   ├── json-diff/
│   ├── qr-generator/
│   └── ...
├── registry/           # Tool registry and routing
├── types/              # TypeScript type definitions
└── lib/                # Utility functions
```

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Routing**: React Router DOM
- **State Management**: React Hooks
- **Internationalization**: Custom i18n implementation
- **Icons**: Lucide React
- **Code Quality**: ESLint + TypeScript

## 🤝 Contributing

We welcome contributions from the community! Please read our [Contributing Guide](./CONTRIBUTING.md) to get started.

### Quick Contribution Steps

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-tool`
3. Make your changes and add tests
4. Commit your changes: `git commit -m 'Add amazing new tool'`
5. Push to the branch: `git push origin feature/amazing-tool`
6. Open a Pull Request

## 📝 Adding New Tools

To add a new tool to the platform:

1. Create a new directory in `src/tools/your-tool-name/`
2. Implement your tool component following the existing patterns
3. Create a `meta.ts` file with tool metadata
4. Register your tool in `src/registry/toolRegistry.ts`
5. Add translations in `src/i18n/translations.ts`

See our [Coding Standards](./CODING_STANDARDS.md) for detailed guidelines.

## 🌐 Internationalization

The project supports multiple languages:

- **English** (default)
- **Chinese (Simplified)**

To add a new language, update the translations in `src/i18n/translations.ts`.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Lucide](https://lucide.dev/) for the icon set
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- All contributors who help make this project better

## 📞 Support

If you have any questions or need help:

- 📧 Create an [Issue](https://github.com/sonicant/tool-nexus-portal/issues)
- 💬 Start a [Discussion](https://github.com/sonicant/tool-nexus-portal/discussions)

---

<div align="center">
  <p>Made with ❤️ by the Tool Nexus Portal team</p>
  <p>⭐ Star this repository if you find it helpful!</p>
</div>
