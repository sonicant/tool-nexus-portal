import { ToolMeta } from '@/types/tool';

export const subnetCalculatorMeta: Omit<ToolMeta, 'component'> = {
  id: 'subnet-calculator',
  name: {
    en: 'Subnet Calculator',
    zh: '子网计算器'
  },
  description: {
    en: 'Advanced subnet calculator supporting both CIDR notation and subnet mask formats. Calculate network ranges, broadcast addresses, host counts, and subnetting scenarios for network planning.',
    zh: '高级子网计算器，支持CIDR表示法和子网掩码格式。计算网络范围、广播地址、主机数量和网络规划的子网划分场景。'
  },
  icon: 'network',
  category: 'network',
  keywords: {
    en: ['subnet', 'network', 'cidr', 'ip', 'calculator'],
    zh: ['子网', '网络', 'cidr', 'ip', '计算器']
  },
  path: '/tools/subnet-calculator'
};