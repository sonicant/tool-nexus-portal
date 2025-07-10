#!/usr/bin/env node

/**
 * XML验证工具手动测试脚本
 * 用于在开发过程中快速验证工具功能
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 颜色输出函数
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  title: (msg) => console.log(`\n${colors.cyan}${msg}${colors.reset}`),
  separator: () => console.log(`${colors.magenta}${'='.repeat(60)}${colors.reset}`)
};

// 测试文件路径
const samplesDir = path.join(__dirname, 'samples');

// 读取测试文件
const readTestFile = (filename) => {
  try {
    const filePath = path.join(samplesDir, filename);
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    log.error(`无法读取文件 ${filename}: ${error.message}`);
    return null;
  }
};

// 显示文件内容
const showFileContent = (filename, maxLines = 10) => {
  const content = readTestFile(filename);
  if (!content) return;
  
  const lines = content.split('\n');
  const displayLines = lines.slice(0, maxLines);
  
  console.log(`\n📄 ${filename} (前${maxLines}行):`);
  console.log(`${colors.yellow}${'─'.repeat(50)}${colors.reset}`);
  displayLines.forEach((line, index) => {
    console.log(`${colors.cyan}${(index + 1).toString().padStart(3)}${colors.reset} | ${line}`);
  });
  
  if (lines.length > maxLines) {
    console.log(`${colors.yellow}... (还有${lines.length - maxLines}行)${colors.reset}`);
  }
  console.log(`${colors.yellow}${'─'.repeat(50)}${colors.reset}`);
};

// 验证XML格式的简单函数
const validateXmlFormat = (xmlContent, filename) => {
  if (!xmlContent) {
    log.error(`${filename}: 文件内容为空`);
    return false;
  }
  
  // 基本的XML格式检查
  if (!xmlContent.includes('<?xml')) {
    log.warning(`${filename}: 缺少XML声明`);
  }
  
  // 检查基本的标签匹配
  const openTags = xmlContent.match(/<[^/][^>]*[^/]>/g) || [];
  const closeTags = xmlContent.match(/<\/[^>]*>/g) || [];
  const selfClosingTags = xmlContent.match(/<[^>]*\/>/g) || [];
  
  const openTagNames = openTags.map(tag => {
    const match = tag.match(/<([^\s>]+)/);
    return match ? match[1] : '';
  }).filter(name => name);
  
  const closeTagNames = closeTags.map(tag => {
    const match = tag.match(/<\/([^>]+)>/);
    return match ? match[1] : '';
  }).filter(name => name);
  
  log.info(`${filename}: 开放标签 ${openTagNames.length}个, 闭合标签 ${closeTagNames.length}个, 自闭合标签 ${selfClosingTags.length}个`);
  
  // 简单的平衡检查
  if (openTagNames.length !== closeTagNames.length) {
    log.error(`${filename}: 标签不平衡`);
    return false;
  }
  
  log.success(`${filename}: 基本格式检查通过`);
  return true;
};

// 验证XSD格式的简单函数
const validateXsdFormat = (xsdContent, filename) => {
  if (!xsdContent) {
    log.error(`${filename}: 文件内容为空`);
    return false;
  }
  
  // 检查是否包含schema元素
  if (!xsdContent.includes('schema')) {
    log.error(`${filename}: 不包含schema元素`);
    return false;
  }
  
  // 检查命名空间
  if (!xsdContent.includes('XMLSchema')) {
    log.error(`${filename}: 缺少XMLSchema命名空间`);
    return false;
  }
  
  log.success(`${filename}: 基本XSD格式检查通过`);
  return true;
};

// 主测试函数
const runManualTests = () => {
  log.separator();
  log.title('🧪 XML验证工具手动测试');
  log.separator();
  
  // 测试文件列表
  const testFiles = [
    { name: 'valid-basic.xml', type: 'xml', description: '基础有效XML' },
    { name: 'valid-basic.xsd', type: 'xsd', description: '基础有效XSD' },
    { name: 'valid-complex.xml', type: 'xml', description: '复杂有效XML' },
    { name: 'valid-complex.xsd', type: 'xsd', description: '复杂有效XSD' },
    { name: 'invalid.xml', type: 'xml', description: '无效XML（应该检测到错误）' },
    { name: 'invalid.xsd', type: 'xsd', description: '无效XSD（应该检测到错误）' },
    { name: 'special-chars.xml', type: 'xml', description: '特殊字符XML' },
    { name: 'large.xml', type: 'xml', description: '大文件XML（性能测试）' }
  ];
  
  // 检查测试文件是否存在
  log.title('📋 检查测试文件');
  testFiles.forEach(file => {
    const filePath = path.join(samplesDir, file.name);
    if (fs.existsSync(filePath)) {
      log.success(`${file.name} - ${file.description}`);
    } else {
      log.error(`${file.name} - 文件不存在`);
    }
  });
  
  // 显示文件内容
  log.title('📄 文件内容预览');
  testFiles.forEach(file => {
    if (fs.existsSync(path.join(samplesDir, file.name))) {
      showFileContent(file.name, 8);
    }
  });
  
  // 执行基本验证测试
  log.title('🔍 基本格式验证测试');
  testFiles.forEach(file => {
    const content = readTestFile(file.name);
    if (content) {
      if (file.type === 'xml') {
        validateXmlFormat(content, file.name);
      } else if (file.type === 'xsd') {
        validateXsdFormat(content, file.name);
      }
    }
  });
  
  // 文件大小统计
  log.title('📊 文件统计信息');
  testFiles.forEach(file => {
    const filePath = path.join(samplesDir, file.name);
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      const sizeKB = (stats.size / 1024).toFixed(2);
      log.info(`${file.name}: ${sizeKB} KB`);
    }
  });
  
  // 测试建议
  log.title('💡 测试建议');
  console.log('\n1. 在浏览器中打开XML验证工具页面');
  console.log('2. 复制上述测试文件内容到工具中进行验证');
  console.log('3. 验证以下功能:');
  console.log('   - 语法高亮显示');
  console.log('   - 行号显示');
  console.log('   - 错误检测和定位');
  console.log('   - XSD验证功能');
  console.log('   - 文件上传功能');
  console.log('4. 检查错误消息是否准确和友好');
  console.log('5. 测试大文件的处理性能');
  
  log.title('🎯 预期结果');
  console.log('\n✅ 有效文件应该通过验证');
  console.log('❌ 无效文件应该显示具体错误信息');
  console.log('📍 错误应该包含行号和列号信息');
  console.log('🎨 XML内容应该有语法高亮');
  console.log('📏 应该显示行号');
  console.log('⚡ 大文件处理应该在合理时间内完成');
  
  log.separator();
  log.success('手动测试指南生成完成！');
  log.info('请按照上述指南在浏览器中测试XML验证工具');
  log.separator();
};

// 如果直接运行此脚本，则执行测试
if (import.meta.url === `file://${process.argv[1]}`) {
    runManualTests();
}