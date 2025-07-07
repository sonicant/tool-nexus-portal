import { ToolMeta } from '@/types/tool';

export const jsonXmlConverterMeta: Omit<ToolMeta, 'component'> = {
  id: 'json-xml-converter',
  name: {
    en: 'JSON ↔ XML',
    zh: 'JSON ↔ XML'
  },
  description: {
    en: 'Convert between JSON and XML formats bidirectionally',
    zh: 'JSON和XML格式双向转换'
  },
  icon: 'arrow-right-left',
  category: 'converter',
  keywords: {
    en: ['json', 'xml', 'convert', 'transform', 'format'],
    zh: ['json', 'xml', '转换', '格式', '变换']
  },
  path: '/tools/json-xml-converter'
};