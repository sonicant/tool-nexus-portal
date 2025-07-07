import { ToolMeta } from '@/types/tool';

export const textDiffMeta: Omit<ToolMeta, 'component'> = {
  id: 'text-diff',
  name: {
    en: 'Text Diff',
    zh: '文本对比'
  },
  description: {
    en: 'Compare two text documents side-by-side with detailed visual highlighting of additions, removals, and modifications. Perfect for code reviews, document comparison, and content analysis.',
    zh: '并排比较两个文本文档，详细视觉高亮显示添加、删除和修改内容。适用于代码审查、文档比较和内容分析。'
  },
  icon: 'git-compare',
  category: 'diff',
  keywords: {
    en: ['diff', 'compare', 'text', 'difference', 'highlight'],
    zh: ['对比', '比较', '文本', '差异', '高亮']
  },
  path: '/tools/text-diff'
};