# XML验证工具测试套件

本目录包含XML验证工具的完整测试套件，包括单元测试、端到端测试和手动测试。

## 📁 目录结构

```
tests/tools/xml-validator/
├── README.md              # 测试说明文档
├── validator.test.ts      # 单元测试
├── e2e-test.ts           # 端到端测试
├── manual-test.js        # 手动测试脚本
└── samples/              # 测试样本数据
    ├── valid-basic.xml   # 基础有效XML
    ├── valid-basic.xsd   # 基础有效XSD
    ├── valid-complex.xml # 复杂有效XML
    ├── valid-complex.xsd # 复杂有效XSD
    ├── invalid.xml       # 无效XML
    ├── invalid.xsd       # 无效XSD
    ├── special-chars.xml # 特殊字符XML
    └── large.xml         # 大文件XML
```

## 🧪 测试类型

### 1. 单元测试 (validatorTests.ts)

测试XML验证工具的核心功能：
- XML结构验证
- XSD结构验证
- XML解析错误检测
- 边界情况处理

**运行方式：**
```bash
# 使用Vitest运行单元测试
npx vitest tests/tools/xml-validator/validator.test.ts --run
```

### 2. 端到端测试 (e2e-test.ts)

测试完整的验证流程：
- 基础XML/XSD验证
- 复杂XML/XSD验证
- 错误检测能力
- 性能测试

**运行方式：**
```bash
# 直接运行端到端测试
node tests/tools/xml-validator/e2e-test.ts

# 或使用ts-node
npx ts-node tests/tools/xml-validator/e2e-test.ts
```

### 3. 手动测试 (manual-test.js)

提供手动测试指南和工具：
- 显示测试文件内容
- 基本格式验证
- 测试建议和预期结果

**运行方式：**
```bash
node tests/tools/xml-validator/manual-test.js
```

## 📋 测试用例说明

### 有效测试用例

1. **valid-basic.xml/xsd**
   - 简单的人员信息XML和对应的XSD
   - 测试基础验证功能

2. **valid-complex.xml/xsd**
   - 复杂的公司组织结构XML和对应的XSD
   - 测试嵌套结构、属性、数组等复杂场景

3. **special-chars.xml**
   - 包含中文、表情符号、特殊字符的XML
   - 测试Unicode和特殊字符处理

4. **large.xml**
   - 大型XML文件（用于性能测试）
   - 测试工具处理大文件的能力

### 无效测试用例

1. **invalid.xml**
   - 包含未闭合标签的无效XML
   - 测试错误检测和定位功能

2. **invalid.xsd**
   - 不符合XSD格式的文件
   - 测试XSD格式验证

## 🎯 测试覆盖范围

### 功能测试
- ✅ XML语法验证
- ✅ XSD格式验证
- ✅ XSD验证功能
- ✅ 错误检测和定位
- ✅ 语法高亮显示
- ✅ 行号显示
- ✅ 文件上传功能

### 边界情况测试
- ✅ 空内容处理
- ✅ 特殊字符处理
- ✅ 大文件处理
- ✅ 格式错误处理
- ✅ 编码问题处理

### 性能测试
- ✅ 大文件解析性能
- ✅ 复杂结构验证性能
- ✅ 内存使用情况

## 🚀 快速开始

1. **运行所有测试：**
```bash
# 单元测试
npx vitest tests/tools/xml-validator/validator.test.ts --run

# 端到端测试
node tests/tools/xml-validator/e2e-test.ts

# 手动测试指南
node tests/tools/xml-validator/manual-test.js
```

2. **在浏览器中手动测试：**
```bash
# 启动开发服务器
npm run dev

# 打开浏览器访问
http://localhost:8080/tools/xml-validator

# 使用samples目录中的测试文件进行验证
```

## 📊 预期测试结果

### 有效文件验证
- 应该通过所有验证检查
- 显示成功消息
- 语法高亮正常显示
- 行号正确显示

### 无效文件验证
- 应该检测到具体错误
- 显示错误位置（行号、列号）
- 提供友好的错误消息
- 错误信息应该准确和有用

### 性能要求
- 小文件（<10KB）：< 100ms
- 中等文件（10KB-100KB）：< 500ms
- 大文件（>100KB）：< 2000ms

## 🔧 测试环境要求

- Node.js >= 16
- npm >= 8
- 现代浏览器（支持ES6+）
- Vitest（用于单元测试）

## 📝 添加新测试

1. **添加新的测试用例：**
   - 在`samples/`目录中添加新的XML/XSD文件
   - 更新测试文件中的测试用例

2. **扩展测试功能：**
   - 在`validator.test.ts`中添加新的单元测试
   - 在`e2e-test.ts`中添加新的端到端测试

3. **更新文档：**
   - 更新本README文件
   - 添加新测试用例的说明

## 🐛 故障排除

### 常见问题

1. **测试文件找不到**
   - 确保在项目根目录运行测试
   - 检查文件路径是否正确

2. **DOMParser未定义**
   - 在Node.js环境中需要模拟DOMParser
   - 检查测试环境配置

3. **编码问题**
   - 确保测试文件使用UTF-8编码
   - 检查特殊字符是否正确显示

### 调试技巧

1. **启用详细日志：**
```bash
DEBUG=1 node tests/tools/xml-validator/e2e-test.ts
```

2. **单独运行特定测试：**
```bash
# 只运行XML结构测试
npm test -- --grep "XML Structure"
```

3. **查看测试文件内容：**
```bash
node -e "console.log(require('fs').readFileSync('tests/tools/xml-validator/samples/valid-basic.xml', 'utf8'))"
```

## 📞 支持

如果遇到测试相关问题，请：
1. 检查本文档的故障排除部分
2. 查看测试输出的错误信息
3. 确认测试环境配置正确
4. 提交issue并附上详细的错误信息