# How to Add New Tools to Tool Nexus Portal

本文档基于XML Validator工具的开发经验，为协作者提供添加新工具的完整指南。

## 目录结构说明

### 项目整体结构
```
src/
├── tools/                    # 所有工具的根目录
│   ├── tool-name/            # 单个工具目录（kebab-case命名）
│   │   ├── ToolNameTool.tsx  # 主组件文件（PascalCase）
│   │   └── meta.ts           # 工具元数据配置
├── registry/
│   └── toolRegistry.ts       # 工具注册中心
├── i18n/
│   └── translations.ts       # 国际化翻译文件
└── types/
    └── tool.ts              # 工具类型定义
```

### 工具目录命名规范
- 使用 kebab-case 命名（如：`xml-validator`, `subnet-calculator`）
- 目录名应简洁明了，体现工具功能
- 避免使用缩写，优先使用完整单词

## 必需文件清单

每个新工具必须包含以下文件：

### 1. 主组件文件：`ToolNameTool.tsx`

**命名规范：**
- 文件名：`{ToolName}Tool.tsx`（PascalCase）
- 组件名：`{ToolName}Tool`
- 导出方式：命名导出 `export { ToolNameTool }`

**必需的页面结构：**
```tsx
import { HomeButton } from '@/components/ui/home-button';

export const ToolNameTool = () => {
  const { t } = useI18n();
  
  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* 页面头部 - 必需 */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-primary rounded-xl shadow-primary">
            <IconComponent className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{t('tools.toolName.name')}</h1>
            <p className="text-muted-foreground">{t('tools.toolName.description')}</p>
          </div>
        </div>
        <HomeButton />
      </div>
      
      {/* 工具功能区域 */}
      <Card>
        {/* 工具具体实现 */}
      </Card>
    </div>
  );
};
```

**必需的页面元素：**
1. **主容器**：`container mx-auto py-8 space-y-6`
2. **页面头部**：包含图标、标题、描述和HomeButton
3. **图标容器**：`p-3 bg-gradient-primary rounded-xl shadow-primary`
4. **标题**：使用 `text-3xl font-bold` 样式
5. **描述**：使用 `text-muted-foreground` 样式
6. **HomeButton**：必须包含用于导航
7. **功能卡片**：使用 `Card` 组件包装主要功能

### 2. 元数据文件：`meta.ts`

```typescript
export const meta = {
  id: 'tool-name',                    // 唯一标识符，与目录名一致
  name: {
    en: 'Tool Name',
    zh: '工具名称'
  },
  description: {
    en: 'Tool description in English',
    zh: '工具的中文描述'
  },
  category: 'category-id',             // 工具分类ID
  keywords: ['keyword1', 'keyword2'],  // 搜索关键词
  icon: 'icon-name',                   // Lucide图标名称
  path: '/tools/tool-name'             // 路由路径，必须以/tools/开头
};
```

**重要注意事项：**
- `path` 必须以 `/tools/` 开头，否则会导致404错误
- `id` 必须与目录名保持一致
- `category` 必须是已存在的分类ID

## 国际化配置

### 翻译文件位置
所有翻译内容添加到 `src/i18n/translations.ts`

### 翻译结构
```typescript
export const translations = {
  en: {
    tools: {
      toolName: {
        name: 'Tool Name',
        title: 'Tool Title',
        description: 'Tool description',
        // 工具特定的翻译键
        inputLabel: 'Input Label',
        outputLabel: 'Output Label',
        validateButton: 'Validate',
        // 错误和成功消息
        errors: {
          invalidInput: 'Invalid input provided',
          processingFailed: 'Processing failed'
        },
        results: {
          valid: 'Valid',
          invalid: 'Invalid',
          summary: 'Validation Summary'
        }
      }
    }
  },
  zh: {
    tools: {
      toolName: {
        name: '工具名称',
        title: '工具标题',
        description: '工具描述',
        // 对应的中文翻译
        inputLabel: '输入标签',
        outputLabel: '输出标签',
        validateButton: '验证',
        errors: {
          invalidInput: '提供的输入无效',
          processingFailed: '处理失败'
        },
        results: {
          valid: '有效',
          invalid: '无效',
          summary: '验证摘要'
        }
      }
    }
  }
};
```

