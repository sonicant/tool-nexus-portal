import { lazy } from 'react';
import { ToolMeta, ToolCategory } from '@/types/tool';

// Lazy load tool components for better performance
const TextHashTool = lazy(() => import('@/tools/text-hash/TextHashTool').then(module => ({ default: module.TextHashTool })));
const UuidGeneratorTool = lazy(() => import('@/tools/uuid-generator/UuidGeneratorTool').then(module => ({ default: module.UuidGeneratorTool })));
const TextDiffTool = lazy(() => import('@/tools/text-diff/TextDiffTool').then(module => ({ default: module.TextDiffTool })));
const JsonDiffTool = lazy(() => import('@/tools/json-diff/JsonDiffTool').then(module => ({ default: module.JsonDiffTool })));
const JsonXmlConverterTool = lazy(() => import('@/tools/json-xml-converter/JsonXmlConverterTool').then(module => ({ default: module.JsonXmlConverterTool })));
const UrlEncoderTool = lazy(() => import('@/tools/url-encoder/UrlEncoderTool').then(module => ({ default: module.UrlEncoderTool })));
const SubnetCalculatorTool = lazy(() => import('@/tools/subnet-calculator/SubnetCalculatorTool').then(module => ({ default: module.SubnetCalculatorTool })));
const QrGeneratorTool = lazy(() => import('@/tools/qr-generator/QrGeneratorTool').then(module => ({ default: module.QrGeneratorTool })));
const YamlTomlConverterTool = lazy(() => import('@/tools/yaml-toml-converter/YamlTomlConverterTool').then(module => ({ default: module.YamlTomlConverterTool })));
const DnsQueryTool = lazy(() => import('@/tools/dns-query/DnsQueryTool').then(module => ({ default: module.DnsQueryTool })));
const XmlValidatorTool = lazy(() => import('@/tools/xml-validator/XmlValidatorTool').then(module => ({ default: module.XmlValidatorTool })));
const MermaidRendererTool = lazy(() => import('@/tools/mermaid-renderer/MermaidRendererTool').then(module => ({ default: module.MermaidRendererTool })));
const HttpRequestBuilderTool = lazy(() => import('@/tools/http-request-builder/HttpRequestBuilderTool'));
const TimestampConverterTool = lazy(() => import('@/tools/timestamp-converter/TimestampConverterTool').then(module => ({ default: module.TimestampConverterTool })));
const RegexTesterTool = lazy(() => import('@/tools/regex-tester/RegexTesterTool').then(module => ({ default: module.RegexTesterTool })));
const PcapAnalyzerTool = lazy(() => import('@/tools/pcap-analyzer/PcapAnalyzerTool'));

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
import { timestampConverterMeta } from '@/tools/timestamp-converter/meta';
import { regexTesterMeta } from '@/tools/regex-tester/meta';
import { meta as pcapAnalyzerMeta } from '@/tools/pcap-analyzer/meta';

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
  },
  {
    ...timestampConverterMeta,
    component: TimestampConverterTool
  },
  {
    ...regexTesterMeta,
    component: RegexTesterTool
  },
  {
    ...pcapAnalyzerMeta,
    component: PcapAnalyzerTool
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