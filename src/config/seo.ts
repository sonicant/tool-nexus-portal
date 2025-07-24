// SEO配置文件
export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  author: string;
  siteUrl: string;
  siteName: string;
  twitterHandle?: string;
  defaultImage: string;
  language: string;
}

export interface ToolSEOConfig {
  title: string;
  description: string;
  keywords: string[];
  category: string;
}

// 默认SEO配置
export const defaultSEOConfig: SEOConfig = {
  title: 'Tool Nexus Portal - Professional Developer Tools Collection',
  description: 'Tool Nexus Portal is a comprehensive collection of professional developer tools including regex tester, JSON/XML converter, timestamp converter, UUID generator, text diff, and more. Boost your development productivity with our modern, powerful, and easy-to-use online tools.',
  keywords: ['developer tools', 'online tools', 'regex tester', 'JSON converter', 'XML converter', 'timestamp converter', 'UUID generator', 'text diff', 'productivity tools', '开发者工具', '在线工具'],
  author: 'Tool Nexus Portal',
  siteUrl: 'https://tool-nexus-portal.lovable.app',
  siteName: 'Tool Nexus Portal',
  defaultImage: '/placeholder.svg',
  language: 'en'
};

// 工具页面SEO配置
export const toolSEOConfigs: Record<string, ToolSEOConfig> = {
  'regex-tester': {
    title: 'Regex Tester - Regular Expression Testing Tool',
    description: 'Powerful online regular expression testing tool with real-time matching, capture group display, and multiple flag settings. Perfect for developers to quickly validate and debug regex patterns.',
    keywords: ['regex tester', 'regular expression', 'pattern matching', 'string matching', 'regex debugging', '正则表达式', '正则测试'],
    category: 'Text Processing'
  },
  'json-xml-converter': {
    title: 'JSON XML Converter - Bidirectional Data Format Converter',
    description: 'Online JSON to XML and XML to JSON converter with formatting, syntax validation, and error checking. Perfect for data format transformation and API development.',
    keywords: ['JSON converter', 'XML converter', 'data format conversion', 'JSON formatting', 'XML formatting', 'JSON转换', 'XML转换'],
    category: 'Data Conversion'
  },
  'timestamp-converter': {
    title: 'Timestamp Converter - Unix Timestamp to Date Converter',
    description: 'Professional timestamp conversion tool supporting bidirectional conversion between Unix timestamps and standard date formats with timezone support and multiple format options.',
    keywords: ['timestamp converter', 'unix timestamp', 'date converter', 'time format conversion', 'timezone converter', '时间戳转换', '日期转换'],
    category: 'Time Tools'
  },
  'uuid-generator': {
    title: 'UUID Generator - Unique Identifier Generator',
    description: 'Online UUID generator supporting multiple versions (v1, v4) with batch generation capabilities. Perfect for system development and unique identifier creation.',
    keywords: ['UUID generator', 'unique identifier', 'GUID generator', 'random ID', 'system identifier', 'UUID生成', '唯一标识符'],
    category: 'Generator Tools'
  },
  'text-diff': {
    title: 'Text Diff Tool - Text Comparison and Difference Checker',
    description: 'Efficient text difference comparison tool with line-by-line comparison, highlighted differences, and export capabilities. Perfect for code review and document comparison.',
    keywords: ['text diff', 'text comparison', 'file comparison', 'difference checker', 'code comparison', '文本对比', '代码对比'],
    category: 'Text Processing'
  },
  'text-hash': {
    title: 'Text Hash Generator - Multi-Algorithm Hash Calculator',
    description: 'Multi-algorithm text hash calculation tool supporting MD5, SHA1, SHA256, and more hash algorithms for data integrity verification and security.',
    keywords: ['hash generator', 'MD5', 'SHA1', 'SHA256', 'data verification', 'text encryption', '哈希计算', '数据校验'],
    category: 'Encryption Tools'
  },
  'url-encoder': {
    title: 'URL Encoder Decoder - URL and Base64 Encoding Tool',
    description: 'Professional URL encoding and decoding tool supporting URL encoding, decoding, Base64 encoding, and various character encoding formats.',
    keywords: ['URL encoder', 'URL decoder', 'Base64 encoding', 'character encoding', 'percent encoding', 'URL编码', '字符编码'],
    category: 'Encoding Tools'
  },
  'qr-generator': {
    title: 'QR Code Generator - Create QR Codes Online',
    description: 'Online QR code generator supporting text, URLs, contacts, and various content types with customizable size and error correction levels.',
    keywords: ['QR code generator', 'QR code', 'barcode generator', 'QR code maker', 'mobile scanning', '二维码生成', 'QR码'],
    category: 'Generator Tools'
  },
  'yaml-toml-converter': {
    title: 'YAML TOML Converter - Configuration File Format Converter',
    description: 'Configuration file format conversion tool supporting bidirectional conversion between YAML and TOML formats for efficient configuration management.',
    keywords: ['YAML converter', 'TOML converter', 'config file conversion', 'data format', 'configuration management', 'YAML转换', '配置文件转换'],
    category: 'Data Conversion'
  },
  'xml-validator': {
    title: 'XML Validator - XML Document Validation Tool',
    description: 'Professional XML document validation tool with syntax checking, formatting, and structure validation to ensure XML document correctness.',
    keywords: ['XML validator', 'XML formatting', 'XML syntax checker', 'XML parser', 'document validation', 'XML验证', 'XML格式化'],
    category: 'Validation Tools'
  },
  'subnet-calculator': {
    title: 'Subnet Calculator - Network Subnet and CIDR Calculator',
    description: 'Network subnet calculation tool supporting CIDR calculation, IP address range calculation, and subnet division for network planning.',
    keywords: ['subnet calculator', 'CIDR calculator', 'IP address calculator', 'network planning', 'subnet division', '子网计算', '网络规划'],
    category: 'Network Tools'
  },
  'dns-query': {
    title: 'DNS Query Tool - Domain Name System Lookup',
    description: 'Online DNS query tool supporting A, AAAA, MX, CNAME, and other record types for domain name resolution and network diagnostics.',
    keywords: ['DNS query', 'domain resolution', 'DNS records', 'network diagnostics', 'domain tools', 'DNS查询', '域名解析'],
    category: 'Network Tools'
  },
  'http-request-builder': {
    title: 'HTTP Request Builder - API Testing and REST Client Tool',
    description: 'Powerful HTTP request testing tool supporting GET, POST, and other methods with custom headers and parameters. Essential for API testing and development.',
    keywords: ['HTTP request', 'API testing', 'REST testing', 'HTTP client', 'API client', 'HTTP请求', 'API测试'],
    category: 'Development Tools'
  },
  'json-diff': {
    title: 'JSON Diff Tool - JSON Data Comparison and Analysis',
    description: 'Professional JSON data comparison tool with deep comparison, structured difference display, and formatted output for enhanced data analysis.',
    keywords: ['JSON diff', 'JSON comparison', 'data comparison', 'JSON analysis', 'structure comparison', 'JSON对比', '数据对比'],
    category: 'Data Analysis'
  },
  'mermaid-renderer': {
    title: 'Mermaid Diagram Renderer - Flowchart and Diagram Generator',
    description: 'Online Mermaid diagram generation tool supporting flowcharts, sequence diagrams, Gantt charts, and more visualization types for design and documentation.',
    keywords: ['Mermaid diagram', 'flowchart', 'sequence diagram', 'Gantt chart', 'diagram generator', 'visualization', 'Mermaid图表', '流程图'],
    category: 'Visualization Tools'
  },
  'pcap-analyzer': {
    title: 'PCAP Analyzer - Network Packet Analysis Tool',
    description: 'Network packet analysis tool supporting PCAP file parsing, protocol analysis, and traffic statistics for network debugging and security analysis.',
    keywords: ['PCAP analyzer', 'packet analysis', 'network analysis', 'protocol analysis', 'traffic analysis', 'PCAP分析', '网络分析'],
    category: 'Network Tools'
  }
};

