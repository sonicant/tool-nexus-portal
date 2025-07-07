import { ToolMeta } from '@/types/tool';

export const qrGeneratorMeta: Omit<ToolMeta, 'component'> = {
  id: 'qr-generator',
  name: {
    en: 'QR Code Generator',
    zh: '二维码生成器'
  },
  description: {
    en: 'Generate QR codes from text or URLs with customizable colors and error correction',
    zh: '从文本或URL生成二维码，支持自定义颜色和错误纠正级别'
  },
  icon: 'qr-code',
  category: 'generator',
  keywords: {
    en: ['qr', 'qrcode', 'barcode', 'generate', 'url', 'text', 'code'],
    zh: ['二维码', '条码', '生成', '网址', '文本', '代码']
  },
  path: '/tools/qr-generator'
};