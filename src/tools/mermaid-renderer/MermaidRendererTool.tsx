import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ChartLine, Copy, Download, RotateCcw, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useI18n } from '@/hooks/useI18n';
import { HomeButton } from '@/components/ui/home-button';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '@/hooks/useTheme';
import mermaid from 'mermaid';

interface MermaidTemplate {
  id: string;
  name: {
    en: string;
    zh: string;
  };
  description: {
    en: string;
    zh: string;
  };
  code: string;
}

const templates: MermaidTemplate[] = [
  {
    id: 'flowchart',
    name: { en: 'Basic Flowchart', zh: '基础流程图' },
    description: { en: 'Simple flowchart with decision points', zh: '带决策点的简单流程图' },
    code: `flowchart TD
    A[Start] --> B{Is it?}
    B -->|Yes| C[OK]
    C --> D[Rethink]
    D --> B
    B ---->|No| E[End]`
  },
  {
    id: 'sequence',
    name: { en: 'Sequence Diagram', zh: '时序图' },
    description: { en: 'Communication between different actors', zh: '不同参与者之间的通信' },
    code: `sequenceDiagram
    participant Alice
    participant Bob
    Alice->>John: Hello John, how are you?
    loop Healthcheck
        John->>John: Fight against hypochondria
    end
    Note right of John: Rational thoughts <br/>prevail!
    John-->>Alice: Great!
    John->>Bob: How about you?
    Bob-->>John: Jolly good!`
  },
  {
    id: 'gantt',
    name: { en: 'Gantt Chart', zh: '甘特图' },
    description: { en: 'Project timeline and task scheduling', zh: '项目时间线和任务调度' },
    code: `gantt
    title A Gantt Diagram
    dateFormat  YYYY-MM-DD
    section Section
    A task           :a1, 2014-01-01, 30d
    Another task     :after a1  , 20d
    section Another
    Task in sec      :2014-01-12  , 12d
    another task      : 24d`
  },
  {
    id: 'pie',
    name: { en: 'Pie Chart', zh: '饼图' },
    description: { en: 'Data distribution visualization', zh: '数据分布可视化' },
    code: `pie title Pets adopted by volunteers
    "Dogs" : 386
    "Cats" : 85
    "Rats" : 15`
  },
  {
    id: 'gitgraph',
    name: { en: 'Git Graph', zh: 'Git分支图' },
    description: { en: 'Git branching and merging visualization', zh: 'Git分支和合并可视化' },
    code: `gitGraph
    commit
    commit
    branch develop
    checkout develop
    commit
    commit
    checkout main
    merge develop
    commit
    commit`
  },
  {
    id: 'mindmap',
    name: { en: 'Mind Map', zh: '思维导图' },
    description: { en: 'Hierarchical information structure', zh: '层次化信息结构' },
    code: `mindmap
  root((mindmap))
    Origins
      Long history
      ::icon(fa fa-book)
      Popularisation
        British popular psychology author Tony Buzan
    Research
      On effectiveness<br/>and features
      On Automatic creation
        Uses
            Creative techniques
            Strategic planning
            Argument mapping
    Tools
      Pen and paper
      Mermaid`
  },
  {
    id: 'class',
    name: { en: 'Class Diagram', zh: '类图' },
    description: { en: 'Object-oriented design visualization', zh: '面向对象设计可视化' },
    code: `classDiagram
    Animal <|-- Duck
    Animal <|-- Fish
    Animal <|-- Zebra
    Animal : +int age
    Animal : +String gender
    Animal: +isMammal()
    Animal: +mate()
    class Duck{
        +String beakColor
        +swim()
        +quack()
    }
    class Fish{
        -int sizeInFeet
        -canEat()
    }
    class Zebra{
        +bool is_wild
        +run()
    }`
  },
  {
    id: 'state',
    name: { en: 'State Diagram', zh: '状态图' },
    description: { en: 'System state transitions', zh: '系统状态转换' },
    code: `stateDiagram-v2
    [*] --> Still
    Still --> [*]

    Still --> Moving
    Moving --> Still
    Moving --> Crash
    Crash --> [*]`
  },
  {
    id: 'journey',
    name: { en: 'User Journey', zh: '用户旅程' },
    description: { en: 'User experience mapping', zh: '用户体验映射' },
    code: `journey
    title My working day
    section Go to work
      Make tea: 5: Me
      Go upstairs: 3: Me
      Do work: 1: Me, Cat
    section Go home
      Go downstairs: 5: Me
      Sit down: 5: Me`
  },
  {
    id: 'quadrant',
    name: { en: 'Quadrant Chart', zh: '象限图' },
    description: { en: 'Four-quadrant analysis chart', zh: '四象限分析图' },
    code: `quadrantChart
    title Reach and influence
    x-axis Low Reach --> High Reach
    y-axis Low Influence --> High Influence
    quadrant-1 We should expand
    quadrant-2 Need to promote
    quadrant-3 Re-evaluate
    quadrant-4 May be improved
    Campaign A: [0.3, 0.6]
    Campaign B: [0.45, 0.23]
    Campaign C: [0.57, 0.69]
    Campaign D: [0.78, 0.34]
    Campaign E: [0.40, 0.34]`
  },
  {
    id: 'xychart',
    name: { en: 'XY Chart', zh: 'XY图表' },
    description: { en: 'X-Y coordinate chart (beta)', zh: 'X-Y坐标图表（测试版）' },
    code: `xychart-beta
    title "Sales Revenue"
    x-axis [jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec]
    y-axis "Revenue (in $)" 4000 --> 11000
    bar [5000, 6000, 7500, 8200, 9500, 10500, 11000, 10200, 9200, 8500, 7000, 6000]
    line [5000, 6000, 7500, 8200, 9500, 10500, 11000, 10200, 9200, 8500, 7000, 6000]`
  },
  {
    id: 'packet',
    name: { en: 'Packet Diagram', zh: '数据包图' },
    description: { en: 'Network packet structure (beta)', zh: '网络数据包结构（测试版）' },
    code: `packet-beta
    title Sample Packet
    0-15: "Source Port"
    16-31: "Destination Port"
    32-63: "Sequence Number"
    64-95: "Acknowledgment Number"
    96-99: "Data Offset"
    100-105: "Reserved"
    106: "URG"
    107: "ACK"
    108: "PSH"
    109: "RST"
    110: "SYN"
    111: "FIN"
    112-127: "Window Size"`
  }
];

