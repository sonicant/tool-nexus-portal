# 📏 编码标准

[🇺🇸 English Version](./CODING_STANDARDS.md)

本文档概述了 Tool Nexus Portal 项目的编码标准和最佳实践。遵循这些指南可确保整个代码库的代码一致性、可维护性和质量。

## 📋 目录

- [通用原则](#通用原则)
- [TypeScript 指南](#typescript-指南)
- [React 指南](#react-指南)
- [样式指南](#样式指南)
- [文件组织](#文件组织)
- [命名约定](#命名约定)
- [代码文档](#代码文档)
- [错误处理](#错误处理)
- [性能指南](#性能指南)
- [可访问性指南](#可访问性指南)
- [测试指南](#测试指南)
- [Git 指南](#git-指南)

## 🎯 通用原则

### 代码质量
- 编写清洁、可读、可维护的代码
- 遵循 DRY（不要重复自己）原则
- 保持函数和组件小而专注
- 使用有意义的变量和函数名
- 为复杂逻辑和业务规则添加注释
- 优先使用组合而非继承

### 一致性
- 遵循现有的代码模式和约定
- 使用一致的格式和缩进
- 在整个代码库中保持一致的命名
- 遵循已建立的项目结构

## 📝 TypeScript 指南

### 类型定义
```typescript
// ✅ 好：使用明确的类型
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

// ✅ 好：为特定值使用联合类型
type Theme = 'light' | 'dark';
type ToolCategory = 'converter' | 'generator' | 'utility' | 'network';

// ❌ 坏：使用 'any'
const userData: any = fetchUser();

// ✅ 好：使用适当的类型
const userData: User = fetchUser();
```

### 函数签名
```typescript
// ✅ 好：清晰的函数签名
function formatDate(date: Date, format: string): string {
  // 实现
}

// ✅ 好：使用可选参数
function createUser(name: string, email: string, role?: string): User {
  // 实现
}

// ✅ 好：适当时使用泛型类型
function processArray<T>(items: T[], processor: (item: T) => T): T[] {
  return items.map(processor);
}
```

### 类型守卫
```typescript
// ✅ 好：使用类型守卫进行运行时类型检查
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isUser(obj: unknown): obj is User {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj &&
    'email' in obj
  );
}
```

## ⚛️ React 指南

### 组件结构
```typescript
// ✅ 好：带有适当类型的函数组件
import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../hooks/useTranslation';

interface Props {
  title: string;
  onSubmit: (data: FormData) => void;
  isLoading?: boolean;
}

export function MyComponent({ title, onSubmit, isLoading = false }: Props) {
  const { t } = useTranslation();
  const [data, setData] = useState<FormData | null>(null);

  useEffect(() => {
    // Effect 逻辑
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (data) {
      onSubmit(data);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{title}</h2>
      {/* 组件 JSX */}
    </form>
  );
}
```

### Hooks 使用
```typescript
// ✅ 好：自定义 hooks
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`读取 localStorage 键 "${key}" 时出错:`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`设置 localStorage 键 "${key}" 时出错:`, error);
    }
  };

  return [storedValue, setValue] as const;
}
```

### 事件处理器
```typescript
// ✅ 好：适当的事件处理器类型
const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setInputValue(event.target.value);
};

const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  event.preventDefault();
  // 处理点击
};
```

## 🎨 样式指南

### Tailwind CSS 使用
```typescript
// ✅ 好：有组织的类名
<div className="
  flex flex-col items-center justify-center
  w-full max-w-md mx-auto
  p-6 bg-white rounded-lg shadow-md
  dark:bg-gray-800 dark:text-white
">
  <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
    {title}
  </h2>
</div>

// ✅ 好：为自定义值使用 CSS 变量
<div className="bg-[var(--primary-color)]">

// ❌ 坏：无理由的任意值
<div className="bg-[#ff6b35] text-[14.5px]">
```

### 组件样式
```typescript
// ✅ 好：使用 shadcn/ui 组件
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

// ✅ 好：一致的间距和大小
<Card className="w-full max-w-2xl">
  <CardHeader>
    <CardTitle className="text-xl font-semibold">{title}</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    {/* 内容 */}
  </CardContent>
</Card>
```

## 📁 文件组织

### 目录结构
```
src/
├── components/
│   ├── ui/              # shadcn/ui 组件
│   └── layout/          # 布局组件
├── tools/               # 工具实现
│   └── tool-name/
│       ├── ToolName.tsx # 主组件
│       ├── meta.ts      # 工具元数据
│       └── types.ts     # 工具特定类型
├── hooks/               # 自定义 React hooks
├── lib/                 # 工具函数
├── types/               # 全局类型定义
├── i18n/                # 国际化
└── registry/            # 工具注册表
```

### 文件命名
- **组件**: PascalCase (例如：`JsonDiffTool.tsx`)
- **Hooks**: 以 'use' 开头的 camelCase (例如：`useTranslation.ts`)
- **工具函数**: camelCase (例如：`formatUtils.ts`)
- **类型**: camelCase (例如：`toolTypes.ts`)
- **常量**: UPPER_SNAKE_CASE (例如：`API_ENDPOINTS.ts`)

## 🏷️ 命名约定

### 变量和函数
```typescript
// ✅ 好：描述性名称
const userAccountBalance = 1000;
const isUserAuthenticated = true;
const calculateTotalPrice = (items: Item[]) => { /* */ };

// ❌ 坏：不清楚的名称
const bal = 1000;
const flag = true;
const calc = (items: Item[]) => { /* */ };
```

### 组件
```typescript
// ✅ 好：清晰的组件名称
export function JsonDiffTool() { /* */ }
export function QrCodeGenerator() { /* */ }
export function UserProfileCard() { /* */ }

// ❌ 坏：模糊的名称
export function Tool() { /* */ }
export function Generator() { /* */ }
export function Card() { /* */ }
```

### 常量
```typescript
// ✅ 好：描述性常量
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const API_ENDPOINTS = {
  USERS: '/api/users',
  TOOLS: '/api/tools'
} as const;

const ERROR_MESSAGES = {
  INVALID_JSON: '无效的 JSON 格式',
  FILE_TOO_LARGE: '文件大小超出限制'
} as const;
```

## 📚 代码文档

### JSDoc 注释
```typescript
/**
 * 计算两个 JSON 对象之间的差异
 * @param obj1 - 要比较的第一个 JSON 对象
 * @param obj2 - 要比较的第二个 JSON 对象
 * @param options - 比较的配置选项
 * @returns 包含发现差异的对象
 * @throws {Error} 当输入对象无效时
 */
function calculateJsonDiff(
  obj1: Record<string, unknown>,
  obj2: Record<string, unknown>,
  options: DiffOptions = {}
): JsonDiff {
  // 实现
}
```

### 内联注释
```typescript
// ✅ 好：解释复杂逻辑
function processUserInput(input: string): ProcessedInput {
  // 移除前后空白并规范化行结束符
  const normalized = input.trim().replace(/\r\n/g, '\n');
  
  // 分割成行并过滤空行
  const lines = normalized.split('\n').filter(line => line.length > 0);
  
  return { lines, originalLength: input.length };
}

// ❌ 坏：显而易见的注释
const count = 0; // 将计数初始化为零
count++; // 计数加一
```

## 🚨 错误处理

### 错误边界
```typescript
// ✅ 好：错误边界组件
class ToolErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('工具错误:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}
```

### 函数中的错误处理
```typescript
// ✅ 好：适当的错误处理
function parseJsonSafely(jsonString: string): ParseResult {
  try {
    const parsed = JSON.parse(jsonString);
    return { success: true, data: parsed };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    };
  }
}

// ✅ 好：输入验证
function validateEmail(email: string): ValidationResult {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: '邮箱是必需的' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: '无效的邮箱格式' };
  }

  return { isValid: true };
}
```

## ⚡ 性能指南

### React 性能
```typescript
// ✅ 好：为昂贵计算使用记忆化
const expensiveValue = useMemo(() => {
  return performExpensiveCalculation(data);
}, [data]);

// ✅ 好：回调记忆化
const handleClick = useCallback((id: string) => {
  onItemClick(id);
}, [onItemClick]);

// ✅ 好：组件记忆化
const MemoizedComponent = React.memo(function Component({ data }: Props) {
  return <div>{data.name}</div>;
});
```

### 懒加载
```typescript
// ✅ 好：懒加载重型组件
const JsonDiffTool = lazy(() => import('./tools/json-diff/JsonDiffTool'));
const QrGenerator = lazy(() => import('./tools/qr-generator/QrGenerator'));

// ✅ 好：使用 Suspense 处理加载状态
<Suspense fallback={<LoadingSpinner />}>
  <JsonDiffTool />
</Suspense>
```

## ♿ 可访问性指南

### 语义 HTML
```typescript
// ✅ 好：语义元素
<main className="container mx-auto">
  <header>
    <h1>Tool Nexus Portal</h1>
  </header>
  <nav aria-label="工具分类">
    <ul>
      <li><a href="#converters">转换器</a></li>
      <li><a href="#generators">生成器</a></li>
    </ul>
  </nav>
  <section aria-labelledby="tools-heading">
    <h2 id="tools-heading">可用工具</h2>
    {/* 工具列表 */}
  </section>
</main>
```

### ARIA 标签
```typescript
// ✅ 好：适当的 ARIA 标签
<button
  aria-label="复制结果到剪贴板"
  aria-describedby="copy-help-text"
  onClick={handleCopy}
>
  <CopyIcon />
</button>
<div id="copy-help-text" className="sr-only">
  将生成的结果复制到您的剪贴板
</div>

// ✅ 好：表单可访问性
<label htmlFor="json-input" className="block text-sm font-medium">
  JSON 输入
</label>
<textarea
  id="json-input"
  aria-describedby="json-input-help"
  aria-invalid={hasError}
  className="w-full p-2 border rounded"
/>
<div id="json-input-help" className="text-sm text-gray-600">
  在此粘贴您的 JSON 数据
</div>
```

## 🧪 测试指南

### 单元测试
```typescript
// ✅ 好：描述性测试名称
describe('JsonDiffTool', () => {
  it('应该突出显示两个 JSON 对象之间的差异', () => {
    const obj1 = { name: 'John', age: 30 };
    const obj2 = { name: 'Jane', age: 30 };
    
    const result = calculateJsonDiff(obj1, obj2);
    
    expect(result.differences).toHaveLength(1);
    expect(result.differences[0].path).toBe('name');
  });

  it('应该优雅地处理无效 JSON', () => {
    const invalidJson = '{ invalid json }';
    
    const result = parseJsonSafely(invalidJson);
    
    expect(result.success).toBe(false);
    expect(result.error).toContain('Unexpected token');
  });
});
```

## 📝 Git 指南

### 提交消息
```bash
# ✅ 好：清晰、描述性的提交
feat(tools): add QR code generator with color customization
fix(json-diff): handle null values in nested objects
docs(readme): update installation instructions
style(components): fix ESLint warnings
refactor(hooks): simplify useTranslation implementation

# ❌ 坏：模糊的提交
fix bug
update stuff
working on feature
```

### 分支命名
```bash
# ✅ 好：描述性分支名称
feature/qr-code-generator
fix/json-diff-null-handling
docs/update-contributing-guide
refactor/simplify-tool-registry

# ❌ 坏：不清楚的分支名称
fix
new-feature
update
```

## 🔍 代码审查检查清单

- [ ] 代码遵循 TypeScript 最佳实践
- [ ] 组件类型正确
- [ ] 实现了错误处理
- [ ] 遵循可访问性指南
- [ ] 考虑了性能问题
- [ ] 代码有良好的文档
- [ ] 包含测试（如适用）
- [ ] 支持国际化
- [ ] UI 响应式并遵循设计模式
- [ ] 生产代码中没有 console.log 语句

---

通过遵循这些编码标准，我们确保 Tool Nexus Portal 保持高代码质量，保持可维护性，并为所有贡献者和用户提供出色的用户体验。