### 翻译键命名规范
- 使用 camelCase 命名
- 按功能分组（如：errors, results, actions）
- 保持英文和中文键结构完全一致

## 工具注册

### 1. 导入工具
在 `src/registry/toolRegistry.ts` 中添加导入：

```typescript
// 导入工具组件
import { ToolNameTool } from '@/tools/tool-name/ToolNameTool';

// 导入工具元数据
import { meta as toolNameMeta } from '@/tools/tool-name/meta';
```

### 2. 注册工具
在 `tools` 数组中添加：

```typescript
export const tools: ToolMeta[] = [
  // 其他工具...
  {
    ...toolNameMeta,
    component: ToolNameTool
  }
];
```

### 3. 添加新分类（如需要）
如果工具属于新分类，需要在 `categories` 数组中添加：

```typescript
export const categories: ToolCategory[] = [
  // 现有分类...
  {
    id: 'new-category',
    name: {
      en: 'New Category',
      zh: '新分类'
    },
    icon: 'category-icon'
  }
];
```

## 代码规范摘要

### 1. 命名规范
- **文件名**：PascalCase（如：`XmlValidatorTool.tsx`）
- **组件名**：PascalCase（如：`XmlValidatorTool`）
- **目录名**：kebab-case（如：`xml-validator`）
- **变量名**：camelCase
- **常量名**：UPPER_SNAKE_CASE

### 2. 导入顺序
```typescript
// 1. React相关
import React, { useState, useCallback } from 'react';

// 2. UI组件
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// 3. 图标
import { FileText, Upload } from 'lucide-react';

// 4. Hooks
import { useToast } from '@/hooks/use-toast';
import { useI18n } from '@/hooks/useI18n';

// 5. 自定义组件
import { HomeButton } from '@/components/ui/home-button';
```

### 3. 导出规范
- 使用命名导出：`export { ComponentName }`
- 避免默认导出
- 保持与其他工具一致的导出方式

### 4. TypeScript类型
- 为所有props定义接口
- 使用严格的类型检查
- 为复杂数据结构定义类型

```typescript
interface ValidationError {
  line?: number;
  column?: number;
  message: string;
  severity: 'error' | 'warning';
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}
```

### 5. 状态管理
- 使用 `useState` 管理本地状态
- 状态命名要清晰明确
- 避免过度嵌套的状态结构

### 6. 错误处理
- 使用 `useToast` 显示错误信息
- 提供用户友好的错误消息
- 支持国际化的错误信息

## 样式规范

### 1. Tailwind CSS类名
- 使用语义化的类名组合
- 保持与现有工具一致的样式
- 响应式设计优先

### 2. 布局模式
```typescript
// 主容器
<div className="container mx-auto py-8 space-y-6">

// 头部区域
<div className="flex items-center justify-between mb-8">

// 图标容器
<div className="p-3 bg-gradient-primary rounded-xl shadow-primary">

// 网格布局
<div className="grid md:grid-cols-2 gap-6">
```

### 3. 组件样式
- 使用 shadcn/ui 组件库
- 保持一致的间距和颜色
- 支持深色模式

## 测试和验证

### 1. 功能测试
- 确保所有功能正常工作
- 测试错误处理逻辑
- 验证国际化切换

### 2. 路由测试
- 确认工具可以通过正确URL访问
- 验证导航功能正常
- 测试404错误处理

### 3. 响应式测试
- 在不同屏幕尺寸下测试
- 确保移动端体验良好
- 验证触摸交互

## 自动化测试（可选）

