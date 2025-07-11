import { ToolMeta } from '@/types/tool';

export const meta = {
  id: 'xml-validator',
  name: {
    en: 'XML Validator',
    zh: 'XML验证器'
  },
  description: {
    en: 'Validate XML documents against XSD schemas with basic checks and detailed error reporting',
    zh: '使用XSD模式验证XML文档，提供基本的检查和详细的错误报告'
  },
  category: 'data-processing',
  keywords: {
    en: ['xml', 'xsd', 'validation', 'schema', 'document'],
    zh: ['xml', 'xsd', '验证', '模式', '文档']
  },
  icon: 'file-check',
  path: '/tools/xml-validator'
};