# 🤝 Contributing to Tool Nexus Portal

[🇨🇳 中文版本](./CONTRIBUTING_zh.md)

First off, thank you for considering contributing to Tool Nexus Portal! It's people like you that make Tool Nexus Portal such a great tool for the community.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Adding New Tools](#adding-new-tools)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Community](#community)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- A GitHub account
- Basic knowledge of React, TypeScript, and Tailwind CSS

### Development Setup

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/tool-nexus-portal.git
   cd tool-nexus-portal
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/original-owner/tool-nexus-portal.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Verify everything works**
   - Open `http://localhost:8080`
   - Test existing tools
   - Check that the UI loads correctly

## 🛠️ How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates.

**When submitting a bug report, please include:**
- Clear, descriptive title
- Steps to reproduce the issue
- Expected vs actual behavior
- Screenshots (if applicable)
- Browser and OS information
- Console errors (if any)

### 💡 Suggesting Enhancements

We welcome feature suggestions! Please:
- Check existing feature requests first
- Provide a clear description of the enhancement
- Explain why this feature would be useful
- Include mockups or examples if possible

### 🔧 Adding New Tools

We're always looking for new useful tools! See the [Adding New Tools](#adding-new-tools) section below.

### 🌐 Improving Translations

Help us make Tool Nexus Portal accessible to more users:
- Improve existing translations
- Add support for new languages
- Fix translation inconsistencies

### 📚 Documentation

- Improve existing documentation
- Add examples and tutorials
- Fix typos and grammar issues
- Create video tutorials

## 🔨 Adding New Tools

### Tool Requirements

Before adding a new tool, ensure it:
- Serves a genuine utility purpose
- Doesn't duplicate existing functionality
- Works entirely client-side (no server dependencies)
- Follows our UI/UX patterns
- Includes proper error handling
- Supports internationalization

### Step-by-Step Guide

1. **Create tool directory**
   ```bash
   mkdir src/tools/your-tool-name
   cd src/tools/your-tool-name
   ```

2. **Create the main component**
   ```typescript
   // YourToolName.tsx
   import React, { useState } from 'react';
   import { useTranslation } from '../../hooks/useTranslation';
   import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
   
   export function YourToolName() {
     const { t } = useTranslation();
     
     return (
       <div className="container mx-auto p-6">
         <Card>
           <CardHeader>
             <CardTitle>{t('yourTool.title')}</CardTitle>
           </CardHeader>
           <CardContent>
             {/* Your tool implementation */}
           </CardContent>
         </Card>
       </div>
     );
   }
   ```

3. **Create metadata file**
   ```typescript
   // meta.ts
   import { ToolMeta } from '../../types/tool';
   
   export const yourToolMeta: ToolMeta = {
     id: 'your-tool-name',
     name: {
       en: 'Your Tool Name',
       zh: '你的工具名称'
     },
     description: {
       en: 'Description of what your tool does',
       zh: '你的工具功能描述'
     },
     icon: 'tool-icon', // Use Lucide icon name
     category: 'utility', // or 'converter', 'generator', 'network'
     keywords: ['keyword1', 'keyword2'],
     path: '/tools/your-tool-name'
   };
   ```

4. **Register the tool**
   ```typescript
   // In src/registry/toolRegistry.ts
   import { YourToolName } from '../tools/your-tool-name/YourToolName';
   import { yourToolMeta } from '../tools/your-tool-name/meta';
   
   // Add to the registry
   {
     component: YourToolName,
     meta: yourToolMeta
   }
   ```

5. **Add translations**
   ```typescript
   // In src/i18n/translations.ts
   yourTool: {
     title: {
       en: 'Your Tool Name',
       zh: '你的工具名称'
     },
     // Add all necessary translations
   }
   ```

6. **Add icon support** (if using new icon)
   ```typescript
   // In src/components/layout/ToolCard.tsx
   import { YourIcon } from 'lucide-react';
   
   const iconMap = {
     // existing icons...
     'your-icon': YourIcon,
   };
   ```

### Tool Best Practices

- **Performance**: Optimize for large inputs
- **Accessibility**: Use semantic HTML and ARIA labels
- **Error Handling**: Provide clear error messages
- **Validation**: Validate inputs and show helpful feedback
- **Responsive Design**: Ensure mobile compatibility
- **Loading States**: Show progress for long operations
- **Copy/Download**: Provide easy ways to use results

## 📏 Coding Standards

Please follow our [Coding Standards](./CODING_STANDARDS.md) for detailed guidelines.

### Quick Guidelines

- Use TypeScript for all new code
- Follow existing code style and patterns
- Use functional components with hooks
- Implement proper error boundaries
- Add JSDoc comments for complex functions
- Use semantic HTML elements
- Follow accessibility best practices

## 📝 Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

[optional body]

[optional footer]
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples
```bash
feat(tools): add QR code generator tool
fix(json-diff): handle null values correctly
docs(readme): update installation instructions
style(components): fix linting issues
```

## 🔄 Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow coding standards
   - Add tests if applicable
   - Update documentation

3. **Test your changes**
   ```bash
   npm run dev
   npm run build
   npm run lint
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat(tools): add amazing new tool"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create Pull Request**
   - Use a clear, descriptive title
   - Fill out the PR template
   - Link related issues
   - Add screenshots for UI changes

### PR Review Process

- All PRs require at least one review
- Address review feedback promptly
- Keep PRs focused and reasonably sized
- Ensure CI checks pass
- Maintain up-to-date branches

## 🏷️ Issue Labels

- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Improvements or additions to documentation
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention is needed
- `tool request`: Request for a new tool
- `translation`: Translation-related issues

## 🌟 Recognition

Contributors are recognized in:
- README acknowledgments
- Release notes
- GitHub contributors page
- Special mentions for significant contributions

## 💬 Community

- **GitHub Discussions**: For questions and general discussion
- **Issues**: For bug reports and feature requests
- **Pull Requests**: For code contributions

## 📞 Getting Help

If you need help:
1. Check existing documentation
2. Search existing issues
3. Ask in GitHub Discussions
4. Create a new issue with the `help wanted` label

---

Thank you for contributing to Tool Nexus Portal! 🎉

Your contributions help make this project better for everyone in the community.