**注意：添加自动化测试不是必需的要求，工具开发者可以根据工具的复杂性和重要性自行决定是否添加。**

如果选择添加自动化测试，请按照以下规范：

### 测试目录结构
所有工具的测试文件应放置在 `tests/tools/` 目录下，每个工具单独一个目录：

```
tests/
└── tools/
    └── tool-name/              # 与工具目录名保持一致
        ├── README.md            # 测试说明文档
        ├── tool-name.test.ts    # 单元测试（使用Vitest）
        ├── e2e-test.ts          # 端到端测试
        ├── manual-test.js       # 手动测试脚本
        └── samples/             # 测试样例文件
            ├── sample1.ext
            └── sample2.ext
```

### 测试文件类型

#### 1. 单元测试 (`tool-name.test.ts`)
- 使用 Vitest 框架
- 测试核心功能函数
- 测试数据验证逻辑
- 测试错误处理

```typescript
import { describe, it, expect } from 'vitest';

describe('Tool Name Tests', () => {
  it('should validate input correctly', () => {
    // 测试代码
  });
});
```

#### 2. 端到端测试 (`e2e-test.ts`)
- 测试完整的功能流程
- 模拟用户操作场景
- 验证输入输出结果

#### 3. 手动测试脚本 (`manual-test.js`)
- 提供手动测试指南
- 列出测试检查清单
- 包含浏览器测试步骤

#### 4. 测试样例 (`samples/`)
- 提供各种测试用例的示例数据
- 包含有效和无效的输入样例
- 支持自动化测试和手动测试

### 测试最佳实践

1. **测试覆盖**：
   - 核心功能测试
   - 边界条件测试
   - 错误处理测试
   - 国际化功能测试

2. **测试数据**：
   - 使用真实的测试样例
   - 包含各种数据格式
   - 覆盖正常和异常情况

3. **测试文档**：
   - 每个测试目录包含 README.md
   - 说明测试目的和运行方法
   - 记录测试覆盖范围

### 运行测试

```bash
# 运行单元测试
npm test tests/tools/tool-name/tool-name.test.ts

# 运行端到端测试
node tests/tools/tool-name/e2e-test.ts

# 查看手动测试指南
node tests/tools/tool-name/manual-test.js
```

### 测试示例参考

可以参考以下现有工具的测试实现：
- `tests/tools/xml-validator/` - 复杂验证工具的测试
- `tests/tools/yaml-toml-converter/` - 转换工具的测试
- `tests/tools/mermaid-renderer/` - 渲染工具的测试

## 常见问题和解决方案

### 1. 404错误
**原因**：`meta.ts` 中的 `path` 配置错误
**解决**：确保路径以 `/tools/` 开头

### 2. 组件导入错误
**原因**：导出方式不一致
**解决**：使用命名导出，避免默认导出

### 3. 翻译不显示
**原因**：翻译键不匹配或结构错误
**解决**：检查翻译键的拼写和结构

### 4. 样式不一致
**原因**：缺少必需的页面结构元素
**解决**：参考现有工具的页面结构

## 开发流程建议

1. **规划阶段**：确定工具功能和UI设计
2. **创建目录**：按照命名规范创建工具目录
3. **实现组件**：编写主组件文件
4. **配置元数据**：创建 `meta.ts` 文件
5. **添加翻译**：在翻译文件中添加相关文本
6. **注册工具**：在工具注册中心注册
7. **测试验证**：全面测试功能和UI
8. **代码审查**：确保符合项目规范

## 参考示例

可以参考以下现有工具作为开发模板：
- `src/tools/xml-validator/` - 复杂表单和验证逻辑
- `src/tools/subnet-calculator/` - 计算类工具
- `src/tools/text-hash/` - 简单转换工具
- `src/tools/qr-generator/` - 生成器类工具

---

遵循本指南可以确保新工具与项目整体架构保持一致，提供良好的用户体验和代码可维护性。