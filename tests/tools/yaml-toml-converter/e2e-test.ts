#!/usr/bin/env node

import { readFileSync } from 'fs';
import { yamlToToml, tomlToYaml } from '../../../src/tools/yaml-toml-converter/converters';
import { ConversionOptions } from '../../../src/tools/yaml-toml-converter/types';

/**
 * 端到端测试：读取样本文件并进行转换测试
 */

const samplesDir = './tests/tools/yaml-toml-converter/samples';

// 默认转换选项
const defaultOptions: ConversionOptions = {
  indentSize: 2
};

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
  const result = yamlToToml(yamlContent, defaultOptions);
  
  if (!result.success || !result.data) {
    throw new Error('转换失败');
  }
  
  // 验证结果包含预期的键值对
  if (!result.data.includes('name = "Sample Application"') ||
      !result.data.includes('enabled = true') ||
      !result.data.includes('[config]')) {
    throw new Error('转换结果不包含预期内容');
  }
});

testConversion('基础 TOML 转 YAML', () => {
  const tomlContent = readFileSync(`${samplesDir}/sample1-basic.toml`, 'utf8');
  const result = tomlToYaml(tomlContent, defaultOptions);
  
  if (!result.success || !result.data) {
    throw new Error('转换失败');
  }
  
  // 验证结果包含预期的键值对
  if (!result.data.includes('name: "Sample Application"') ||
      !result.data.includes('enabled: true') ||
      !result.data.includes('config:')) {
    throw new Error('转换结果不包含预期内容');
  }
});

// 复杂嵌套结构测试
testConversion('复杂 YAML 转 TOML', () => {
  const yamlContent = readFileSync(`${samplesDir}/sample2-complex.yaml`, 'utf8');
  const result = yamlToToml(yamlContent, defaultOptions);
  
  if (!result.success || !result.data) {
    throw new Error('转换失败');
  }
  
  // 验证结果包含预期的复杂结构
  if (!result.data.includes('[[servers]]') ||
      !result.data.includes('ip = "192.168.1.1"') ||
      !result.data.includes('[database]')) {
    throw new Error('转换结果不包含预期的复杂结构');
  }
});

testConversion('复杂 TOML 转 YAML', () => {
  const tomlContent = readFileSync(`${samplesDir}/sample2-complex.toml`, 'utf8');
  const result = tomlToYaml(tomlContent, defaultOptions);
  
  if (!result.success || !result.data) {
    throw new Error('转换失败');
  }
  
  // 验证结果包含预期的复杂结构
  if (!result.data.includes('servers:') ||
      !result.data.includes('ip: 192.168.1.1') ||
      !result.data.includes('database:')) {
    throw new Error('转换结果不包含预期的复杂结构');
  }
});

// 边缘情况测试
testConversion('边缘情况 YAML 转 TOML', () => {
  const yamlContent = readFileSync(`${samplesDir}/sample3-edge.yaml`, 'utf8');
  const result = yamlToToml(yamlContent, defaultOptions);
  
  if (!result.success || !result.data) {
    throw new Error('转换失败');
  }
  
  // 验证特殊字符和结构
  if (!result.data.includes('unicode') ||
      !result.data.includes('empty')) {
    throw new Error('转换结果不包含预期的边缘情况内容');
  }
});

testConversion('边缘情况 TOML 转 YAML', () => {
  const tomlContent = readFileSync(`${samplesDir}/sample3-edge.toml`, 'utf8');
  const result = tomlToYaml(tomlContent, defaultOptions);
  
  if (!result.success || !result.data) {
    throw new Error('转换失败');
  }
  
  // 验证特殊字符和结构
  if (!result.data.includes('unicode') ||
      !result.data.includes('empty')) {
    throw new Error('转换结果不包含预期的边缘情况内容');
  }
});

// 缩进测试
testConversion('缩进设置测试', () => {
  const yamlContent = readFileSync(`${samplesDir}/sample1-basic.yaml`, 'utf8');
  const result4spaces = tomlToYaml(yamlToToml(yamlContent, { indentSize: 4 }).data || '', { indentSize: 4 });
  const result2spaces = tomlToYaml(yamlToToml(yamlContent, { indentSize: 2 }).data || '', { indentSize: 2 });
  
  if (!result4spaces.success || !result2spaces.success) {
    throw new Error('缩进转换失败');
  }
  
  // 验证缩进差异（4空格缩进应该比2空格缩进有更多空格）
  if (!result4spaces.data?.includes('    ') || !result2spaces.data?.includes('  ')) {
    throw new Error('缩进设置未正确应用');
  }
});

// 错误处理测试
testConversion('无效 YAML 错误处理', () => {
  const invalidYaml = readFileSync(`${samplesDir}/invalid.yaml`, 'utf8');
  const result = yamlToToml(invalidYaml, defaultOptions);
  
  if (result.success) {
    throw new Error('应该检测到无效的 YAML 格式');
  }
  
  if (!result.error || !result.error.length) {
    throw new Error('应该返回错误信息');
  }
});

testConversion('无效 TOML 错误处理', () => {
  const invalidToml = readFileSync(`${samplesDir}/invalid.toml`, 'utf8');
  const result = tomlToYaml(invalidToml, defaultOptions);
  
  if (result.success) {
    throw new Error('应该检测到无效的 TOML 格式');
  }
  
  if (!result.error || !result.error.length) {
    throw new Error('应该返回错误信息');
  }
});

// 往返转换测试
testConversion('往返转换一致性', () => {
  const originalYaml = readFileSync(`${samplesDir}/sample1-basic.yaml`, 'utf8');
  
  // YAML -> TOML -> YAML
  const tomlResult = yamlToToml(originalYaml, defaultOptions);
  if (!tomlResult.success || !tomlResult.data) {
    throw new Error('YAML 转 TOML 失败');
  }
  
  const backToYamlResult = tomlToYaml(tomlResult.data, defaultOptions);
  if (!backToYamlResult.success || !backToYamlResult.data) {
    throw new Error('TOML 转回 YAML 失败');
  }
  
  // 解析并比较内容而不是字符串比较（因为格式可能略有不同）
  const originalParsed = require('js-yaml').load(originalYaml);
  const roundTripParsed = require('js-yaml').load(backToYamlResult.data);
  
  if (JSON.stringify(originalParsed) !== JSON.stringify(roundTripParsed)) {
    throw new Error('往返转换后内容不一致');
  }
});

console.log('\n🎉 所有测试已完成！');