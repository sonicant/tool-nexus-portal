// React core imports for component functionality
import React, { useState, useEffect, useRef } from 'react';

// UI component imports for building the interface
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

// Icon imports for visual elements
import { ChartLine, Copy, Download, RotateCcw, AlertTriangle, CheckCircle } from 'lucide-react';

// Custom hooks for application functionality
import { useToast } from '@/hooks/use-toast';
import { useI18n } from '@/hooks/useI18n';
import { useTheme } from '@/hooks/useTheme';

// Additional UI components
import { HomeButton } from '@/components/ui/home-button';
import { PrivacyNotice } from '@/components/ui/privacy-notice';

// Syntax highlighting for code display
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Note: Mermaid is dynamically imported to avoid circular dependency issues
// This allows for better code splitting and prevents initialization conflicts

/**
 * Interface defining the structure of a Mermaid diagram template
 * Templates provide pre-built examples for different diagram types
 */
interface MermaidTemplate {
  /** Unique identifier for the template */
  id: string;
  /** Template name in multiple languages */
  name: {
    en: string; // English name
    zh: string; // Chinese name
  };
  /** Template description in multiple languages */
  description: {
    en: string; // English description
    zh: string; // Chinese description
  };
  /** The actual Mermaid code for this template */
  code: string;
}

/**
 * Pre-defined Mermaid diagram templates
 * 
 * This array contains various diagram types that users can select as starting points.
 * Each template demonstrates different Mermaid diagram capabilities and syntax.
 * 
 * COLOR NOTE: All templates will inherit colors from the current theme setting.
 * The theme is applied during Mermaid initialization and affects all diagram types.
 */
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

/**
 * MermaidRendererTool Component
 * 
 * A comprehensive tool for creating, editing, and rendering Mermaid diagrams.
 * Features include:
 * - Multiple diagram templates (flowchart, sequence, gantt, etc.)
 * - Real-time preview with syntax highlighting
 * - Theme-aware rendering (light/dark mode)
 * - Export functionality (SVG download)
 * - Full-width preview mode
 * - Error handling and validation
 */
