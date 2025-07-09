import yaml from 'js-yaml';
import toml from '@iarna/toml';
import { ConversionOptions, ConversionResult } from './types';

/**
 * 将 YAML 字符串转换为 TOML 格式
 */
export const yamlToToml = (input: string, options: ConversionOptions): ConversionResult => {
  try {
    const parsedYaml = yaml.load(input);
    if (parsedYaml === null || parsedYaml === undefined) {
      return { success: false, error: 'Invalid YAML format' };
    }
    const result = toml.stringify(parsedYaml as Record<string, any>);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: 'Invalid YAML format' };
  }
};

/**
 * 将 TOML 字符串转换为 YAML 格式
 */
export const tomlToYaml = (input: string, options: ConversionOptions): ConversionResult => {
  try {
    const parsedToml = toml.parse(input);
    const result = yaml.dump(parsedToml, { indent: options.indentSize });
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: 'Invalid TOML format' };
  }
};
