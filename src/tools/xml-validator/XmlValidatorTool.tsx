import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { FileText, Upload, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useI18n } from '@/hooks/useI18n';
import { HomeButton } from '@/components/ui/home-button';
import { PrivacyNotice } from '@/components/ui/privacy-notice';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '@/hooks/useTheme';
// Browser-compatible XML validation using DOMParser

interface ValidationError {
  line?: number;
  column?: number;
  message: string;
  severity: 'error' | 'warning';
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// 代码编辑器组件，支持语法高亮和行号
const CodeEditor: React.FC<{
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  language: string;
}> = ({ value, onChange, placeholder, language }) => {
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="relative border rounded-md overflow-hidden">
      {isEditing ? (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => setIsEditing(false)}
          placeholder={placeholder}
          className="min-h-[200px] font-mono text-sm border-0 resize-none focus:ring-0"
          autoFocus
        />
      ) : (
        <div 
          onClick={() => setIsEditing(true)}
          className="cursor-text min-h-[200px]"
        >
          <SyntaxHighlighter
            language={language}
            style={theme === 'dark' ? oneDark : oneLight}
            showLineNumbers={true}
            lineNumberStyle={{ minWidth: '3em', paddingRight: '1em', color: '#666' }}
            customStyle={{
              margin: 0,
              padding: '1rem',
              background: 'transparent',
              fontSize: '14px',
              minHeight: '200px'
            }}
          >
            {value || placeholder}
          </SyntaxHighlighter>
        </div>
      )}
    </div>
  );
};

