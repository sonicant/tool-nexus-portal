# HTTP Request Builder - Test Suite

这是 HTTP Request Builder 工具的完整测试套件，包含单元测试、端到端测试、手动测试和测试样本。

## 目录结构

```
tests/tools/http-request-builder/
├── README.md                    # 测试套件说明文档
├── http-request-builder.test.ts # 单元测试
├── e2e-test.ts                  # 端到端测试
├── manual-test.js               # 手动测试脚本
└── samples/                     # 测试样本文件
    ├── get-request.json         # GET 请求样本
    ├── post-request.json        # POST 请求样本
    ├── xml-request.json         # XML 请求样本
    └── custom-content-type.json # 自定义内容类型样本
```

## 测试类型

### 1. 单元测试 (http-request-builder.test.ts)

测试工具的核心功能模块：

- **HTTP 请求发送** (`sendHttpRequest`)
  - 不同 HTTP 方法 (GET, POST, PUT, DELETE)
  - 请求头处理
  - 请求体处理
  - 错误处理

- **响应格式化** (`formatResponseBody`)
  - JSON 格式化和语法高亮
  - XML 格式化和语法高亮
  - HTML/CSS/JavaScript 格式化
  - 纯文本处理
  - 错误处理

- **工具函数**
  - ID 生成 (`generateId`)
  - 默认请求头创建 (`createDefaultHeader`)
  - 常用请求头获取 (`getCommonHeaders`)
  - HTTP 状态码描述 (`getStatusDescription`)
  - 文件大小格式化 (`formatFileSize`)
  - 响应时间格式化 (`formatResponseTime`)

### 2. 端到端测试 (e2e-test.ts)

模拟真实使用场景的集成测试：

- **基础请求功能**
  - GET/POST/PUT/DELETE 请求
  - 自定义请求头
  - 不同内容类型 (JSON, XML, 纯文本)

- **响应处理**
  - 成功响应格式化
  - 错误响应处理
  - 大型响应处理

- **错误场景**
  - 网络错误
  - 无效 JSON
  - 服务器错误

### 3. 手动测试 (manual-test.js)

提供完整的手动测试检查清单：

- **基础功能测试**
  - 请求方法选择
  - URL 输入和验证
  - 请求头管理
  - 请求体编辑

- **响应处理测试**
  - JSON/XML 格式化
  - 语法高亮
  - 错误显示
  - 响应指标

- **数据持久化测试**
  - 历史记录
  - 预设管理
  - 数据清理

- **用户界面测试**
  - 标签页导航
  - 加载状态
  - 表单验证
  - 响应式设计

### 4. 测试样本 (samples/)

提供各种类型的请求样本：

- **get-request.json**: 基础 GET 请求
- **post-request.json**: 带 JSON 体的 POST 请求
- **xml-request.json**: XML/SOAP 请求
- **custom-content-type.json**: 自定义内容类型请求

## 运行测试

### 单元测试

```bash
# 运行所有单元测试
npm test

# 运行特定工具的测试
npm test -- --testPathPattern=http-request-builder

# 监视模式运行测试
npm test -- --watch
```

### 端到端测试

```bash
# 运行端到端测试
node tests/tools/http-request-builder/e2e-test.ts
```

### 手动测试

```bash
# 显示手动测试清单
node tests/tools/http-request-builder/manual-test.js
```

## 测试覆盖率

当前测试覆盖以下功能：

- ✅ HTTP 请求发送 (所有方法)
- ✅ 请求头管理
- ✅ 请求体处理 (JSON, XML, 表单, 纯文本)
- ✅ 响应格式化和语法高亮
- ✅ 错误处理和显示
- ✅ 工具函数
- ✅ 用户界面交互
- ✅ 数据持久化

## 测试数据

测试使用以下公共 API：

- **JSONPlaceholder** (`https://jsonplaceholder.typicode.com`)
  - 用于基础 GET/POST 请求测试
  - 返回标准 JSON 响应

- **HTTPBin** (`https://httpbin.org`)
  - 用于各种 HTTP 方法测试
  - 支持自定义请求头和内容类型
  - 提供详细的请求回显

## 最佳实践

1. **测试隔离**: 每个测试用例独立运行，不依赖其他测试
2. **模拟网络**: 单元测试使用 Mock，端到端测试使用真实 API
3. **错误覆盖**: 测试正常流程和各种错误场景
4. **数据验证**: 验证请求格式和响应处理的正确性
5. **用户体验**: 手动测试关注实际用户交互体验

## 贡献指南

添加新测试时请遵循：

1. 在相应的测试文件中添加测试用例
2. 更新测试样本文件（如需要）
3. 更新手动测试清单（如有新功能）
4. 确保所有测试通过
5. 更新此 README 文档

## 问题报告

如果发现测试问题或需要添加新的测试场景，请：

1. 检查现有测试覆盖范围
2. 创建复现问题的最小测试用例
3. 提供详细的错误信息和环境信息
4. 建议修复方案（如有）