// 生成工具页面的完整SEO配置
export function getToolSEO(toolId: string): {
  title: string;
  description: string;
  keywords: string[];
  fullTitle: string;
} {
  const toolConfig = toolSEOConfigs[toolId];
  if (!toolConfig) {
    return {
      title: defaultSEOConfig.title,
      description: defaultSEOConfig.description,
      keywords: defaultSEOConfig.keywords,
      fullTitle: defaultSEOConfig.title
    };
  }

  return {
    title: toolConfig.title,
    description: toolConfig.description,
    keywords: [...toolConfig.keywords, ...defaultSEOConfig.keywords],
    fullTitle: `${toolConfig.title} | ${defaultSEOConfig.siteName}`
  };
}

// 生成结构化数据
export function generateStructuredData(toolId?: string) {
  const baseData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: defaultSEOConfig.siteName,
    description: defaultSEOConfig.description,
    url: defaultSEOConfig.siteUrl,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    permissions: 'browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    author: {
      '@type': 'Organization',
      name: defaultSEOConfig.author
    }
  };

  if (toolId && toolSEOConfigs[toolId]) {
    const toolConfig = toolSEOConfigs[toolId];
    return {
      ...baseData,
      '@type': 'SoftwareApplication',
      name: toolConfig.title,
      description: toolConfig.description,
      url: `${defaultSEOConfig.siteUrl}/tools/${toolId}`,
      applicationSubCategory: toolConfig.category,
      featureList: toolConfig.keywords
    };
  }

  return baseData;
}