const XmlValidatorTool: React.FC = () => {
  const { t } = useI18n();
  const { toast } = useToast();
  
  const [xsdContent, setXsdContent] = useState('');
  const [xmlContent, setXmlContent] = useState('');
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [xsdInputMethod, setXsdInputMethod] = useState<'text' | 'file'>('text');
  const [xmlInputMethod, setXmlInputMethod] = useState<'text' | 'file'>('text');

  const handleFileUpload = useCallback((file: File, setter: (content: string) => void) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setter(content);
      toast({
        title: t('common.success'),
        description: `${file.name} ${t('common.uploaded')}`
      });
    };
    reader.onerror = () => {
      toast({
        title: t('common.error'),
        description: t('common.fileReadError'),
        variant: 'destructive'
      });
    };
    reader.readAsText(file);
  }, [toast, t]);

  const parseXmlWithDOMParser = (xmlString: string): { doc: Document | null; error: ValidationError | null } => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(xmlString, 'application/xml');
      
      // Check for parsing errors
      const parserError = doc.querySelector('parsererror');
      if (parserError) {
        const errorText = parserError.textContent || '';
        const error = extractDetailedErrorInfo(errorText, xmlString);
        return { doc: null, error };
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

  // 提取详细的错误信息，包括行号和列号
  const extractDetailedErrorInfo = (errorText: string, xmlContent: string): ValidationError => {
    // 尝试从错误信息中提取行号和列号
    const lineMatch = errorText.match(/line[:\s]+(\d+)/i);
    const columnMatch = errorText.match(/column[:\s]+(\d+)/i);
    
    let line = lineMatch ? parseInt(lineMatch[1]) : undefined;
    let column = columnMatch ? parseInt(columnMatch[1]) : undefined;
    
    // 如果没有找到行号，尝试通过其他方式分析
    if (!line) {
      // 检查常见的XML错误模式
      if (errorText.includes('not well-formed') || errorText.includes('unclosed')) {
        const result = findUnclosedTags(xmlContent);
        if (result) {
          line = result.line;
          column = result.column;
        }
      }
    }
    
    // 生成更友好的错误消息
    let friendlyMessage = errorText;
    if (errorText.includes('not well-formed')) {
      friendlyMessage = 'XML格式不正确，可能存在未闭合的标签或语法错误';
    } else if (errorText.includes('unclosed')) {
      friendlyMessage = '存在未闭合的XML标签';
    } else if (errorText.includes('mismatched')) {
      friendlyMessage = 'XML标签不匹配';
    }
    
    return {
      line,
      column,
      message: friendlyMessage,
      severity: 'error'
    };
  };

  // 查找未闭合的标签
  const findUnclosedTags = (xmlContent: string): { line: number; column: number } | null => {
    const lines = xmlContent.split('\n');
    const tagStack: Array<{ tag: string; line: number; column: number }> = [];
    
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex];
      const lineNumber = lineIndex + 1;
      
      // 查找所有标签
      const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9]*)[^>]*>/g;
      let match;
      
      while ((match = tagRegex.exec(line)) !== null) {
        const fullTag = match[0];
        const tagName = match[1];
        const column = match.index + 1;
        
        if (fullTag.startsWith('</')) {
          // 闭合标签
          if (tagStack.length === 0 || tagStack[tagStack.length - 1].tag !== tagName) {
            return { line: lineNumber, column };
          }
          tagStack.pop();
        } else if (!fullTag.endsWith('/>')) {
          // 开放标签（非自闭合）
          tagStack.push({ tag: tagName, line: lineNumber, column });
        }
      }
    }
    
    // 如果还有未闭合的标签
    if (tagStack.length > 0) {
      const unclosed = tagStack[tagStack.length - 1];
      return { line: unclosed.line, column: unclosed.column };
    }
    
    return null;
  };

  const extractErrorInfo = (errorText: string): ValidationError => {
    // Try to extract line and column information from error message
    const lineMatch = errorText.match(/line[:\s]+(\d+)/i);
    const columnMatch = errorText.match(/column[:\s]+(\d+)/i);
    
    return {
      line: lineMatch ? parseInt(lineMatch[1]) : undefined,
      column: columnMatch ? parseInt(columnMatch[1]) : undefined,
      message: errorText,
      severity: 'error'
    };
  };

  const validateXmlStructure = (xmlString: string): ValidationError[] => {
    const errors: ValidationError[] = [];
    
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

  const validateXsdStructure = (xsdString: string): ValidationError[] => {
    const errors: ValidationError[] = [];
    
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
      // Check if it's a valid XSD (has schema element with correct namespace)
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

  const performXsdValidation = (): ValidationResult => {
    const errors: ValidationError[] = [];
    
    try {
      // First validate basic structure
      const xsdErrors = validateXsdStructure(xsdContent);
      const xmlErrors = validateXmlStructure(xmlContent);
      
      if (xsdErrors.length > 0 || xmlErrors.length > 0) {
        errors.push(...xsdErrors, ...xmlErrors);
        return {
          isValid: false,
          errors
        };
      }
      
      // Browser-compatible XSD validation using DOMParser
      const xmlResult = parseXmlWithDOMParser(xmlContent);
      const xsdResult = parseXmlWithDOMParser(xsdContent);
      
      if (xmlResult.error || xsdResult.error) {
        if (xmlResult.error) errors.push(xmlResult.error);
        if (xsdResult.error) errors.push(xsdResult.error);
        return {
          isValid: false,
          errors
        };
      }
      
      const xmlDoc = xmlResult.doc;
      const xsdDoc = xsdResult.doc;
      
      // Extract schema information from XSD
      const schemaElements = xsdDoc.querySelectorAll('xs\\:element, element');
      const xmlRoot = xmlDoc.documentElement;
      
      if (!xmlRoot) {
        errors.push({
          line: 1,
          column: 1,
          message: 'XML document has no root element',
          severity: 'error'
        });
        return { isValid: false, errors };
      }

      // Validate root element
      const rootElementName = xmlRoot.tagName;
      let rootSchemaFound = false;
      
      schemaElements.forEach((schemaElement) => {
        const elementName = schemaElement.getAttribute('name');
        if (elementName === rootElementName) {
          rootSchemaFound = true;
        }
      });
      
      if (!rootSchemaFound) {
        errors.push({
          line: 1,
          column: 1,
          message: `Root element '${rootElementName}' not found in schema`,
          severity: 'error'
        });
      }

      // Validate child elements and types
      const validateElement = (xmlElement: Element, depth: number = 0) => {
        const elementName = xmlElement.tagName;
        
        // Find corresponding schema element
        let schemaElement: Element | null = null;
        schemaElements.forEach((elem) => {
          if (elem.getAttribute('name') === elementName) {
            schemaElement = elem;
          }
        });
        
        if (!schemaElement && depth > 0) {
          errors.push({
            line: 1,
            column: 1,
            message: `Element '${elementName}' not defined in schema`,
            severity: 'error'
          });
        }
        
        // Validate data types for leaf elements
        if (schemaElement && xmlElement.children.length === 0) {
          const schemaType = schemaElement.getAttribute('type');
          const elementValue = xmlElement.textContent?.trim() || '';
          
          if (schemaType) {
            if (schemaType.includes('decimal') || schemaType.includes('double') || schemaType.includes('float')) {
              if (elementValue && isNaN(Number(elementValue))) {
                errors.push({
                  line: 1,
                  column: 1,
                  message: `Element '${elementName}' should be numeric but got '${elementValue}'`,
                  severity: 'error'
                });
              }
            } else if (schemaType.includes('int')) {
              if (elementValue && (!Number.isInteger(Number(elementValue)) || isNaN(Number(elementValue)))) {
                errors.push({
                  line: 1,
                  column: 1,
                  message: `Element '${elementName}' should be an integer but got '${elementValue}'`,
                  severity: 'error'
                });
              }
            }
          }
        }
        
        // Recursively validate child elements
        Array.from(xmlElement.children).forEach(child => {
          validateElement(child, depth + 1);
        });
      };
      
      validateElement(xmlRoot);
      
      // Add a warning about limited validation capabilities
      errors.push({
        line: 1,
        column: 1,
        message: 'Browser-based validation provides basic checks. For comprehensive XSD validation, consider using server-side validation.',
        severity: 'warning'
      });
      
      // If no errors found, validation passed
      if (errors.filter(e => e.severity === 'error').length === 0) {
        errors.push({
          message: 'XML document is valid according to the provided XSD schema',
          severity: 'warning'
        });
      }
      
    } catch (error) {
      errors.push({
        message: `Validation error: ${(error as Error).message}`,
        severity: 'error'
      });
    }
    
    return {
      isValid: errors.filter(e => e.severity === 'error').length === 0,
      errors
    };
  };

  const handleValidation = async () => {
    if (!xsdContent.trim() || !xmlContent.trim()) {
      toast({
        title: t('common.error'),
        description: 'Please provide both XSD and XML content',
        variant: 'destructive'
      });
      return;
    }

    setIsValidating(true);
    
    try {
      // Simulate async validation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const result = performXsdValidation();
      setValidationResult(result);
      
      toast({
        title: result.isValid ? t('common.success') : t('common.error'),
        description: result.isValid ? 'Validation completed successfully' : 'Validation found errors'
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: 'Validation failed: ' + (error as Error).message,
        variant: 'destructive'
      });
    } finally {
      setIsValidating(false);
    }
  };

  const clearAll = () => {
    setXsdContent('');
    setXmlContent('');
    setValidationResult(null);
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-primary rounded-xl shadow-primary">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{t('tools.xmlValidator.name')}</h1>
            <p className="text-muted-foreground">{t('tools.xmlValidator.description')}</p>
          </div>
        </div>
        <HomeButton />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {t('tools.xmlValidator.title')}
          </CardTitle>
          <CardDescription>
            {t('tools.xmlValidator.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* XSD Input Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">XSD Schema</Label>
              <Tabs value={xsdInputMethod} onValueChange={(value) => setXsdInputMethod(value as 'text' | 'file')}>
                <TabsList className="grid w-48 grid-cols-2">
                  <TabsTrigger value="text">Text Input</TabsTrigger>
                  <TabsTrigger value="file">File Upload</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            {xsdInputMethod === 'text' ? (
              <CodeEditor
                value={xsdContent}
                onChange={setXsdContent}
                placeholder="Paste your XSD schema here..."
                language="xml"
              />
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Input
                  type="file"
                  accept=".xsd,.xml"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file, setXsdContent);
                  }}
                  className="hidden"
                  id="xsd-file-input"
                />
                <Label htmlFor="xsd-file-input" className="cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">Click to upload XSD file</p>
                </Label>
              </div>
            )}
          </div>

          {/* XML Input Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">XML Document</Label>
              <Tabs value={xmlInputMethod} onValueChange={(value) => setXmlInputMethod(value as 'text' | 'file')}>
                <TabsList className="grid w-48 grid-cols-2">
                  <TabsTrigger value="text">Text Input</TabsTrigger>
                  <TabsTrigger value="file">File Upload</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            {xmlInputMethod === 'text' ? (
              <CodeEditor
                value={xmlContent}
                onChange={setXmlContent}
                placeholder="Paste your XML document here..."
                language="xml"
              />
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Input
                  type="file"
                  accept=".xml"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file, setXmlContent);
                  }}
                  className="hidden"
                  id="xml-file-input"
                />
                <Label htmlFor="xml-file-input" className="cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">Click to upload XML file</p>
                </Label>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              onClick={handleValidation} 
              disabled={isValidating || !xsdContent.trim() || !xmlContent.trim()}
              className="flex-1"
            >
              {isValidating ? 'Validating...' : 'Validate XML'}
            </Button>
            <Button variant="outline" onClick={clearAll}>
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Validation Results */}
      {validationResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {validationResult.isValid ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              Validation Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant={validationResult.isValid ? 'default' : 'destructive'}>
                  {validationResult.isValid ? 'Valid' : 'Invalid'}
                </Badge>
                <span className="text-sm text-gray-600">
                  {validationResult.errors.length} issue(s) found
                </span>
              </div>
              
              {validationResult.errors.length > 0 && (
                <div className="space-y-2">
                  {validationResult.errors.map((error, index) => (
                    <Alert key={index} variant={error.severity === 'error' ? 'destructive' : 'default'}>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="space-y-1">
                          <div className="font-medium">
                            {error.severity === 'error' ? 'Error' : 'Warning'}
                            {error.line && ` (Line ${error.line}${error.column ? `, Column ${error.column}` : ''})`}
                          </div>
                          <div className="text-sm">{error.message}</div>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      <PrivacyNotice />
    </div>
  );
};

export { XmlValidatorTool };