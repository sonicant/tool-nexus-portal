import { ToolMeta } from '@/types/tool';

export const textDiffMeta: Omit<ToolMeta, 'component'> = {
  id: 'text-diff',
  name: {
    en: 'Text Diff',
    zh: '文本对比'
  },
  description: {
    en: 'Compare two text strings with visual diff highlighting',
    zh: '比较两个文本字符串并高亮显示差异'
  },
  icon: 'git-compare',
  category: 'diff',
  keywords: {
    en: ['diff', 'compare', 'text', 'difference', 'highlight'],
    zh: ['对比', '比较', '文本', '差异', '高亮']
  },
  path: '/tools/text-diff'
};