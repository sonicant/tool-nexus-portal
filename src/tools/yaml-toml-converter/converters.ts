import yaml from 'js-yaml';
import TOML from '@ltd/j-toml';
import { ConversionResult, ConversionOptions } from './types';

/**
 * 将 YAML 字符串转换为 TOML 格式
 * @param input - 输入的 YAML 字符串
 * @param options - 转换选项，包括 indentSize
 * @returns ConversionResult 对象，包含 success、data 或 error
 */
export const yamlToToml = (input: string, options: ConversionOptions): ConversionResult => {
  try {
    const parsedYaml = yaml.load(input);
    const data = TOML.stringify(parsedYaml as any, {
      newline: '\n',
      indent: options.indentSize,
      integer: Number.MAX_SAFE_INTEGER,
    });
    return { success: true, data };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid YAML format';
    return { success: false, error: message };
  }
};

/**
 * 将 TOML 字符串转换为 YAML 格式
 * @param input - 输入的 TOML 字符串
 * @param options - 转换选项，包括 indentSize
 * @returns ConversionResult 对象，包含 success、data 或 error
 */
export const tomlToYaml = (input: string, options: ConversionOptions): ConversionResult => {
  try {
    // @ts-ignore
    const parsedToml = TOML.parse(input, {
      joiner: '\n',
      bigint: false,
    });
    const data = yaml.dump(parsedToml, { indent: options.indentSize });
    return { success: true, data };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid TOML format';
    return { success: false, error: message };
  }
};
