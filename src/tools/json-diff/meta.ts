import { ToolMeta } from '@/types/tool';

export const jsonDiffMeta: Omit<ToolMeta, 'component'> = {
  id: 'json-diff',
  name: {
    en: 'JSON Diff',
    zh: 'JSON 对比'
  },
  description: {
    en: 'Compare JSON objects with structured difference highlighting',
    zh: '比较JSON对象并显示结构化差异'
  },
  icon: 'git-compare',
  category: 'diff',
  keywords: {
    en: ['json', 'diff', 'compare', 'object', 'structure'],
    zh: ['json', '对比', '比较', '对象', '结构']
  },
  path: '/tools/json-diff'
};