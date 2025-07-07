import { ToolMeta } from '@/types/tool';

export const uuidGeneratorMeta: Omit<ToolMeta, 'component'> = {
  id: 'uuid-generator',
  name: {
    en: 'UUID Generator',
    zh: 'UUID 生成器'
  },
  description: {
    en: 'Generate UUIDs with different versions (v1, v4) and quantities',
    zh: '生成不同版本（v1、v4）和数量的UUID'
  },
  icon: 'cog',
  category: 'generator',
  keywords: {
    en: ['uuid', 'guid', 'unique', 'identifier', 'generate'],
    zh: ['uuid', '唯一标识符', '生成器', '标识']
  },
  path: '/tools/uuid-generator'
};