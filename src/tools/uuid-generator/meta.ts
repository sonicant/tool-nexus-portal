import { ToolMeta } from '@/types/tool';

export const uuidGeneratorMeta: Omit<ToolMeta, 'component'> = {
  id: 'uuid-generator',
  name: {
    en: 'UUID Generator',
    zh: 'UUID 生成器'
  },
  description: {
    en: 'Generate universally unique identifiers (UUIDs) in bulk. Supports UUID v1 (timestamp-based) and v4 (random) formats. Essential for database keys, session tokens, and unique resource identification.',
    zh: '批量生成通用唯一标识符（UUID）。支持UUID v1（基于时间戳）和v4（随机）格式。是数据库键、会话令牌和唯一资源标识的必备工具。'
  },
  icon: 'cog',
  category: 'generator',
  keywords: {
    en: ['uuid', 'guid', 'unique', 'identifier', 'generate'],
    zh: ['uuid', '唯一标识符', '生成器', '标识']
  },
  path: '/tools/uuid-generator'
};