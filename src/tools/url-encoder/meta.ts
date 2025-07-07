import { ToolMeta } from '@/types/tool';

export const urlEncoderMeta: Omit<ToolMeta, 'component'> = {
  id: 'url-encoder',
  name: {
    en: 'URL Encoder/Decoder',
    zh: 'URL 编码/解码'
  },
  description: {
    en: 'Encode and decode URLs with proper percent-encoding. Handles special characters, spaces, and international characters. Includes reference guide for common URL encoding patterns.',
    zh: '使用正确的百分号编码对URL进行编码和解码。处理特殊字符、空格和国际字符。包含常见URL编码模式的参考指南。'
  },
  icon: 'link',
  category: 'hash',
  keywords: {
    en: ['url', 'encode', 'decode', 'percent', 'escape'],
    zh: ['url', '编码', '解码', '转义', '百分号']
  },
  path: '/tools/url-encoder'
};