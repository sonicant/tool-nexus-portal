import { ToolMeta } from '@/types/tool';

export const regexTesterMeta: Omit<ToolMeta, 'component'> = {
  id: 'regex-tester',
  name: {
    en: 'Regex Tester',
    zh: '正则表达式测试器'
  },
  description: {
    en: 'Test and validate regular expressions with real-time matching, group capture, and detailed explanations. Perfect for pattern development and debugging.',
    zh: '测试和验证正则表达式，支持实时匹配、分组捕获和详细说明。适用于模式开发和调试。'
  },
  icon: 'search',
  category: 'data-processing',
  keywords: {
    en: ['regex', 'regular expression', 'pattern', 'match', 'test', 'validation'],
    zh: ['正则表达式', '模式', '匹配', '测试', '验证', '正则']
  },
  path: '/tools/regex-tester'
};