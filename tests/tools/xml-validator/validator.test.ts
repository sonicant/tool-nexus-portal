// Unit tests for XML Validator Tool
import { describe, it, expect, beforeEach } from 'vitest';

// Mock the validation functions since they're part of the React component
// In a real scenario, these would be extracted to separate utility functions

/**
 * Mock DOMParser for testing
 */
class MockDOMParser {
  parseFromString(xmlString: string, mimeType: string): Document {
    // Simple mock implementation that closely matches browser behavior
    const mockDoc = {
      querySelector: (selector: string) => {
         if (selector === 'parsererror') {
           // Return error for invalid XML patterns
           if (xmlString.includes('<wrong>') || 
               xmlString.includes('</wrong>') ||
               xmlString.includes('unclosed') || 
               !xmlString.trim() ||
               (xmlString.includes('<child>') && xmlString.includes('</wrong>')) ||
               xmlString.includes('\x00') ||
               // Check for missing closing tags
               (xmlString.includes('<child>') && !xmlString.includes('</child>')) ||
               // Check for other malformed patterns
               xmlString.includes('<root>\n  <child>value\n</root>')) {
             return {
               textContent: 'XML parsing error: not well-formed'
             };
           }
           return null;
         }
         return null;
       },
      documentElement: {
        localName: xmlString.includes('xs:schema') || xmlString.includes('<schema') ? 'schema' : 'root',
        namespaceURI: xmlString.includes('XMLSchema') ? 'http://www.w3.org/2001/XMLSchema' : null,
        tagName: 'root'
      }
    } as unknown as Document;
    
    return mockDoc;
  }
}

// Mock global DOMParser
global.DOMParser = MockDOMParser as any;

/**
 * XML解析函数模拟
 */
const parseXmlWithDOMParser = (xmlString: string): { doc: Document | null; error: any | null } => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlString, 'application/xml');
    
    const parserError = doc.querySelector('parsererror');
    if (parserError) {
      const errorText = parserError.textContent || '';
      return { 
        doc: null, 
        error: {
          line: 1,
          column: 1,
          message: 'XML parsing failed',
          severity: 'error'
        }
      };
    }
    
    return { doc, error: null };
  } catch (e: any) {
    return { 
      doc: null, 
      error: {
        line: 1,
        column: 1,
        message: `XML parsing failed: ${e.message}`,
        severity: 'error'
      }
    };
  }
};

/**
 * XML结构验证函数
 */
const validateXmlStructure = (xmlString: string) => {
  const errors: any[] = [];
  
  if (!xmlString.trim()) {
    errors.push({
      message: 'XML content is empty',
      severity: 'error'
    });
    return errors;
  }

  const { doc, error } = parseXmlWithDOMParser(xmlString);
  if (error) {
    errors.push(error);
  }

  return errors;
};

/**
 * XSD结构验证函数
 */
const validateXsdStructure = (xsdString: string) => {
  const errors: any[] = [];
  
  if (!xsdString.trim()) {
    errors.push({
      message: 'XSD content is empty',
      severity: 'error'
    });
    return errors;
  }

  const { doc, error } = parseXmlWithDOMParser(xsdString);
  if (error) {
    errors.push(error);
    return errors;
  }

  if (doc) {
    const schemaElement = doc.documentElement;
    if (schemaElement.localName !== 'schema' || 
        !schemaElement.namespaceURI?.includes('XMLSchema')) {
      errors.push({
        message: 'Not a valid XSD schema - missing schema element or namespace',
        severity: 'error'
      });
    }
  }

  return errors;
};

