import { Translations } from '@/types/tool';

export const translations: Translations = {
  en: {
    common: {
      title: 'IT Tool Nexus',
      subtitle: 'Professional IT Tools Collection',
      description: 'Modern, powerful, and easy-to-use IT tools for developers and system administrators',
      toggleTheme: 'Toggle theme',
      toggleLanguage: 'Toggle language',
      copy: 'Copy',
      paste: 'Paste',
      clear: 'Clear',
      reset: 'Reset',
      generate: 'Generate',
      convert: 'Convert',
      compare: 'Compare',
      calculate: 'Calculate',
      encode: 'Encode',
      decode: 'Decode',
      input: 'Input',
      output: 'Output',
      result: 'Result',
      github: 'View on GitHub'
    },
    categories: {
      hash: 'Hash & Encoding',
      generator: 'Generators',
      converter: 'Converters',
      diff: 'Comparison Tools',
      network: 'Network Tools'
    },
    tools: {
      textHash: {
        name: 'Text Hash',
        description: 'Convert text to various hash algorithms (MD5, SHA1, Base64, etc.)',
        placeholder: 'Enter text to hash...'
      },
      uuidGenerator: {
        name: 'UUID Generator',
        description: 'Generate UUIDs with different versions (v1, v4) and quantities',
        generateMultiple: 'Generate Multiple',
        version: 'Version',
        quantity: 'Quantity'
      },
      textDiff: {
        name: 'Text Diff',
        description: 'Compare two text strings with visual diff highlighting',
        original: 'Original Text',
        modified: 'Modified Text'
      },
      jsonDiff: {
        name: 'JSON Diff',
        description: 'Compare JSON objects with structured difference highlighting',
        originalJson: 'Original JSON',
        modifiedJson: 'Modified JSON'
      },
      jsonXmlConverter: {
        name: 'JSON ↔ XML',
        description: 'Convert between JSON and XML formats bidirectionally',
        jsonToXml: 'JSON to XML',
        xmlToJson: 'XML to JSON'
      },
      urlEncoder: {
        name: 'URL Encoder/Decoder',
        description: 'Encode and decode URLs with proper formatting',
        urlToEncode: 'URL to Encode',
        urlToDecode: 'URL to Decode'
      },
      subnetCalculator: {
        name: 'Subnet Calculator',
        description: 'Calculate network subnets, CIDR, and IP ranges',
        ipAddress: 'IP Address',
        subnetMask: 'Subnet Mask',
        cidrNotation: 'CIDR Notation'
      }
    }
  },
  zh: {
    common: {
      title: 'IT 工具集',
      subtitle: '专业 IT 工具集合',
      description: '现代化、强大且易于使用的开发者和系统管理员工具',
      toggleTheme: '切换主题',
      toggleLanguage: '切换语言',
      copy: '复制',
      paste: '粘贴',
      clear: '清空',
      reset: '重置',
      generate: '生成',
      convert: '转换',
      compare: '比较',
      calculate: '计算',
      encode: '编码',
      decode: '解码',
      input: '输入',
      output: '输出',
      result: '结果',
      github: '在 GitHub 上查看'
    },
    categories: {
      hash: '哈希与编码',
      generator: '生成器',
      converter: '转换器',
      diff: '对比工具',
      network: '网络工具'
    },
    tools: {
      textHash: {
        name: '文本哈希',
        description: '将文本转换为各种哈希算法（MD5、SHA1、Base64等）',
        placeholder: '输入要哈希的文本...'
      },
      uuidGenerator: {
        name: 'UUID 生成器',
        description: '生成不同版本（v1、v4）和数量的UUID',
        generateMultiple: '批量生成',
        version: '版本',
        quantity: '数量'
      },
      textDiff: {
        name: '文本对比',
        description: '比较两个文本字符串并高亮显示差异',
        original: '原始文本',
        modified: '修改后文本'
      },
      jsonDiff: {
        name: 'JSON 对比',
        description: '比较JSON对象并显示结构化差异',
        originalJson: '原始 JSON',
        modifiedJson: '修改后 JSON'
      },
      jsonXmlConverter: {
        name: 'JSON ↔ XML',
        description: 'JSON和XML格式双向转换',
        jsonToXml: 'JSON 转 XML',
        xmlToJson: 'XML 转 JSON'
      },
      urlEncoder: {
        name: 'URL 编码/解码',
        description: '正确格式化编码和解码URL',
        urlToEncode: '待编码URL',
        urlToDecode: '待解码URL'
      },
      subnetCalculator: {
        name: '子网计算器',
        description: '计算网络子网、CIDR和IP范围',
        ipAddress: 'IP 地址',
        subnetMask: '子网掩码',
        cidrNotation: 'CIDR 表示法'
      }
    }
  }
};