import { ToolMeta } from '@/types/tool';

export const textHashMeta: Omit<ToolMeta, 'component'> = {
  id: 'text-hash',
  name: {
    en: 'Text Hash',
    zh: '文本哈希'
  },
  description: {
    en: 'Convert text to various hash algorithms (MD5, SHA1, Base64, etc.)',
    zh: '将文本转换为各种哈希算法（MD5、SHA1、Base64等）'
  },
  icon: 'hash',
  category: 'hash',
  keywords: {
    en: ['hash', 'md5', 'sha1', 'base64', 'encode', 'encryption'],
    zh: ['哈希', '加密', '编码', 'md5', 'sha1', 'base64']
  },
  path: '/tools/text-hash'
};