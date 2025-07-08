import { ToolMeta } from '@/types/tool';

export const yamlTomlConverterMeta: Omit<ToolMeta, 'component'> = {
  id: 'yaml-toml-converter',
  name: {
    en: 'YAML ↔ TOML',
    zh: 'YAML ↔ TOML'
  },
  description: {
    en: 'Convert between YAML and TOML formats with syntax highlighting and validation. Supports complex data structures, arrays, and nested objects with customizable formatting options.',
    zh: '在YAML和TOML格式之间转换，支持语法高亮和验证。支持复杂数据结构、数组和嵌套对象，提供可自定义的格式化选项。'
  },
  icon: 'arrow-right-left',
  category: 'converter',
  keywords: {
    en: ['yaml', 'toml', 'convert', 'transform', 'format', 'config'],
    zh: ['yaml', 'toml', '转换', '格式', '变换', '配置']
  },
  path: '/tools/yaml-toml-converter'
};
