import { ToolMeta } from '@/types/tool';

export const jsonDiffMeta: Omit<ToolMeta, 'component'> = {
  id: 'json-diff',
  name: {
    en: 'JSON Diff',
    zh: 'JSON 对比'
  },
  description: {
    en: 'Compare JSON objects with intelligent structural analysis. Handles nested objects, arrays, and different key orders. Shows detailed change tracking with path-based diff visualization.',
    zh: '使用智能结构分析比较JSON对象。处理嵌套对象、数组和不同的键顺序。显示基于路径的详细变更跟踪和差异可视化。'
  },
  icon: 'git-compare',
  category: 'diff',
  keywords: {
    en: ['json', 'diff', 'compare', 'object', 'structure'],
    zh: ['json', '对比', '比较', '对象', '结构']
  },
  path: '/tools/json-diff'
};