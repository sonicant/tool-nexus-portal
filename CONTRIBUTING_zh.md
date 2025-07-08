# 🤝 为 Tool Nexus Portal 贡献

[🇺🇸 English Version](./CONTRIBUTING.md)

首先，感谢您考虑为 Tool Nexus Portal 做出贡献！正是像您这样的人让 Tool Nexus Portal 成为社区的优秀工具。

## 📋 目录

- [行为准则](#行为准则)
- [开始贡献](#开始贡献)
- [如何贡献？](#如何贡献)
- [开发环境设置](#开发环境设置)
- [添加新工具](#添加新工具)
- [编码标准](#编码标准)
- [提交指南](#提交指南)
- [Pull Request 流程](#pull-request-流程)
- [社区](#社区)

## 📜 行为准则

本项目和参与其中的每个人都受我们的[行为准则](./CODE_OF_CONDUCT.md)约束。通过参与，您需要遵守此准则。

## 🚀 开始贡献

### 前置要求

- Node.js 18+ 和 npm
- Git
- GitHub 账户
- React、TypeScript 和 Tailwind CSS 的基础知识

### 开发环境设置

1. **Fork 仓库**
   ```bash
   # 在 GitHub 上点击 "Fork" 按钮
   ```

2. **克隆您的 fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/tool-nexus-portal.git
   cd tool-nexus-portal
   ```

3. **添加上游远程仓库**
   ```bash
   git remote add upstream https://github.com/original-owner/tool-nexus-portal.git
   ```

4. **安装依赖**
   ```bash
   npm install
   ```

5. **启动开发服务器**
   ```bash
   npm run dev
   ```

6. **验证一切正常**
   - 打开 `http://localhost:8080`
   - 测试现有工具
   - 检查 UI 是否正确加载

## 🛠️ 如何贡献？

### 🐛 报告错误

在创建错误报告之前，请检查现有问题以避免重复。

**提交错误报告时，请包含：**
- 清晰、描述性的标题
- 重现问题的步骤
- 预期与实际行为
- 截图（如适用）
- 浏览器和操作系统信息
- 控制台错误（如有）

### 💡 建议改进

我们欢迎功能建议！请：
- 首先检查现有功能请求
- 提供清晰的改进描述
- 解释为什么这个功能有用
- 如可能，包含模型图或示例

### 🔧 添加新工具

我们一直在寻找新的有用工具！请参见下面的[添加新工具](#添加新工具)部分。

### 🌐 改进翻译

帮助我们让 Tool Nexus Portal 为更多用户提供服务：
- 改进现有翻译
- 添加新语言支持
- 修复翻译不一致问题

### 📚 文档

- 改进现有文档
- 添加示例和教程
- 修复拼写和语法错误
- 创建视频教程

## 🔨 添加新工具

### 工具要求

在添加新工具之前，确保它：
- 服务于真正的实用目的
- 不重复现有功能
- 完全在客户端工作（无服务器依赖）
- 遵循我们的 UI/UX 模式
- 包含适当的错误处理
- 支持国际化

### 分步指南

1. **创建工具目录**
   ```bash
   mkdir src/tools/your-tool-name
   cd src/tools/your-tool-name
   ```

2. **创建主组件**
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
             {/* 您的工具实现 */}
           </CardContent>
         </Card>
       </div>
     );
   }
   ```

3. **创建元数据文件**
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
     icon: 'tool-icon', // 使用 Lucide 图标名称
     category: 'utility', // 或 'converter', 'generator', 'network'
     keywords: ['keyword1', 'keyword2'],
     path: '/tools/your-tool-name'
   };
   ```

4. **注册工具**
   ```typescript
   // 在 src/registry/toolRegistry.ts 中
   import { YourToolName } from '../tools/your-tool-name/YourToolName';
   import { yourToolMeta } from '../tools/your-tool-name/meta';
   
   // 添加到注册表
   {
     component: YourToolName,
     meta: yourToolMeta
   }
   ```

5. **添加翻译**
   ```typescript
   // 在 src/i18n/translations.ts 中
   yourTool: {
     title: {
       en: 'Your Tool Name',
       zh: '你的工具名称'
     },
     // 添加所有必要的翻译
   }
   ```

6. **添加图标支持**（如果使用新图标）
   ```typescript
   // 在 src/components/layout/ToolCard.tsx 中
   import { YourIcon } from 'lucide-react';
   
   const iconMap = {
     // 现有图标...
     'your-icon': YourIcon,
   };
   ```

### 工具最佳实践

- **性能**：针对大输入进行优化
- **可访问性**：使用语义 HTML 和 ARIA 标签
- **错误处理**：提供清晰的错误消息
- **验证**：验证输入并显示有用的反馈
- **响应式设计**：确保移动端兼容性
- **加载状态**：为长时间操作显示进度
- **复制/下载**：提供使用结果的简便方法

## 📏 编码标准

请遵循我们的[编码标准](./CODING_STANDARDS.md)获取详细指南。

### 快速指南

- 所有新代码使用 TypeScript
- 遵循现有代码风格和模式
- 使用带 hooks 的函数组件
- 实现适当的错误边界
- 为复杂函数添加 JSDoc 注释
- 使用语义 HTML 元素
- 遵循可访问性最佳实践

## 📝 提交指南

我们遵循[约定式提交](https://www.conventionalcommits.org/)规范：

```
type(scope): description

[optional body]

[optional footer]
```

### 类型
- `feat`: 新功能
- `fix`: 错误修复
- `docs`: 文档更改
- `style`: 代码风格更改（格式化等）
- `refactor`: 代码重构
- `test`: 添加或更新测试
- `chore`: 维护任务

### 示例
```bash
feat(tools): add QR code generator tool
fix(json-diff): handle null values correctly
docs(readme): update installation instructions
style(components): fix linting issues
```

## 🔄 Pull Request 流程

1. **创建功能分支**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **进行更改**
   - 遵循编码标准
   - 如适用，添加测试
   - 更新文档

3. **测试您的更改**
   ```bash
   npm run dev
   npm run build
   npm run lint
   ```

4. **提交您的更改**
   ```bash
   git add .
   git commit -m "feat(tools): add amazing new tool"
   ```

5. **推送到您的 fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **创建 Pull Request**
   - 使用清晰、描述性的标题
   - 填写 PR 模板
   - 链接相关问题
   - 为 UI 更改添加截图

### PR 审查流程

- 所有 PR 需要至少一次审查
- 及时处理审查反馈
- 保持 PR 专注且大小合理
- 确保 CI 检查通过
- 保持分支最新

## 🏷️ 问题标签

- `bug`: 某些功能不工作
- `enhancement`: 新功能或请求
- `documentation`: 文档改进或添加
- `good first issue`: 适合新手
- `help wanted`: 需要额外关注
- `tool request`: 新工具请求
- `translation`: 翻译相关问题

## 🌟 认可

贡献者将在以下地方得到认可：
- README 致谢
- 发布说明
- GitHub 贡献者页面
- 重大贡献的特别提及

## 💬 社区

- **GitHub 讨论**：用于问题和一般讨论
- **Issues**：用于错误报告和功能请求
- **Pull Requests**：用于代码贡献

## 📞 获取帮助

如果您需要帮助：
1. 检查现有文档
2. 搜索现有问题
3. 在 GitHub 讨论中询问
4. 创建带有 `help wanted` 标签的新问题

---

感谢您为 Tool Nexus Portal 做出贡献！🎉

您的贡献帮助这个项目为社区中的每个人变得更好。