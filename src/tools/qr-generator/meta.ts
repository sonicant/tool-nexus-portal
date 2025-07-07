import { ToolMeta } from '@/types/tool';

export const qrGeneratorMeta: Omit<ToolMeta, 'component'> = {
  id: 'qr-generator',
  name: {
    en: 'QR Code Generator',
    zh: '二维码生成器'
  },
  description: {
    en: 'Generate customizable QR codes from text, URLs, or any data. Features adjustable error correction levels, color customization, and high-resolution output for printing and digital use.',
    zh: '从文本、URL或任何数据生成可自定义的二维码。具有可调节的错误纠正级别、颜色自定义和高分辨率输出，适用于打印和数字使用。'
  },
  icon: 'qr-code',
  category: 'generator',
  keywords: {
    en: ['qr', 'qrcode', 'barcode', 'generate', 'url', 'text', 'code'],
    zh: ['二维码', '条码', '生成', '网址', '文本', '代码']
  },
  path: '/tools/qr-generator'
};