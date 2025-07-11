import { ToolMeta } from '@/types/tool';

export const meta: Omit<ToolMeta, 'component'> = {
  id: 'pcap-analyzer',
  name: {
    en: 'Network Packet Analyzer',
    zh: '网络数据包分析器'
  },
  description: {
    en: 'Upload and analyze PCAP files to visualize network packet structures, headers, and payload data with BPF filtering support for network debugging.',
    zh: '上传和分析PCAP文件，可视化网络数据包结构、头部和载荷数据，支持BPF过滤器进行网络调试。'
  },
  icon: 'network',
  category: 'network',
  keywords: {
    en: ['pcap', 'network', 'packet', 'analyzer', 'wireshark', 'tcpdump', 'protocol', 'bpf', 'filter', 'debug'],
    zh: ['pcap', '网络', '数据包', '分析器', 'wireshark', 'tcpdump', '协议', 'bpf', '过滤器', '调试']
  },
  path: '/tools/pcap-analyzer'
};