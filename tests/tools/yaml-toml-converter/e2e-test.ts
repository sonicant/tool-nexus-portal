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
  const result = yamlToToml(yamlContent, 2);
  
  // 验证结果包含预期的键值对
  if (!result.includes('name = "Sample Application"') ||
      !result.includes('enabled = true') ||
      !result.includes('[config]')) {
    throw new Error('转换结果不包含预期内容');
  }
});

testConversion('基础 TOML 转 YAML', () => {
  const tomlContent = readFileSync(`${samplesDir}/sample1-basic.toml`, 'utf8');
  const result = tomlToYaml(tomlContent, 2);
  
  // 验证结果包含预期的键值对
  if (!result.includes('name: "Sample Application"') ||
      !result.includes('enabled: true') ||
      !result.includes('config:')) {
    throw new Error('转换结果不包含预期内容');
  }
});

// 复杂嵌套结构测试
testConversion('复杂 YAML 转 TOML', () => {
  const yamlContent = readFileSync(`${samplesDir}/sample2-complex.yaml`, 'utf8');
  const result = yamlToToml(yamlContent, 2);
  
  // 验证结果包含预期的嵌套结构
  if (!result.includes('[database]') ||
      !result.includes('[[database.servers]]') ||
      !result.includes('[clients]')) {
    throw new Error('转换结果不包含预期的嵌套结构');
  }
});

testConversion('复杂 TOML 转 YAML', () => {
  const tomlContent = readFileSync(`${samplesDir}/sample2-complex.toml`, 'utf8');
  const result = tomlToYaml(tomlContent, 2);
  
  // 验证结果包含预期的嵌套结构
  if (!result.includes('database:') ||
      !result.includes('servers:') ||
      !result.includes('clients:')) {
    throw new Error('转换结果不包含预期的嵌套结构');
  }
});

// 边界情况测试
testConversion('边界情况 YAML 转 TOML', () => {
  const yamlContent = readFileSync(`${samplesDir}/sample3-edge.yaml`, 'utf8');
  const result = yamlToToml(yamlContent, 2);
  
  // 验证特殊字符和Unicode处理
  if (!result.includes('unicode = "こんにちは"') ||
      !result.includes('[numbers]')) {
    throw new Error('边界情况转换失败');
  }
});

testConversion('边界情况 TOML 转 YAML', () => {
  const tomlContent = readFileSync(`${samplesDir}/sample3-edge.toml`, 'utf8');
  const result = tomlToYaml(tomlContent, 2);
  
  // 验证特殊字符和Unicode处理
  if (!result.includes('unicode: "こんにちは"') ||
      !result.includes('numbers:')) {
    throw new Error('边界情况转换失败');
  }
});

// 缩进测试
testConversion('不同缩进大小测试', () => {
  const yamlContent = 'config:\n  debug: true';
  
  const result2 = tomlToYaml('config.debug = true', 2);
  const result4 = tomlToYaml('config.debug = true', 4);
  
  // 验证不同缩进
  if (!result2.includes('  debug:') || !result4.includes('    debug:')) {
    throw new Error('缩进设置未正确应用');
  }
});

// 错误处理测试
testConversion('无效 YAML 错误处理', () => {
  const invalidYaml = readFileSync(`${samplesDir}/invalid.yaml`, 'utf8');
  
  try {
    yamlToToml(invalidYaml, 2);
    throw new Error('应该抛出错误但没有');
  } catch (error) {
    if (error.message !== 'Invalid YAML format') {
      throw new Error(`预期错误消息 'Invalid YAML format', 实际得到: ${error.message}`);
    }
  }
});

testConversion('无效 TOML 错误处理', () => {
  const invalidToml = readFileSync(`${samplesDir}/invalid.toml`, 'utf8');
  
  try {
    tomlToYaml(invalidToml, 2);
    throw new Error('应该抛出错误但没有');
  } catch (error) {
    if (error.message !== 'Invalid TOML format') {
      throw new Error(`预期错误消息 'Invalid TOML format', 实际得到: ${error.message}`);
    }
  }
});

// 往返转换测试（Round-trip conversion）
testConversion('往返转换一致性测试', () => {
  const originalYaml = readFileSync(`${samplesDir}/sample1-basic.yaml`, 'utf8');
  
  // YAML -> TOML -> YAML
  const tomlResult = yamlToToml(originalYaml, 2);
  const backToYaml = tomlToYaml(tomlResult, 2);
  
  // 解析两个YAML文档并比较内容（忽略格式差异）
  const yaml = require('js-yaml');
  const originalParsed = yaml.load(originalYaml);
  const roundTripParsed = yaml.load(backToYaml);
  
  if (JSON.stringify(originalParsed) !== JSON.stringify(roundTripParsed)) {
    throw new Error('往返转换后数据不一致');
  }
});

console.log('\n🎉 所有端到端测试完成！');
