import { ToolMeta } from '@/types/tool';

export const jsonXmlConverterMeta: Omit<ToolMeta, 'component'> = {
  id: 'json-xml-converter',
  name: {
    en: 'JSON ↔ XML',
    zh: 'JSON ↔ XML'
  },
  description: {
    en: 'Seamlessly convert between JSON and XML formats with syntax highlighting and customizable indentation. Preserves data types and handles complex nested structures with validation.',
    zh: '在JSON和XML格式之间无缝转换，支持语法高亮和可自定义缩进。保留数据类型并处理复杂嵌套结构，带有验证功能。'
  },
  icon: 'arrow-right-left',
  category: 'converter',
  keywords: {
    en: ['json', 'xml', 'convert', 'transform', 'format'],
    zh: ['json', 'xml', '转换', '格式', '变换']
  },
  path: '/tools/json-xml-converter'
};