// YAML/TOML 转换工具的类型定义

export interface ConversionResult {
  success: boolean;
  data?: string;
  error?: string;
}

export interface ConversionOptions {
  indentSize: number;
  preserveComments?: boolean;
  sortKeys?: boolean;
}

export type ConversionDirection = 'yaml-to-toml' | 'toml-to-yaml';

export interface ParsedYamlContent {
  [key: string]: unknown;
}

export interface ParsedTomlContent {
  [key: string]: unknown;
}
