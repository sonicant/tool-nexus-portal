# Mermaid渲染工具测试

本目录包含Mermaid渲染工具的完整测试套件，包括单元测试、端到端测试和手动测试。

## 目录结构

```
mermaid-renderer/
├── README.md                    # 测试说明文档
├── mermaid-renderer.test.ts     # 单元测试
├── e2e-test.ts                  # 端到端测试
├── manual-test.js               # 手动测试脚本
└── samples/                     # 测试样例文件
    ├── flowchart.mmd           # 流程图样例
    ├── sequence.mmd            # 时序图样例
    └── class.mmd               # 类图样例
```

## 测试类型说明

### 1. 单元测试 (mermaid-renderer.test.ts)

使用Vitest框架编写的单元测试，主要测试：
- Mermaid代码验证功能
- 模板数据结构验证
- Mermaid库集成测试
- 错误处理逻辑

**运行方式：**
```bash
npm test tests/tools/mermaid-renderer/mermaid-renderer.test.ts
```

### 2. 端到端测试 (e2e-test.ts)

完整的功能流程测试，包括：
- 各种图表类型的渲染测试
- 模板验证测试
- 错误处理测试
- 代码解析测试

**运行方式：**
```bash
node tests/tools/mermaid-renderer/e2e-test.ts
```

### 3. 手动测试 (manual-test.js)

提供手动测试指南，包括：
- 浏览器中的功能验证
- 用户界面测试
- 响应式设计测试
- 国际化功能测试

**运行方式：**
```bash
node tests/tools/mermaid-renderer/manual-test.js
```

## 测试样例文件

`samples/` 目录包含各种Mermaid图表类型的示例代码：

- **flowchart.mmd**: 流程图示例，展示条件分支和样式设置
- **sequence.mmd**: 时序图示例，展示多参与者交互流程
- **class.mmd**: 类图示例，展示面向对象设计关系

这些样例可用于：
- 手动测试时的输入数据
- 验证渲染效果
- 作为用户使用参考

## 测试覆盖范围

### 功能测试
- ✅ 模板选择和加载
- ✅ 代码编辑和实时预览
- ✅ 图表渲染（12种类型）
- ✅ 导出功能（SVG/PNG）
- ✅ 错误处理和用户提示

### 兼容性测试
- ✅ 多种Mermaid图表类型
- ✅ 中英文国际化
- ✅ 响应式设计
- ✅ 现代浏览器支持

### 性能测试
- ✅ 大型图表渲染性能
- ✅ 实时预览响应速度
- ✅ 内存使用优化

## 测试最佳实践

1. **运行顺序**：建议按单元测试 → 端到端测试 → 手动测试的顺序进行
2. **环境准备**：确保开发服务器运行，浏览器支持现代JavaScript特性
3. **数据验证**：使用samples目录中的示例数据进行测试
4. **错误记录**：详细记录测试过程中发现的问题和改进建议

## 贡献指南

如需添加新的测试用例：

1. **单元测试**：在`mermaid-renderer.test.ts`中添加新的测试用例
2. **端到端测试**：在`e2e-test.ts`中添加完整流程测试
3. **测试样例**：在`samples/`目录中添加新的`.mmd`文件
4. **文档更新**：更新本README文件说明新增的测试内容

## 注意事项

- 测试文件使用TypeScript编写，需要适当的类型定义
- 端到端测试使用模拟的Mermaid库，避免外部依赖
- 手动测试需要在实际浏览器环境中进行
- 所有测试都支持中英文双语环境