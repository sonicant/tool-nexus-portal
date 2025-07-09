import { ToolMeta } from '@/types/tool';

export const dnsQueryMeta: Omit<ToolMeta, 'component'> = {
  id: 'dns-query',
  name: {
    en: 'DNS Query Tool',
    zh: 'DNS 查询工具'
  },
  description: {
    en: 'Query DNS records using DoH (DNS over HTTPS). Support A/AAAA/MX/TXT records with multiple providers like Google, Cloudflare, and Quad9.',
    zh: '使用 DoH（DNS over HTTPS）查询 DNS 记录。支持 A/AAAA/MX/TXT 记录，提供 Google、Cloudflare、Quad9 等多个服务商选择。'
  },
  icon: 'globe',
  category: 'network',
  keywords: {
    en: ['dns', 'query', 'doh', 'domain', 'network', 'resolve'],
    zh: ['dns', '查询', 'doh', '域名', '网络', '解析']
  },
  path: '/tools/dns-query'
};