export const MermaidRendererTool = () => {
  const { t, language } = useI18n();
  const { toast } = useToast();
  const { theme } = useTheme();
  const [code, setCode] = useState(templates[0].code);
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0].id);
  const [isRendering, setIsRendering] = useState(false);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [isFullWidth, setIsFullWidth] = useState(false);
  const diagramRef = useRef<HTMLDivElement>(null);
  const [diagramSvg, setDiagramSvg] = useState<string>('');

  // Initialize Mermaid
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: theme === 'dark' ? 'dark' : 'default',
      securityLevel: 'loose',
      fontFamily: 'ui-sans-serif, system-ui, sans-serif',
      logLevel: 'error',
      suppressErrorRendering: true
    });
  }, [theme]);

  // Render diagram when code changes
  useEffect(() => {
    const renderDiagram = async () => {
      if (!code.trim()) {
        setDiagramSvg('');
        setRenderError(null);
        return;
      }

      setIsRendering(true);
      setRenderError(null);

      try {
        // Clear previous diagram
        if (diagramRef.current) {
          diagramRef.current.innerHTML = '';
        }

        // Generate unique ID for this diagram
        const diagramId = `mermaid-${Date.now()}`;
        
        // Validate syntax first
        const isValid = await mermaid.parse(code);
        if (!isValid) {
          throw new Error('Invalid Mermaid syntax');
        }
        
        // Validate and render
        const { svg } = await mermaid.render(diagramId, code);
        setDiagramSvg(svg);
      } catch (error) {
        console.error('Mermaid render error:', error);
        setRenderError(error instanceof Error ? error.message : 'Unknown rendering error');
        setDiagramSvg('');
      } finally {
        setIsRendering(false);
      }
    };

    const timeoutId = setTimeout(renderDiagram, 500); // Debounce rendering
    return () => clearTimeout(timeoutId);
  }, [code]);

  const handleTemplateChange = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setCode(template.code);
      setSelectedTemplate(templateId);
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast({
        title: t('tools.mermaidRenderer.copySuccess'),
        description: t('tools.mermaidRenderer.copySuccessDesc')
      });
    } catch (error) {
      toast({
        title: t('tools.mermaidRenderer.copyError'),
        description: t('tools.mermaidRenderer.copyErrorDesc'),
        variant: 'destructive'
      });
    }
  };

  const handleDownloadSvg = () => {
    if (!diagramSvg) return;

    const blob = new Blob([diagramSvg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mermaid-diagram.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: t('tools.mermaidRenderer.downloadSuccess'),
      description: t('tools.mermaidRenderer.downloadSuccessDesc')
    });
  };

  const handleReset = () => {
    setCode(templates[0].code);
    setSelectedTemplate(templates[0].id);
  };

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate);

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* 页面头部 */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-primary rounded-xl shadow-primary">
            <ChartLine className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{t('tools.mermaidRenderer.name')}</h1>
            <p className="text-muted-foreground">{t('tools.mermaidRenderer.description')}</p>
          </div>
        </div>
        <HomeButton />
      </div>

      {/* 控制面板 */}
      <Card>
        <CardHeader>
          <CardTitle>{t('tools.mermaidRenderer.controls')}</CardTitle>
          <CardDescription>{t('tools.mermaidRenderer.controlsDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-2 block">
                {t('tools.mermaidRenderer.template')}
              </label>
              <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
                  <SelectTrigger>
                    <SelectValue placeholder={selectedTemplateData?.name[language]} />
                  </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name[language]} ({template.description[language]})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2 items-end">
              <Button onClick={handleCopyCode} variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                {t('tools.mermaidRenderer.copyCode')}
              </Button>
              <Button 
                onClick={handleDownloadSvg} 
                variant="outline" 
                size="sm"
                disabled={!diagramSvg}
              >
                <Download className="h-4 w-4 mr-2" />
                {t('tools.mermaidRenderer.downloadSvg')}
              </Button>
              <Button onClick={handleReset} variant="outline" size="sm">
                <RotateCcw className="h-4 w-4 mr-2" />
                {t('tools.mermaidRenderer.reset')}
              </Button>
              <Button 
                onClick={() => setIsFullWidth(!isFullWidth)} 
                variant="outline" 
                size="sm"
              >
                {isFullWidth ? t('tools.mermaidRenderer.normalWidth') : t('tools.mermaidRenderer.fullWidth')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 全宽预览模式 - 在编辑器上方 */}
      {isFullWidth && diagramSvg && (
        <Card>
          <CardHeader>
            <CardTitle>{t('tools.mermaidRenderer.fullWidthPreview')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md p-8 bg-background overflow-auto">
              <div 
                className="flex justify-center"
                dangerouslySetInnerHTML={{ __html: diagramSvg }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* 编辑器和预览 */}
      <div className={`grid gap-6 ${isFullWidth ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
        {/* 代码编辑器 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {t('tools.mermaidRenderer.editor')}
              {selectedTemplateData && (
                <Badge variant="secondary">
                  {selectedTemplateData.name[language]}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>{t('tools.mermaidRenderer.editorDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={t('tools.mermaidRenderer.codePlaceholder')}
                className="min-h-[400px] font-mono text-sm"
              />
              
              {/* 语法高亮预览 */}
              <div className="border rounded-md overflow-hidden">
                <div className="bg-muted px-3 py-2 text-sm font-medium">
                  {t('tools.mermaidRenderer.syntaxHighlight')}
                </div>
                <SyntaxHighlighter
                  language="mermaid"
                  style={theme === 'dark' ? oneDark : oneLight}
                  customStyle={{
                    margin: 0,
                    fontSize: '12px',
                    maxHeight: '200px',
                    overflow: 'auto'
                  }}
                >
                  {code || '// Enter Mermaid code above'}
                </SyntaxHighlighter>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 图表预览 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {t('tools.mermaidRenderer.preview')}
              {isRendering && (
                <Badge variant="secondary">
                  {t('tools.mermaidRenderer.rendering')}
                </Badge>
              )}
              {!isRendering && diagramSvg && (
                <Badge variant="default" className="bg-green-500">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {t('tools.mermaidRenderer.rendered')}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>{t('tools.mermaidRenderer.previewDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            {renderError && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>{t('tools.mermaidRenderer.renderError')}:</strong>
                  <br />
                  {renderError}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="border rounded-md p-4 min-h-[400px] bg-background overflow-auto">
              {isRendering ? (
                <div className="flex items-center justify-center h-[400px]">
                  <div className="text-muted-foreground">
                    {t('tools.mermaidRenderer.rendering')}...
                  </div>
                </div>
              ) : diagramSvg ? (
                <div 
                  ref={diagramRef}
                  className="flex justify-center"
                  dangerouslySetInnerHTML={{ __html: diagramSvg }}
                />
              ) : (
                <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                  {t('tools.mermaidRenderer.noPreview')}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>


    </div>
  );
};