import { ToolMeta } from '@/types/tool';

export const timestampConverterMeta: Omit<ToolMeta, 'component'> = {
  id: 'timestamp-converter',
  name: {
    en: 'Timestamp Converter',
    zh: '时间戳转换器'
  },
  description: {
    en: 'Convert between Unix timestamps and human-readable dates with timezone support and custom formatting options. Perfect for debugging, logging, and time-based calculations.',
    zh: '在Unix时间戳和人类可读日期之间进行转换，支持时区和自定义格式选项。适用于调试、日志记录和基于时间的计算。'
  },
  icon: 'clock',
  category: 'converter',
  keywords: {
    en: ['timestamp', 'unix', 'epoch', 'time', 'date', 'timezone', 'convert'],
    zh: ['时间戳', 'unix', 'epoch', '时间', '日期', '时区', '转换']
  },
  path: '/tools/timestamp-converter'
};