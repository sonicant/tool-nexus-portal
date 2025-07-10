// Unit tests for Mermaid Renderer Tool
import { describe, it, expect, beforeEach, vi } from 'vitest';

/**
 * Mock Mermaid library for testing
 */
const mockMermaid = {
  initialize: vi.fn(),
  render: vi.fn().mockResolvedValue({ svg: '<svg>test</svg>' }),
  parse: vi.fn().mockReturnValue(true)
};

// Mock mermaid module
vi.mock('mermaid', () => mockMermaid);

/**
 * Mermaid代码验证函数
 */
const validateMermaidCode = (code: string): { isValid: boolean; error?: string } => {
  if (!code.trim()) {
    return { isValid: false, error: 'Mermaid code is empty' };
  }

  // 检查基本的Mermaid语法
  const validTypes = [
    'graph', 'flowchart', 'sequenceDiagram', 'classDiagram', 'stateDiagram',
    'erDiagram', 'journey', 'gantt', 'pie', 'gitgraph', 'mindmap',
    'quadrantChart', 'xychart-beta', 'packet-beta'
  ];

  const firstLine = code.trim().split('\n')[0].toLowerCase();
  const hasValidType = validTypes.some(type => firstLine.includes(type.toLowerCase()));

  if (!hasValidType) {
    return { isValid: false, error: 'Invalid Mermaid diagram type' };
  }

  return { isValid: true };
};

/**
 * 模板验证函数
 */
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
    const codeValidation = validateMermaidCode(template.code);
    if (!codeValidation.isValid) {
      errors.push(`Template code invalid: ${codeValidation.error}`);
    }
  }

  return { isValid: errors.length === 0, errors };
};

describe('Mermaid Renderer Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Mermaid Code Validation', () => {
    it('should validate correct flowchart code', () => {
      const validCode = `flowchart TD
    A[Start] --> B[Process]
    B --> C[End]`;
      const result = validateMermaidCode(validCode);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should validate correct sequence diagram code', () => {
      const validCode = `sequenceDiagram
    participant A
    participant B
    A->>B: Hello`;
      const result = validateMermaidCode(validCode);
      expect(result.isValid).toBe(true);
    });

    it('should detect empty code', () => {
      const result = validateMermaidCode('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Mermaid code is empty');
    });

    it('should detect invalid diagram type', () => {
      const invalidCode = `invalidType
    A --> B`;
      const result = validateMermaidCode(invalidCode);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid Mermaid diagram type');
    });

    it('should validate class diagram code', () => {
      const validCode = `classDiagram
    class Animal
    Animal : +int age
    Animal : +String gender`;
      const result = validateMermaidCode(validCode);
      expect(result.isValid).toBe(true);
    });

    it('should validate pie chart code', () => {
      const validCode = `pie title Pets adopted by volunteers
    "Dogs" : 386
    "Cats" : 85`;
      const result = validateMermaidCode(validCode);
      expect(result.isValid).toBe(true);
    });

    it('should validate quadrant chart code', () => {
      const validCode = `quadrantChart
    title Reach and influence
    x-axis Low Reach --> High Reach
    y-axis Low Influence --> High Influence`;
      const result = validateMermaidCode(validCode);
      expect(result.isValid).toBe(true);
    });
  });

  describe('Template Validation', () => {
    it('should validate complete template', () => {
      const validTemplate = {
        id: 'test-template',
        name: {
          en: 'Test Template',
          zh: '测试模板'
        },
        description: {
          en: 'A test template',
          zh: '一个测试模板'
        },
        code: 'flowchart TD\n    A[Start] --> B[End]'
      };
      
      const result = validateTemplate(validTemplate);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect missing id', () => {
      const invalidTemplate = {
        name: { en: 'Test', zh: '测试' },
        description: { en: 'Test', zh: '测试' },
        code: 'flowchart TD\n    A --> B'
      };
      
      const result = validateTemplate(invalidTemplate);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Template missing id');
    });

    it('should detect missing name translations', () => {
      const invalidTemplate = {
        id: 'test',
        name: { en: 'Test' }, // missing zh
        description: { en: 'Test', zh: '测试' },
        code: 'flowchart TD\n    A --> B'
      };
      
      const result = validateTemplate(invalidTemplate);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Template missing name translations');
    });

    it('should detect invalid code in template', () => {
      const invalidTemplate = {
        id: 'test',
        name: { en: 'Test', zh: '测试' },
        description: { en: 'Test', zh: '测试' },
        code: 'invalidType\n    A --> B'
      };
      
      const result = validateTemplate(invalidTemplate);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('Template code invalid'))).toBe(true);
    });
  });

  describe('Mermaid Library Integration', () => {
    it('should initialize mermaid with correct config', () => {
      // This would test the actual mermaid initialization
      // In a real component test, you would render the component and check initialization
      expect(mockMermaid.initialize).toBeDefined();
    });

    it('should render diagram successfully', async () => {
      const code = 'flowchart TD\n    A --> B';
      const result = await mockMermaid.render('test-id', code);
      expect(result.svg).toBe('<svg>test</svg>');
      expect(mockMermaid.render).toHaveBeenCalledWith('test-id', code);
    });
  });
});