import { ToolMeta } from '@/types/tool';

export const urlEncoderMeta: Omit<ToolMeta, 'component'> = {
  id: 'url-encoder',
  name: {
    en: 'URL Encoder/Decoder',
    zh: 'URL 编码/解码'
  },
  description: {
    en: 'Encode and decode URLs with proper formatting',
    zh: '正确格式化编码和解码URL'
  },
  icon: 'link',
  category: 'hash',
  keywords: {
    en: ['url', 'encode', 'decode', 'percent', 'escape'],
    zh: ['url', '编码', '解码', '转义', '百分号']
  },
  path: '/tools/url-encoder'
};