// Unit tests for YAML to TOML and TOML to YAML converters
import { yamlToToml, tomlToYaml } from '../../../src/tools/yaml-toml-converter/converters';
import { ConversionOptions } from '../../../src/tools/yaml-toml-converter/types';

// Mock inputs
const yamlSample = `
name: "Sample"
age: 25
active: true
items:
  - item1
  - item2
`;

const tomlSample = `
name = "Sample"
age = 25
active = true
items = ["item1", "item2"]
`;

const yamlComplex = `
complex_array:
  - name: "alpha"
    children:
      - id: 1
      - id: 2
  - name: "beta"
    children:
      - id: 3
`;

const tomlComplex = `
[[complex_array]]
name = "alpha"
[[complex_array.children]]
id = 1
[[complex_array.children]]
id = 2

[[complex_array]]
name = "beta"
[[complex_array.children]]
id = 3
`;

// Default options for testing
const defaultOptions: ConversionOptions = {
  indentSize: 2
};

// Unit tests
const runTests = () => {
  console.log('Running YAML to TOML tests...');
  try {
    const convertedToToml = yamlToToml(yamlSample, defaultOptions);
    console.assert(convertedToToml.success && convertedToToml.data?.trim() === tomlSample.trim(), 'Basic YAML to TOML conversion failed');
  } catch (e) {
    console.error('YAML to TOML test failed with error:', e);
  }

  console.log('Running TOML to YAML tests...');
  try {
    const convertedToYaml = tomlToYaml(tomlSample, defaultOptions);
    console.assert(convertedToYaml.success && convertedToYaml.data?.trim() === yamlSample.trim(), 'Basic TOML to YAML conversion failed');
  } catch (e) {
    console.error('TOML to YAML test failed with error:', e);
  }

  console.log('Running complex YAML to TOML test...');
  try {
    const complexToToml = yamlToToml(yamlComplex, defaultOptions);
    console.assert(complexToToml.success && complexToToml.data?.trim() === tomlComplex.trim(), 'Complex YAML to TOML conversion failed');
  } catch (e) {
    console.error('Complex YAML to TOML test failed with error:', e);
  }

  console.log('Running complex TOML to YAML test...');
  try {
    const complexToYaml = tomlToYaml(tomlComplex, defaultOptions);
    console.assert(complexToYaml.success && complexToYaml.data?.trim() === yamlComplex.trim(), 'Complex TOML to YAML conversion failed');
  } catch (e) {
    console.error('Complex TOML to YAML test failed with error:', e);
  }

  console.log('All tests completed.');
};

runTests();
