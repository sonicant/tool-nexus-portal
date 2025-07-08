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
import { ConversionResult, ConversionOptions } from './types';
import { yamlToToml, tomlToYaml } from './converters';

export const YamlTomlConverterTool = () => {
  const { t } = useI18n();
  const { toast } = useToast();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('yaml-to-toml');
  const [yamlInput, setYamlInput] = useState('');
  const [tomlInput, setTomlInput] = useState('');
  const [result, setResult] = useState('');
  const [indentSize, setIndentSize] = useState('2');

  const convertYamlToToml = () => {
    if (!yamlInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter YAML content to convert",
        variant: "destructive",
      });
      return;
    }

    const options: ConversionOptions = {
      indentSize: parseInt(indentSize),
      preserveComments: true,
      sortKeys: false
    };

    const conversionResult = yamlToToml(yamlInput, options);
    
    if (conversionResult.success && conversionResult.data) {
      setResult(conversionResult.data);
    } else {
      toast({
        title: "Error",
        description: conversionResult.error || "Failed to convert YAML to TOML",
        variant: "destructive",
      });
    }
  };

  const convertTomlToYaml = () => {
    if (!tomlInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter TOML content to convert",
        variant: "destructive",
      });
      return;
    }

    const options: ConversionOptions = {
      indentSize: parseInt(indentSize),
      preserveComments: true,
      sortKeys: false
    };

    const conversionResult = tomlToYaml(tomlInput, options);
    
    if (conversionResult.success && conversionResult.data) {
      setResult(conversionResult.data);
    } else {
      toast({
        title: "Error",
        description: conversionResult.error || "Failed to convert TOML to YAML",
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
    setYamlInput('');
    setTomlInput('');
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
            <h1 className="text-3xl font-bold">{t('tools.yamlTomlConverter.name')}</h1>
            <p className="text-muted-foreground">{t('tools.yamlTomlConverter.description')}</p>
          </div>
        </div>
        <HomeButton />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="yaml-to-toml">{t('tools.yamlTomlConverter.yamlToToml')}</TabsTrigger>
            <TabsTrigger value="toml-to-yaml">{t('tools.yamlTomlConverter.tomlToYaml')}</TabsTrigger>
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

        <TabsContent value="yaml-to-toml" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>YAML {t('common.input')}</CardTitle>
                <CardDescription>Enter YAML content to convert to TOML</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder={`name: example
version: 1.0.0
dependencies:
  - lodash
  - express
config:
  port: 3000
  debug: true`}
                  value={yamlInput}
                  onChange={(e) => setYamlInput(e.target.value)}
                  rows={10}
                  className="font-mono text-sm resize-none"
                />
                <div className="flex space-x-2">
                  <Button onClick={convertYamlToToml} variant="gradient">
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
                <CardTitle>TOML {t('common.output')}</CardTitle>
                <CardDescription>Converted TOML result</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {result ? (
                    <div className="relative">
                      <SyntaxHighlighter
                        language="toml"
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
                    <div className="border rounded-md p-4 h-64 flex items-center justify-center text-muted-foreground">
                      TOML result will appear here...
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="toml-to-yaml" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>TOML {t('common.input')}</CardTitle>
                <CardDescription>Enter TOML content to convert to YAML</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder={`name = "example"
version = "1.0.0"
dependencies = ["lodash", "express"]

[config]
port = 3000
debug = true`}
                  value={tomlInput}
                  onChange={(e) => setTomlInput(e.target.value)}
                  rows={10}
                  className="font-mono text-sm resize-none"
                />
                <div className="flex space-x-2">
                  <Button onClick={convertTomlToYaml} variant="gradient">
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
                <CardTitle>YAML {t('common.output')}</CardTitle>
                <CardDescription>Converted YAML result</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {result ? (
                    <div className="relative">
                      <SyntaxHighlighter
                        language="yaml"
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
                    <div className="border rounded-md p-4 h-64 flex items-center justify-center text-muted-foreground">
                      YAML result will appear here...
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
