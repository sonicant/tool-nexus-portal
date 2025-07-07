import { ToolMeta } from '@/types/tool';

export const textHashMeta: Omit<ToolMeta, 'component'> = {
  id: 'text-hash',
  name: {
    en: 'Text Hash',
    zh: '文本哈希'
  },
  description: {
    en: 'Convert text to secure hash formats including MD5, SHA-1, SHA-256, Base64, and Base64URL. Perfect for password hashing, data integrity verification, and encoding tasks.',
    zh: '将文本转换为安全哈希格式，包括MD5、SHA-1、SHA-256、Base64和Base64URL。适用于密码哈希、数据完整性验证和编码任务。'
  },
  icon: 'hash',
  category: 'hash',
  keywords: {
    en: ['hash', 'md5', 'sha1', 'base64', 'encode', 'encryption'],
    zh: ['哈希', '加密', '编码', 'md5', 'sha1', 'base64']
  },
  path: '/tools/text-hash'
};