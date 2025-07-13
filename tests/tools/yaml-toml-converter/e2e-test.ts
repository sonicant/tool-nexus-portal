#!/usr/bin/env node

import { readFileSync } from 'fs';
import { yamlToToml, tomlToYaml } from '../../../src/tools/yaml-toml-converter/converters';

/**
 * 端到端测试：读取样本文件并进行转换测试
 */

const samplesDir = './tests/tools/yaml-toml-converter/samples';

// 测试辅助函数
const testConversion = (description: string, testFn: () => void) => {
  console.log(`\n🧪 测试: ${description}`);
  try {
    testFn();
    console.log('✅ 通过');
  } catch (error) {
    console.log('❌ 失败:', error.message);
  }
};

// 基础转换测试
testConversion('基础 YAML 转 TOML', () => {
  const yamlContent = readFileSync(`${samplesDir}/sample1-basic.yaml`, 'utf8');
  const result = yamlToToml(yamlContent, { indentSize: 2 });
  
  // 验证结果包含预期的键值对
  if (!result.success || !result.data || 
      !result.data.includes('name = "Sample Application"') ||
      !result.data.includes('enabled = true') ||
      !result.data.includes('[config]')) {
    throw new Error('转换结果不包含预期内容');
  }
});

testConversion('基础 TOML 转 YAML', () => {
  const tomlContent = readFileSync(`${samplesDir}/sample1-basic.toml`, 'utf8');
  const result = tomlToYaml(tomlContent, { indentSize: 2 });
  
  // 验证结果包含预期的键值对
  if (!result.success || !result.data ||
      !result.data.includes('name: "Sample Application"') ||
      !result.data.includes('enabled: true') ||
      !result.data.includes('config:')) {
    throw new Error('转换结果不包含预期内容');
  }
});

// 复杂嵌套结构测试
testConversion('复杂 YAML 转 TOML', () => {
  const yamlContent = readFileSync(`${samplesDir}/sample2-complex.yaml`, 'utf8');
  const result = yamlToToml(yamlContent, { indentSize: 2 });
  
  // 验证结果包含预期的嵌套结构
  if (!result.success || !result.data ||
      !result.data.includes('[database]') ||
      !result.data.includes('[[database.servers]]') ||
      !result.data.includes('[clients]')) {
    throw new Error('转换结果不包含预期的嵌套结构');
  }
});

testConversion('复杂 TOML 转 YAML', () => {
  const tomlContent = readFileSync(`${samplesDir}/sample2-complex.toml`, 'utf8');
  const result = tomlToYaml(tomlContent, { indentSize: 2 });
  
  // 验证结果包含预期的嵌套结构
  if (!result.success || !result.data ||
      !result.data.includes('database:') ||
      !result.data.includes('servers:') ||
      !result.data.includes('clients:')) {
    throw new Error('转换结果不包含预期的嵌套结构');
  }
});

// 边界情况测试
testConversion('边界情况 YAML 转 TOML', () => {
  const yamlContent = readFileSync(`${samplesDir}/sample3-edge.yaml`, 'utf8');
  const result = yamlToToml(yamlContent, { indentSize: 2 });
  
  // 验证特殊字符和Unicode处理
  if (!result.success || !result.data ||
      !result.data.includes('unicode = "こんにちは"') ||
      !result.data.includes('[numbers]')) {
    throw new Error('边界情况转换失败');
  }
});

testConversion('边界情况 TOML 转 YAML', () => {
  const tomlContent = readFileSync(`${samplesDir}/sample3-edge.toml`, 'utf8');
  const result = tomlToYaml(tomlContent, { indentSize: 2 });
  
  // 验证特殊字符和Unicode处理
  if (!result.success || !result.data ||
      !result.data.includes('unicode: "こんにちは"') ||
      !result.data.includes('numbers:')) {
    throw new Error('边界情况转换失败');
  }
});

// 缩进测试
testConversion('不同缩进大小测试', () => {
  const yamlContent = 'config:\n  debug: true';
  
  const result2 = tomlToYaml('config.debug = true', { indentSize: 2 });
  const result4 = tomlToYaml('config.debug = true', { indentSize: 4 });
  
  // 验证不同缩进
  if (!result2.success || !result4.success || !result2.data || !result4.data ||
      !result2.data.includes('  debug:') || !result4.data.includes('    debug:')) {
    throw new Error('缩进设置未正确应用');
  }
});

// 错误处理测试
testConversion('无效 YAML 错误处理', () => {
  const invalidYaml = readFileSync(`${samplesDir}/invalid.yaml`, 'utf8');
  
  const result = yamlToToml(invalidYaml, { indentSize: 2 });
  if (result.success || !result.error) {
    throw new Error('应该返回错误结果但没有');
  }
});

testConversion('无效 TOML 错误处理', () => {
  const invalidToml = readFileSync(`${samplesDir}/invalid.toml`, 'utf8');
  
  const result = tomlToYaml(invalidToml, { indentSize: 2 });
  if (result.success || !result.error) {
    throw new Error('应该返回错误结果但没有');
  }
});

// 往返转换测试（Round-trip conversion）
testConversion('往返转换一致性测试', () => {
  const originalYaml = readFileSync(`${samplesDir}/sample1-basic.yaml`, 'utf8');
  
  // YAML -> TOML -> YAML
  const tomlResult = yamlToToml(originalYaml, { indentSize: 2 });
  if (!tomlResult.success || !tomlResult.data) {
    throw new Error('YAML 转 TOML 失败');
  }
  
  const backToYaml = tomlToYaml(tomlResult.data, { indentSize: 2 });
  if (!backToYaml.success || !backToYaml.data) {
    throw new Error('TOML 转 YAML 失败');
  }
  
  // 解析两个YAML文档并比较内容（忽略格式差异）
  const yaml = require('js-yaml');
  const originalParsed = yaml.load(originalYaml);
  const roundTripParsed = yaml.load(backToYaml.data);
  
  if (JSON.stringify(originalParsed) !== JSON.stringify(roundTripParsed)) {
    throw new Error('往返转换后数据不一致');
  }
});

console.log('\n🎉 所有端到端测试完成！');