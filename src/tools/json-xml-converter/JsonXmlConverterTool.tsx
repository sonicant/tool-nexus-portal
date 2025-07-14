import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useI18n } from '@/hooks/useI18n';
import { ArrowRightLeft, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '@/hooks/useTheme';
import { HomeButton } from '@/components/ui/home-button';
import { PrivacyNotice } from '@/components/ui/privacy-notice';

// JSON to XML conversion
const jsonToXml = (obj: any, rootName = 'root'): string => {
  const convertValue = (value: any, key: string): string => {
    if (value === null || value === undefined) {
      return `<${key}></${key}>`;
    }
    
    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        return value.map(item => convertValue(item, key)).join('');
      } else {
        const inner = Object.entries(value)
          .map(([k, v]) => convertValue(v, k))
          .join('');
        return `<${key}>${inner}</${key}>`;
      }
    }
    
    return `<${key}>${String(value)}</${key}>`;
  };

  if (typeof obj === 'object' && obj !== null) {
    const inner = Object.entries(obj)
      .map(([key, value]) => convertValue(value, key))
      .join('');
    return `<?xml version="1.0" encoding="UTF-8"?>\n<${rootName}>${inner}</${rootName}>`;
  }
  
  return `<?xml version="1.0" encoding="UTF-8"?>\n<${rootName}>${String(obj)}</${rootName}>`;
};

// XML to JSON conversion (simplified)
const xmlToJson = (xmlString: string): any => {
  // This is a simplified XML parser - in production, you'd want a proper XML parser
  const parseElement = (element: string): any => {
    const tagMatch = element.match(/<(\w+)>(.*?)<\/\1>/s);
    if (!tagMatch) return element;
    
    const [, tagName, content] = tagMatch;
    
    // Check if content has child elements
    const childMatch = content.match(/<\w+>/);
    if (childMatch) {
      const result: any = {};
      const childElements = content.match(/<(\w+)>.*?<\/\1>/gs) || [];
      
      childElements.forEach(child => {
        const childData = parseElement(child);
        const childTagMatch = child.match(/<(\w+)>/);
        if (childTagMatch) {
          const childTag = childTagMatch[1];
          if (result[childTag]) {
            if (!Array.isArray(result[childTag])) {
              result[childTag] = [result[childTag]];
            }
            result[childTag].push(childData);
          } else {
            result[childTag] = childData;
          }
        }
      });
      
      return result;
    }
    
    return content;
  };

  try {
    // Remove XML declaration and root element
    const cleanXml = xmlString.replace(/<\?xml.*?\?>/, '').trim();
    return parseElement(cleanXml);
  } catch (error) {
    throw new Error('Invalid XML format');
  }
};

export const JsonXmlConverterTool = () => {
  const { t } = useI18n();
  const { toast } = useToast();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('json-to-xml');
  const [jsonInput, setJsonInput] = useState('');
  const [xmlInput, setXmlInput] = useState('');
  const [result, setResult] = useState('');
  const [indentSize, setIndentSize] = useState('2');

  const convertJsonToXml = () => {
    try {
      if (!jsonInput.trim()) {
        toast({
          title: "Error",
          description: "Please enter JSON to convert",
          variant: "destructive",
        });
        return;
      }

      const parsed = JSON.parse(jsonInput);
      const xml = jsonToXml(parsed);
      setResult(xml);
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid JSON format",
        variant: "destructive",
      });
    }
  };

  const convertXmlToJson = () => {
    try {
      if (!xmlInput.trim()) {
        toast({
          title: "Error",
          description: "Please enter XML to convert",
          variant: "destructive",
        });
        return;
      }

      const parsed = xmlToJson(xmlInput);
      const json = JSON.stringify(parsed, null, parseInt(indentSize));
      setResult(json);
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid XML format",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Result copied to clipboard",
    });
  };

  const clearAll = () => {
    setJsonInput('');
    setXmlInput('');
    setResult('');
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-primary rounded-xl shadow-primary">
            <ArrowRightLeft className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{t('tools.jsonXmlConverter.name')}</h1>
            <p className="text-muted-foreground">{t('tools.jsonXmlConverter.description')}</p>
          </div>
        </div>
        <HomeButton />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="json-to-xml">{t('tools.jsonXmlConverter.jsonToXml')}</TabsTrigger>
            <TabsTrigger value="xml-to-json">{t('tools.jsonXmlConverter.xmlToJson')}</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Indent:</label>
            <Select value={indentSize} onValueChange={setIndentSize}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="8">8</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="json-to-xml" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>JSON {t('common.input')}</CardTitle>
                <CardDescription>Enter JSON to convert to XML</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder='{"name": "example", "items": [1, 2, 3]}'
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  rows={8}
                  className="font-mono text-sm resize-none"
                />
                <div className="flex space-x-2">
                  <Button onClick={convertJsonToXml} variant="gradient">
                    {t('common.convert')}
                  </Button>
                  <Button onClick={clearAll} variant="outline">
                    {t('common.clear')}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>XML {t('common.output')}</CardTitle>
                <CardDescription>Converted XML result</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {result ? (
                    <div className="relative">
                      <SyntaxHighlighter
                        language="xml"
                        style={theme === 'dark' ? oneDark : oneLight}
                        customStyle={{
                          margin: 0,
                          borderRadius: '6px',
                          fontSize: '14px',
                        }}
                      >
                        {result}
                      </SyntaxHighlighter>
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(result)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border rounded-md p-4 h-48 flex items-center justify-center text-muted-foreground">
                      XML result will appear here...
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="xml-to-json" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>XML {t('common.input')}</CardTitle>
                <CardDescription>Enter XML to convert to JSON</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder='<?xml version="1.0"?><root><name>example</name></root>'
                  value={xmlInput}
                  onChange={(e) => setXmlInput(e.target.value)}
                  rows={8}
                  className="font-mono text-sm resize-none"
                />
                <div className="flex space-x-2">
                  <Button onClick={convertXmlToJson} variant="gradient">
                    {t('common.convert')}
                  </Button>
                  <Button onClick={clearAll} variant="outline">
                    {t('common.clear')}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>JSON {t('common.output')}</CardTitle>
                <CardDescription>Converted JSON result</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {result ? (
                    <div className="relative">
                      <SyntaxHighlighter
                        language="json"
                        style={theme === 'dark' ? oneDark : oneLight}
                        customStyle={{
                          margin: 0,
                          borderRadius: '6px',
                          fontSize: '14px',
                        }}
                      >
                        {result}
                      </SyntaxHighlighter>
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(result)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border rounded-md p-4 h-48 flex items-center justify-center text-muted-foreground">
                      JSON result will appear here...
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      <PrivacyNotice />
    </div>
  );
};