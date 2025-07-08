# 📏 Coding Standards

[🇨🇳 中文版本](./CODING_STANDARDS_zh.md)

This document outlines the coding standards and best practices for the Tool Nexus Portal project. Following these guidelines ensures code consistency, maintainability, and quality across the entire codebase.

## 📋 Table of Contents

- [General Principles](#general-principles)
- [TypeScript Guidelines](#typescript-guidelines)
- [React Guidelines](#react-guidelines)
- [Styling Guidelines](#styling-guidelines)
- [File Organization](#file-organization)
- [Naming Conventions](#naming-conventions)
- [Code Documentation](#code-documentation)
- [Error Handling](#error-handling)
- [Performance Guidelines](#performance-guidelines)
- [Accessibility Guidelines](#accessibility-guidelines)
- [Testing Guidelines](#testing-guidelines)
- [Git Guidelines](#git-guidelines)

## 🎯 General Principles

### Code Quality
- Write clean, readable, and maintainable code
- Follow the DRY (Don't Repeat Yourself) principle
- Keep functions and components small and focused
- Use meaningful variable and function names
- Comment complex logic and business rules
- Prefer composition over inheritance

### Consistency
- Follow existing code patterns and conventions
- Use consistent formatting and indentation
- Maintain consistent naming across the codebase
- Follow the established project structure

## 📝 TypeScript Guidelines

### Type Definitions
```typescript
// ✅ Good: Use explicit types
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

// ✅ Good: Use union types for specific values
type Theme = 'light' | 'dark';
type ToolCategory = 'converter' | 'generator' | 'utility' | 'network';

// ❌ Bad: Using 'any'
const userData: any = fetchUser();

// ✅ Good: Use proper typing
const userData: User = fetchUser();
```

### Function Signatures
```typescript
// ✅ Good: Clear function signatures
function formatDate(date: Date, format: string): string {
  // implementation
}

// ✅ Good: Use optional parameters
function createUser(name: string, email: string, role?: string): User {
  // implementation
}

// ✅ Good: Use generic types when appropriate
function processArray<T>(items: T[], processor: (item: T) => T): T[] {
  return items.map(processor);
}
```

### Type Guards
```typescript
// ✅ Good: Use type guards for runtime type checking
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

## ⚛️ React Guidelines

### Component Structure
```typescript
// ✅ Good: Functional component with proper typing
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
    // Effect logic
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
      {/* Component JSX */}
    </form>
  );
}
```

### Hooks Usage
```typescript
// ✅ Good: Custom hooks
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}
```

### Event Handlers
```typescript
// ✅ Good: Proper event handler typing
const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setInputValue(event.target.value);
};

const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  event.preventDefault();
  // Handle click
};
```

## 🎨 Styling Guidelines

### Tailwind CSS Usage
```typescript
// ✅ Good: Organized class names
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

// ✅ Good: Use CSS variables for custom values
<div className="bg-[var(--primary-color)]">

// ❌ Bad: Arbitrary values without reason
<div className="bg-[#ff6b35] text-[14.5px]">
```

### Component Styling
```typescript
// ✅ Good: Use shadcn/ui components
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

// ✅ Good: Consistent spacing and sizing
<Card className="w-full max-w-2xl">
  <CardHeader>
    <CardTitle className="text-xl font-semibold">{title}</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    {/* Content */}
  </CardContent>
</Card>
```

## 📁 File Organization

### Directory Structure
```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   └── layout/          # Layout components
├── tools/               # Tool implementations
│   └── tool-name/
│       ├── ToolName.tsx # Main component
│       ├── meta.ts      # Tool metadata
│       └── types.ts     # Tool-specific types
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── types/               # Global type definitions
├── i18n/                # Internationalization
└── registry/            # Tool registry
```

### File Naming
- **Components**: PascalCase (e.g., `JsonDiffTool.tsx`)
- **Hooks**: camelCase starting with 'use' (e.g., `useTranslation.ts`)
- **Utilities**: camelCase (e.g., `formatUtils.ts`)
- **Types**: camelCase (e.g., `toolTypes.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.ts`)

## 🏷️ Naming Conventions

### Variables and Functions
```typescript
// ✅ Good: Descriptive names
const userAccountBalance = 1000;
const isUserAuthenticated = true;
const calculateTotalPrice = (items: Item[]) => { /* */ };

// ❌ Bad: Unclear names
const bal = 1000;
const flag = true;
const calc = (items: Item[]) => { /* */ };
```

### Components
```typescript
// ✅ Good: Clear component names
export function JsonDiffTool() { /* */ }
export function QrCodeGenerator() { /* */ }
export function UserProfileCard() { /* */ }

// ❌ Bad: Vague names
export function Tool() { /* */ }
export function Generator() { /* */ }
export function Card() { /* */ }
```

### Constants
```typescript
// ✅ Good: Descriptive constants
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const API_ENDPOINTS = {
  USERS: '/api/users',
  TOOLS: '/api/tools'
} as const;

const ERROR_MESSAGES = {
  INVALID_JSON: 'Invalid JSON format',
  FILE_TOO_LARGE: 'File size exceeds limit'
} as const;
```

## 📚 Code Documentation

### JSDoc Comments
```typescript
/**
 * Calculates the difference between two JSON objects
 * @param obj1 - The first JSON object to compare
 * @param obj2 - The second JSON object to compare
 * @param options - Configuration options for the comparison
 * @returns An object containing the differences found
 * @throws {Error} When input objects are invalid
 */
function calculateJsonDiff(
  obj1: Record<string, unknown>,
  obj2: Record<string, unknown>,
  options: DiffOptions = {}
): JsonDiff {
  // Implementation
}
```

### Inline Comments
```typescript
// ✅ Good: Explain complex logic
function processUserInput(input: string): ProcessedInput {
  // Remove leading/trailing whitespace and normalize line endings
  const normalized = input.trim().replace(/\r\n/g, '\n');
  
  // Split into lines and filter out empty lines
  const lines = normalized.split('\n').filter(line => line.length > 0);
  
  return { lines, originalLength: input.length };
}

// ❌ Bad: Obvious comments
const count = 0; // Initialize count to zero
count++; // Increment count by one
```

## 🚨 Error Handling

### Error Boundaries
```typescript
// ✅ Good: Error boundary component
class ToolErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Tool error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}
```

### Error Handling in Functions
```typescript
// ✅ Good: Proper error handling
function parseJsonSafely(jsonString: string): ParseResult {
  try {
    const parsed = JSON.parse(jsonString);
    return { success: true, data: parsed };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// ✅ Good: Input validation
function validateEmail(email: string): ValidationResult {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Invalid email format' };
  }

  return { isValid: true };
}
```

## ⚡ Performance Guidelines

### React Performance
```typescript
// ✅ Good: Memoization for expensive calculations
const expensiveValue = useMemo(() => {
  return performExpensiveCalculation(data);
}, [data]);

// ✅ Good: Callback memoization
const handleClick = useCallback((id: string) => {
  onItemClick(id);
}, [onItemClick]);

// ✅ Good: Component memoization
const MemoizedComponent = React.memo(function Component({ data }: Props) {
  return <div>{data.name}</div>;
});
```

### Lazy Loading
```typescript
// ✅ Good: Lazy load heavy components
const JsonDiffTool = lazy(() => import('./tools/json-diff/JsonDiffTool'));
const QrGenerator = lazy(() => import('./tools/qr-generator/QrGenerator'));

// ✅ Good: Use Suspense for loading states
<Suspense fallback={<LoadingSpinner />}>
  <JsonDiffTool />
</Suspense>
```

## ♿ Accessibility Guidelines

### Semantic HTML
```typescript
// ✅ Good: Semantic elements
<main className="container mx-auto">
  <header>
    <h1>Tool Nexus Portal</h1>
  </header>
  <nav aria-label="Tool categories">
    <ul>
      <li><a href="#converters">Converters</a></li>
      <li><a href="#generators">Generators</a></li>
    </ul>
  </nav>
  <section aria-labelledby="tools-heading">
    <h2 id="tools-heading">Available Tools</h2>
    {/* Tools list */}
  </section>
</main>
```

### ARIA Labels
```typescript
// ✅ Good: Proper ARIA labels
<button
  aria-label="Copy result to clipboard"
  aria-describedby="copy-help-text"
  onClick={handleCopy}
>
  <CopyIcon />
</button>
<div id="copy-help-text" className="sr-only">
  Copies the generated result to your clipboard
</div>

// ✅ Good: Form accessibility
<label htmlFor="json-input" className="block text-sm font-medium">
  JSON Input
</label>
<textarea
  id="json-input"
  aria-describedby="json-input-help"
  aria-invalid={hasError}
  className="w-full p-2 border rounded"
/>
<div id="json-input-help" className="text-sm text-gray-600">
  Paste your JSON data here
</div>
```

## 🧪 Testing Guidelines

### Unit Tests
```typescript
// ✅ Good: Descriptive test names
describe('JsonDiffTool', () => {
  it('should highlight differences between two JSON objects', () => {
    const obj1 = { name: 'John', age: 30 };
    const obj2 = { name: 'Jane', age: 30 };
    
    const result = calculateJsonDiff(obj1, obj2);
    
    expect(result.differences).toHaveLength(1);
    expect(result.differences[0].path).toBe('name');
  });

  it('should handle invalid JSON gracefully', () => {
    const invalidJson = '{ invalid json }';
    
    const result = parseJsonSafely(invalidJson);
    
    expect(result.success).toBe(false);
    expect(result.error).toContain('Unexpected token');
  });
});
```

## 📝 Git Guidelines

### Commit Messages
```bash
# ✅ Good: Clear, descriptive commits
feat(tools): add QR code generator with color customization
fix(json-diff): handle null values in nested objects
docs(readme): update installation instructions
style(components): fix ESLint warnings
refactor(hooks): simplify useTranslation implementation

# ❌ Bad: Vague commits
fix bug
update stuff
working on feature
```

### Branch Naming
```bash
# ✅ Good: Descriptive branch names
feature/qr-code-generator
fix/json-diff-null-handling
docs/update-contributing-guide
refactor/simplify-tool-registry

# ❌ Bad: Unclear branch names
fix
new-feature
update
```

## 🔍 Code Review Checklist

- [ ] Code follows TypeScript best practices
- [ ] Components are properly typed
- [ ] Error handling is implemented
- [ ] Accessibility guidelines are followed
- [ ] Performance considerations are addressed
- [ ] Code is well-documented
- [ ] Tests are included (if applicable)
- [ ] Internationalization is supported
- [ ] UI is responsive and follows design patterns
- [ ] No console.log statements in production code

---

By following these coding standards, we ensure that Tool Nexus Portal maintains high code quality, remains maintainable, and provides an excellent user experience for all contributors and users.