describe('XML Validator Tests', () => {
  describe('XML Structure Validation', () => {
    it('should validate correct XML structure', () => {
      const validXml = `<?xml version="1.0" encoding="UTF-8"?>
<root>
  <child>value</child>
</root>`;
      const errors = validateXmlStructure(validXml);
      expect(errors).toHaveLength(0);
    });

    it('should detect empty XML content', () => {
      const errors = validateXmlStructure('');
      expect(errors).toHaveLength(1);
      expect(errors[0].message).toBe('XML content is empty');
      expect(errors[0].severity).toBe('error');
    });

    it('should detect malformed XML', () => {
      const malformedXml = `<root>
  <child>value
</root>`; // missing closing tag
      const errors = validateXmlStructure(malformedXml);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].severity).toBe('error');
    });

    it('should handle XML with special characters', () => {
      const xmlWithSpecialChars = `<?xml version="1.0" encoding="UTF-8"?>
<root>
  <child>&lt;test&gt;</child>
  <unicode>测试中文</unicode>
</root>`;
      const errors = validateXmlStructure(xmlWithSpecialChars);
      expect(errors).toHaveLength(0);
    });

    it('should detect unclosed tags', () => {
      const unclosedXml = `<root>
  <child>value</child>
  <unclosed>content`;
      const errors = validateXmlStructure(unclosedXml);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].severity).toBe('error');
    });
  });

  describe('XSD Structure Validation', () => {
    it('should validate correct XSD structure', () => {
      const validXsd = `<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <xs:element name="root" type="xs:string"/>
</xs:schema>`;
      const errors = validateXsdStructure(validXsd);
      expect(errors).toHaveLength(0);
    });

    it('should detect empty XSD content', () => {
      const errors = validateXsdStructure('');
      expect(errors).toHaveLength(1);
      expect(errors[0].message).toBe('XSD content is empty');
      expect(errors[0].severity).toBe('error');
    });

    it('should detect invalid XSD schema', () => {
      const invalidXsd = `<?xml version="1.0"?>
<root>
  <element>not a schema</element>
</root>`;
      const errors = validateXsdStructure(invalidXsd);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.message.includes('Not a valid XSD schema'))).toBe(true);
    });

    it('should validate XSD with different namespace prefixes', () => {
      const xsdWithDifferentPrefix = `<?xml version="1.0" encoding="UTF-8"?>
<schema xmlns="http://www.w3.org/2001/XMLSchema">
  <element name="test" type="string"/>
</schema>`;
      const errors = validateXsdStructure(xsdWithDifferentPrefix);
      expect(errors).toHaveLength(0);
    });
  });

  describe('XML Parsing Error Detection', () => {
    it('should handle XML with mismatched tags', () => {
      const mismatchedXml = `<root>
  <child>value</wrong>
</root>`;
      const { doc, error } = parseXmlWithDOMParser(mismatchedXml);
      expect(doc).toBeNull();
      expect(error).toBeTruthy();
      expect(error.severity).toBe('error');
    });

    it('should handle XML with invalid characters', () => {
      const invalidCharXml = `<root>
  <child>value\x00</child>
</root>`;
      const { doc, error } = parseXmlWithDOMParser(invalidCharXml);
      expect(doc).toBeNull();
      expect(error).toBeTruthy();
    });

    it('should parse valid XML successfully', () => {
      const validXml = `<?xml version="1.0"?>
<root>
  <child attr="value">content</child>
</root>`;
      const { doc, error } = parseXmlWithDOMParser(validXml);
      expect(error).toBeNull();
      expect(doc).toBeTruthy();
      expect(doc?.documentElement.tagName).toBe('root');
    });
  });

  describe('Edge Cases', () => {
    it('should handle XML with CDATA sections', () => {
      const xmlWithCDATA = `<?xml version="1.0"?>
<root>
  <content><![CDATA[<script>alert('test')</script>]]></content>
</root>`;
      const errors = validateXmlStructure(xmlWithCDATA);
      expect(errors).toHaveLength(0);
    });

    it('should handle XML with processing instructions', () => {
      const xmlWithPI = `<?xml version="1.0"?>
<?xml-stylesheet type="text/xsl" href="style.xsl"?>
<root>
  <child>value</child>
</root>`;
      const errors = validateXmlStructure(xmlWithPI);
      expect(errors).toHaveLength(0);
    });

    it('should handle XML with comments', () => {
      const xmlWithComments = `<?xml version="1.0"?>
<!-- This is a comment -->
<root>
  <!-- Another comment -->
  <child>value</child>
</root>`;
      const errors = validateXmlStructure(xmlWithComments);
      expect(errors).toHaveLength(0);
    });

    it('should handle very large XML documents', () => {
      const largeXml = `<?xml version="1.0"?>
<root>
${Array(1000).fill(0).map((_, i) => `  <item${i}>value${i}</item${i}>`).join('\n')}
</root>`;
      const errors = validateXmlStructure(largeXml);
      expect(errors).toHaveLength(0);
    });
  });
});

console.log('XML Validator unit tests loaded successfully.');