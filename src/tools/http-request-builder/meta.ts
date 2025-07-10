import { ToolMeta } from '@/types/tool';

export const httpRequestBuilderMeta: Omit<ToolMeta, 'component'> = {
  id: 'http-request-builder',
  name: {
    en: 'HTTP Request Builder',
    zh: 'HTTP请求构建器'
  },
  description: {
    en: 'A lightweight Postman-like tool for constructing and sending HTTP requests with response formatting and syntax highlighting.',
    zh: '轻量级的类Postman工具，用于构建和发送HTTP请求，支持响应格式化和语法高亮。'
  },
  icon: 'send',
  category: 'network',
  keywords: {
    en: ['http', 'request', 'api', 'rest', 'postman', 'client'],
    zh: ['http', '请求', 'api', 'rest', 'postman', '客户端']
  },
  path: '/tools/http-request-builder'
};