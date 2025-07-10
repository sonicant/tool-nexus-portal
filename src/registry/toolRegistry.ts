import { ToolMeta, ToolCategory } from '@/types/tool';

// Import tool components
import { TextHashTool } from '@/tools/text-hash/TextHashTool';
import { UuidGeneratorTool } from '@/tools/uuid-generator/UuidGeneratorTool';
import { TextDiffTool } from '@/tools/text-diff/TextDiffTool';
import { JsonDiffTool } from '@/tools/json-diff/JsonDiffTool';
import { JsonXmlConverterTool } from '@/tools/json-xml-converter/JsonXmlConverterTool';
import { UrlEncoderTool } from '@/tools/url-encoder/UrlEncoderTool';
import { SubnetCalculatorTool } from '@/tools/subnet-calculator/SubnetCalculatorTool';
import { QrGeneratorTool } from '@/tools/qr-generator/QrGeneratorTool';
import { YamlTomlConverterTool } from '@/tools/yaml-toml-converter/YamlTomlConverterTool';
import { DnsQueryTool } from '@/tools/dns-query/DnsQueryTool';
import { XmlValidatorTool } from '@/tools/xml-validator/XmlValidatorTool';
import { MermaidRendererTool } from '@/tools/mermaid-renderer/MermaidRendererTool';
import HttpRequestBuilderTool from '@/tools/http-request-builder/HttpRequestBuilderTool';

// Import tool metadata
import { textHashMeta } from '@/tools/text-hash/meta';
import { uuidGeneratorMeta } from '@/tools/uuid-generator/meta';
import { textDiffMeta } from '@/tools/text-diff/meta';
import { jsonDiffMeta } from '@/tools/json-diff/meta';
import { jsonXmlConverterMeta } from '@/tools/json-xml-converter/meta';
import { urlEncoderMeta } from '@/tools/url-encoder/meta';
import { subnetCalculatorMeta } from '@/tools/subnet-calculator/meta';
import { qrGeneratorMeta } from '@/tools/qr-generator/meta';
import { yamlTomlConverterMeta } from '@/tools/yaml-toml-converter/meta';
import { dnsQueryMeta } from '@/tools/dns-query/meta';
import { meta as xmlValidatorMeta } from '@/tools/xml-validator/meta';
import { mermaidRendererMeta } from '@/tools/mermaid-renderer/meta';
import { httpRequestBuilderMeta } from '@/tools/http-request-builder/meta';

export const categories: ToolCategory[] = [
  {
    id: 'hash',
    name: {
      en: 'Hash & Encoding',
      zh: '哈希与编码'
    },
    icon: 'hash'
  },
  {
    id: 'generator',
    name: {
      en: 'Generators',
      zh: '生成器'
    },
    icon: 'cog'
  },
  {
    id: 'converter',
    name: {
      en: 'Converters',
      zh: '转换器'
    },
    icon: 'arrow-right-left'
  },
  {
    id: 'diff',
    name: {
      en: 'Comparison Tools',
      zh: '对比工具'
    },
    icon: 'git-compare'
  },
  {
    id: 'network',
    name: {
      en: 'Network Tools',
      zh: '网络工具'
    },
    icon: 'network'
  },
  {
    id: 'data-processing',
    name: {
      en: 'Data Processing',
      zh: '数据处理'
    },
    icon: 'database'
  },
  {
    id: 'visualization',
    name: {
      en: 'Visualization',
      zh: '可视化'
    },
    icon: 'chart-line'
  }
];

export const tools: ToolMeta[] = [
  {
    ...textHashMeta,
    component: TextHashTool
  },
  {
    ...uuidGeneratorMeta,
    component: UuidGeneratorTool
  },
  {
    ...textDiffMeta,
    component: TextDiffTool
  },
  {
    ...jsonDiffMeta,
    component: JsonDiffTool
  },
  {
    ...jsonXmlConverterMeta,
    component: JsonXmlConverterTool
  },
  {
    ...urlEncoderMeta,
    component: UrlEncoderTool
  },
  {
    ...yamlTomlConverterMeta,
    component: YamlTomlConverterTool
  },
  {
    ...subnetCalculatorMeta,
    component: SubnetCalculatorTool
  },
  {
    ...qrGeneratorMeta,
    component: QrGeneratorTool
  },
  {
    ...dnsQueryMeta,
    component: DnsQueryTool
  },
  {
    ...xmlValidatorMeta,
    component: XmlValidatorTool
  },
  {
    ...mermaidRendererMeta,
    component: MermaidRendererTool
  },
  {
    ...httpRequestBuilderMeta,
    component: HttpRequestBuilderTool
  }
];

export const getToolById = (id: string): ToolMeta | undefined => {
  return tools.find(tool => tool.id === id);
};

export const getToolsByCategory = (categoryId: string): ToolMeta[] => {
  return tools.filter(tool => tool.category === categoryId);
};

export const getCategoryById = (id: string): ToolCategory | undefined => {
  return categories.find(category => category.id === id);
};