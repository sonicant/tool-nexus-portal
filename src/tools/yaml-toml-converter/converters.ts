import yaml from 'js-yaml';
import toml from '@iarna/toml';

/**
 * 将 YAML 字符串转换为 TOML 格式
 * @param input - 输入的 YAML 字符串
 * @param indent - 缩进大小（默认为 2）
 * @returns 转换后的 TOML 字符串
 * @throws Error - 当输入的 YAML 格式无效时抛出 'Invalid YAML format' 错误
 */
export const yamlToToml = (input: string, indent = 2): string => {
  try {
    const parsedYaml = yaml.load(input);
    return toml.stringify(parsedYaml);
  } catch (error) {
    throw new Error('Invalid YAML format');
  }
};

/**
 * 将 TOML 字符串转换为 YAML 格式
 * @param input - 输入的 TOML 字符串
 * @param indent - 缩进大小（默认为 2）
 * @returns 转换后的 YAML 字符串
 * @throws Error - 当输入的 TOML 格式无效时抛出 'Invalid TOML format' 错误
 */
export const tomlToYaml = (input: string, indent = 2): string => {
  try {
    const parsedToml = toml.parse(input);
    return yaml.dump(parsedToml, { indent: indent });
  } catch (error) {
    throw new Error('Invalid TOML format');
  }
};
