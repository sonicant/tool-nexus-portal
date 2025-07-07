import { ToolMeta } from '@/types/tool';

export const subnetCalculatorMeta: Omit<ToolMeta, 'component'> = {
  id: 'subnet-calculator',
  name: {
    en: 'Subnet Calculator',
    zh: '子网计算器'
  },
  description: {
    en: 'Calculate network subnets, CIDR, and IP ranges',
    zh: '计算网络子网、CIDR和IP范围'
  },
  icon: 'network',
  category: 'network',
  keywords: {
    en: ['subnet', 'network', 'cidr', 'ip', 'calculator'],
    zh: ['子网', '网络', 'cidr', 'ip', '计算器']
  },
  path: '/tools/subnet-calculator'
};