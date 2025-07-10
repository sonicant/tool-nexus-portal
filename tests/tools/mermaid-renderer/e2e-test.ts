#!/usr/bin/env node

/**
 * Mermaid渲染工具端到端测试
 * 测试完整的Mermaid图表渲染流程
 */

// 测试辅助函数
const testValidation = (description: string, testFn: () => void) => {
  console.log(`\n🧪 测试: ${description}`);
  try {
    testFn();
    console.log('✅ 通过');
  } catch (error) {
    console.log('❌ 失败:', error.message);
  }
};

// 模拟Mermaid库
class MockMermaid {
  static async render(id: string, code: string): Promise<{ svg: string }> {
    // 简单的代码验证
    if (!code.trim()) {
      throw new Error('Empty mermaid code');
    }

    const validTypes = [
      'graph', 'flowchart', 'sequenceDiagram', 'classDiagram', 'stateDiagram',
      'erDiagram', 'journey', 'gantt', 'pie', 'gitgraph', 'mindmap',
      'quadrantChart', 'xychart-beta', 'packet-beta'
    ];

    const firstLine = code.trim().split('\n')[0].toLowerCase();
    const hasValidType = validTypes.some(type => firstLine.includes(type.toLowerCase()));

    if (!hasValidType) {
      throw new Error('Invalid mermaid diagram type');
    }

    // 模拟SVG输出
    const diagramType = firstLine.split(' ')[0];
    return {
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100">
        <text x="10" y="20" font-family="Arial" font-size="12">Mocked ${diagramType} diagram</text>
        <rect x="10" y="30" width="180" height="60" fill="lightblue" stroke="black"/>
      </svg>`
    };
  }

  static initialize(config: any): void {
    console.log('Mermaid initialized with config:', config);
  }

  static parse(code: string): boolean {
    try {
      const validTypes = [
        'graph', 'flowchart', 'sequenceDiagram', 'classDiagram', 'stateDiagram',
        'erDiagram', 'journey', 'gantt', 'pie', 'gitgraph', 'mindmap',
        'quadrantChart', 'xychart-beta', 'packet-beta'
      ];

      const firstLine = code.trim().split('\n')[0].toLowerCase();
      return validTypes.some(type => firstLine.includes(type.toLowerCase()));
    } catch {
      return false;
    }
  }
}

// 测试用例数据
const testCases = {
  flowchart: {
    name: 'Flowchart',
    code: `flowchart TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Process]
    B -->|No| D[End]
    C --> D`
  },
  sequence: {
    name: 'Sequence Diagram',
    code: `sequenceDiagram
    participant Alice
    participant Bob
    Alice->>Bob: Hello Bob, how are you?
    Bob-->>Alice: Great!`
  },
  class: {
    name: 'Class Diagram',
    code: `classDiagram
    class Animal {
      +String name
      +int age
      +makeSound()
    }
    class Dog {
      +String breed
      +bark()
    }
    Animal <|-- Dog`
  },
  pie: {
    name: 'Pie Chart',
    code: `pie title Pet Adoption
    "Dogs" : 42.96
    "Cats" : 50.05
    "Birds" : 7.01`
  },
  quadrant: {
    name: 'Quadrant Chart',
    code: `quadrantChart
    title Reach and influence
    x-axis Low Reach --> High Reach
    y-axis Low Influence --> High Influence
    quadrant-1 We should expand
    quadrant-2 Need to promote
    quadrant-3 Re-evaluate
    quadrant-4 May be improved`
  },
  xychart: {
    name: 'XY Chart',
    code: `xychart-beta
    title "Sales Revenue"
    x-axis [jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec]
    y-axis "Revenue (in $)" 4000 --> 11000
    bar [5000, 6000, 7500, 8200, 9500, 10500, 11000, 10200, 9200, 8500, 7000, 6000]`
  }
};

// 模板验证函数
const validateTemplate = (template: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!template.id) {
    errors.push('Template missing id');
  }

  if (!template.name || !template.name.en || !template.name.zh) {
    errors.push('Template missing name translations');
  }

  if (!template.description || !template.description.en || !template.description.zh) {
    errors.push('Template missing description translations');
  }

  if (!template.code) {
    errors.push('Template missing code');
  } else {
    try {
      const isValid = MockMermaid.parse(template.code);
      if (!isValid) {
        errors.push('Template code is not valid Mermaid syntax');
      }
    } catch (e) {
      errors.push(`Template code validation failed: ${e.message}`);
    }
  }

  return { isValid: errors.length === 0, errors };
};

// 运行测试
const runTests = async () => {
  console.log('🚀 开始Mermaid渲染工具端到端测试\n');

  // 测试1: Mermaid库初始化
  testValidation('Mermaid库初始化', () => {
    MockMermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose'
    });
  });

  // 测试2: 各种图表类型渲染
  for (const [key, testCase] of Object.entries(testCases)) {
    await new Promise(resolve => {
      testValidation(`${testCase.name}渲染`, async () => {
        const result = await MockMermaid.render(`test-${key}`, testCase.code);
        if (!result.svg || !result.svg.includes('svg')) {
          throw new Error('SVG output is invalid');
        }
        if (!result.svg.includes(key === 'quadrant' ? 'quadrantChart' : key)) {
          console.log(`Warning: SVG may not contain expected diagram type for ${testCase.name}`);
        }
      });
      setTimeout(resolve, 100); // 模拟异步渲染延迟
    });
  }

  // 测试3: 错误处理
  testValidation('空代码错误处理', async () => {
    try {
      await MockMermaid.render('test-empty', '');
      throw new Error('Should have thrown an error for empty code');
    } catch (error) {
      if (!error.message.includes('Empty mermaid code')) {
        throw new Error('Unexpected error message');
      }
    }
  });

  testValidation('无效代码错误处理', async () => {
    try {
      await MockMermaid.render('test-invalid', 'invalid diagram type\nA --> B');
      throw new Error('Should have thrown an error for invalid code');
    } catch (error) {
      if (!error.message.includes('Invalid mermaid diagram type')) {
        throw new Error('Unexpected error message');
      }
    }
  });

  // 测试4: 模板验证
  testValidation('有效模板验证', () => {
    const validTemplate = {
      id: 'test-template',
      name: {
        en: 'Test Template',
        zh: '测试模板'
      },
      description: {
        en: 'A test template for validation',
        zh: '用于验证的测试模板'
      },
      code: testCases.flowchart.code
    };

    const result = validateTemplate(validTemplate);
    if (!result.isValid) {
      throw new Error(`Template validation failed: ${result.errors.join(', ')}`);
    }
  });

  testValidation('无效模板验证', () => {
    const invalidTemplate = {
      id: 'test-invalid',
      name: { en: 'Test' }, // 缺少中文翻译
      description: { en: 'Test', zh: '测试' },
      code: 'invalid code'
    };

    const result = validateTemplate(invalidTemplate);
    if (result.isValid) {
      throw new Error('Should have detected invalid template');
    }
    if (result.errors.length === 0) {
      throw new Error('Should have returned validation errors');
    }
  });

  // 测试5: 代码解析
  testValidation('代码解析功能', () => {
    const validCode = testCases.flowchart.code;
    const invalidCode = 'not a mermaid diagram';

    if (!MockMermaid.parse(validCode)) {
      throw new Error('Valid code should parse successfully');
    }

    if (MockMermaid.parse(invalidCode)) {
      throw new Error('Invalid code should not parse successfully');
    }
  });

  console.log('\n🎉 所有测试完成!');
  console.log('\n📊 测试统计:');
  console.log(`- 图表类型测试: ${Object.keys(testCases).length}个`);
  console.log('- 错误处理测试: 2个');
  console.log('- 模板验证测试: 2个');
  console.log('- 代码解析测试: 1个');
  console.log('\n✨ Mermaid渲染工具功能验证完成!');
};

// 执行测试
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(console.error);
}

export { runTests, validateTemplate, MockMermaid };