export const MermaidRendererTool = () => {
  // Internationalization hook for multi-language support
  const { t, language } = useI18n();
  
  // Toast notifications for user feedback
  const { toast } = useToast();
  
  // Theme hook for light/dark mode detection
  // IMPORTANT: This controls diagram color schemes!
  const { theme } = useTheme();
  
  // State for the current Mermaid code being edited
  const [code, setCode] = useState(templates[0].code);
  
  // State for tracking which template is currently selected
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0].id);
  
  // State to track if diagram is currently being rendered
  const [isRendering, setIsRendering] = useState(true);
  
  // State for storing any rendering errors
  const [renderError, setRenderError] = useState<string | null>(null);
  
  // State for toggling full-width preview mode
  const [isFullWidth, setIsFullWidth] = useState(false);
  
  // Reference to the diagram container DOM element
  const diagramRef = useRef<HTMLDivElement>(null);
  
  // State storing the rendered SVG content
  const [diagramSvg, setDiagramSvg] = useState<string>('');
  
  // State holding the initialized Mermaid instance
  const [mermaidInstance, setMermaidInstance] = useState<any>(null);

  /**
   * Effect: Initialize Mermaid library
   * 
   * This effect runs when the component mounts and whenever the theme changes.
   * It dynamically imports Mermaid and configures it with theme-appropriate settings.
   * 
   * COLOR CONTROL: The 'theme' option is the primary control for diagram colors!
   * - 'dark': Uses dark color scheme with light text on dark backgrounds
   * - 'neutral': Uses light color scheme with dark text on light backgrounds
   * - Other available themes: 'base', 'forest', 'default'
   */
  useEffect(() => {
    const initializeMermaid = async () => {
      setIsRendering(true);
      try {
        // Dynamic import to avoid bundle size issues and circular dependencies
        const mermaid = (await import('mermaid')).default;
        
        // Initialize Mermaid with configuration options
        mermaid.initialize({
          // Prevent automatic rendering on page load
          startOnLoad: false,
          
          // THEME SETTING: Controls the color scheme of rendered diagrams
          // This is the main option that affects diagram colors!
          theme: theme === 'dark' ? 'dark' : 'forest',
          
          // Security level for rendering (loose allows more HTML)
          securityLevel: 'loose',
          
          // Font family for text in diagrams
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
          
          // Only log errors to reduce console noise
          logLevel: 'error',
          
          // Prevent Mermaid from rendering error messages in diagrams
          suppressErrorRendering: true
        });
        
        // Store the initialized instance for later use
        setMermaidInstance(() => mermaid);
      } catch (error) {
        console.error('Failed to initialize mermaid', error);
        setRenderError('Failed to initialize Mermaid library.');
        setIsRendering(false);
      }
    };
    
    initializeMermaid();
  }, [theme]); // Re-run when theme changes to update color scheme

  /**
   * Effect: Render Mermaid diagram
   * 
   * This effect handles the actual rendering of Mermaid diagrams whenever:
   * - The code content changes
   * - The Mermaid instance is initialized/updated
   * 
   * The rendering process includes validation, error handling, and debouncing
   * to provide a smooth user experience.
   */
  useEffect(() => {
    // Wait for Mermaid to be properly initialized
    if (!mermaidInstance) {
      return;
    }

    const renderDiagram = async () => {
      // Handle empty code case
      if (!code.trim()) {
        setDiagramSvg('');
        setRenderError(null);
        setIsRendering(false);
        return;
      }

      // Start rendering process
      setIsRendering(true);
      setRenderError(null);

      try {
        // Generate unique ID for this diagram instance
        // This prevents conflicts when multiple diagrams exist
        const diagramId = `mermaid-${Date.now()}`;
        
        // Validate syntax before attempting to render
        // This catches syntax errors early
        await mermaidInstance.parse(code);
        
        // Render the diagram and get SVG output
        // The SVG contains all styling and colors based on the current theme
        const { svg } = await mermaidInstance.render(diagramId, code);
        setDiagramSvg(svg);
      } catch (error) {
        // Handle rendering errors gracefully
        console.error('Mermaid render error:', error);
        setRenderError(error instanceof Error ? error.message : 'Unknown rendering error');
        setDiagramSvg('');
      } finally {
        setIsRendering(false);
      }
    };

    // Debounce rendering to avoid excessive re-renders during typing
    // 500ms delay provides good balance between responsiveness and performance
    const timeoutId = setTimeout(renderDiagram, 500);
    return () => clearTimeout(timeoutId);
  }, [code, mermaidInstance]); // Dependencies: re-run when code or instance changes

  /**
   * Handle template selection change
   * 
   * Updates the code editor with the selected template's code
   * and tracks the currently selected template.
   * 
   * @param templateId - The ID of the selected template
   */
  const handleTemplateChange = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setCode(template.code);
      setSelectedTemplate(templateId);
    }
  };

  /**
   * Handle copying the current Mermaid code to clipboard
   * 
   * Uses the modern Clipboard API to copy the code and provides
   * user feedback through toast notifications.
   */
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

  /**
   * Handle downloading the rendered diagram as an SVG file
   * 
   * Creates a downloadable SVG file from the rendered diagram.
   * The SVG preserves all colors and styling from the current theme.
   */
  const handleDownloadSvg = () => {
    if (!diagramSvg) return;

    // Create a blob with the SVG content
    const blob = new Blob([diagramSvg], { type: 'image/svg+xml' });
    
    // Create a temporary download URL
    const url = URL.createObjectURL(blob);
    
    // Create and trigger download link
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mermaid-diagram.svg';
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Provide user feedback
    toast({
      title: t('tools.mermaidRenderer.downloadSuccess'),
      description: t('tools.mermaidRenderer.downloadSuccessDesc')
    });
  };

  /**
   * Handle resetting the editor to the default template
   * 
   * Resets both the code content and selected template to the first template.
   */
  const handleReset = () => {
    setCode(templates[0].code);
    setSelectedTemplate(templates[0].id);
  };

  // Find the currently selected template data for display purposes
  const selectedTemplateData = templates.find(t => t.id === selectedTemplate);

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Page Header Section */}
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

      {/* Control Panel Section */}
      <Card>
        <CardHeader>
          <CardTitle>{t('tools.mermaidRenderer.controls')}</CardTitle>
          <CardDescription>{t('tools.mermaidRenderer.controlsDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Template Selection Dropdown */}
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
            
            {/* Action Buttons */}
            <div className="flex gap-2 items-end">
              {/* Copy code to clipboard */}
              <Button onClick={handleCopyCode} variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                {t('tools.mermaidRenderer.copyCode')}
              </Button>
              
              {/* Download rendered SVG (preserves theme colors) */}
              <Button 
                onClick={handleDownloadSvg} 
                variant="outline" 
                size="sm"
                disabled={!diagramSvg}
              >
                <Download className="h-4 w-4 mr-2" />
                {t('tools.mermaidRenderer.downloadSvg')}
              </Button>
              
              {/* Reset to default template */}
              <Button onClick={handleReset} variant="outline" size="sm">
                <RotateCcw className="h-4 w-4 mr-2" />
                {t('tools.mermaidRenderer.reset')}
              </Button>
              
              {/* Toggle full-width preview mode */}
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

      {/* Full-Width Preview Mode - Displayed above the editor */}
      {isFullWidth && diagramSvg && (
        <Card>
          <CardHeader>
            <CardTitle>{t('tools.mermaidRenderer.fullWidthPreview')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md p-8 bg-background overflow-auto">
              {/* Rendered SVG with theme-based colors */}
              <div 
                className="flex justify-center"
                dangerouslySetInnerHTML={{ __html: diagramSvg }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Editor and Preview Section */}
      <div className={`grid gap-6 ${isFullWidth ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
        {/* Code Editor Panel */}
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
              
              {/* Syntax Highlighting Preview */}
              <div className="border rounded-md overflow-hidden">
                <div className="bg-muted px-3 py-2 text-sm font-medium">
                  {t('tools.mermaidRenderer.syntaxHighlight')}
                </div>
                {/* Theme-aware syntax highlighting */}
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

        {/* Diagram Preview Panel */}
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
            {/* Error Display */}
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
            
            {/* Preview Container */}
            <div className="border rounded-md p-4 min-h-[400px] bg-background overflow-auto">
              {isRendering ? (
                // Loading state
                <div className="flex items-center justify-center h-[400px]">
                  <div className="text-muted-foreground">
                    {t('tools.mermaidRenderer.rendering')}...
                  </div>
                </div>
              ) : diagramSvg ? (
                // Rendered diagram with theme-based colors
                <div 
                  ref={diagramRef}
                  className="flex justify-center"
                  dangerouslySetInnerHTML={{ __html: diagramSvg }}
                />
              ) : (
                // Empty state
                <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                  {t('tools.mermaidRenderer.noPreview')}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <PrivacyNotice />
    </div>
  );
};