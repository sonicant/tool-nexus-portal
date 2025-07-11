import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { Switch } from '../../components/ui/switch';
import { useToast } from '../../hooks/use-toast';
import { useI18n } from '../../hooks/useI18n';
import { 
  Send, 
  Plus, 
  Trash2, 
  Copy, 
  Download, 
  History, 
  Save,
  Clock,
  FileText,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { HomeButton } from '@/components/ui/home-button';
import { 
  HttpMethod, 
  ContentType, 
  HttpRequest, 
  HttpResponse, 
  HttpHeader,
  RequestHistory,
  FormattedResponse,
  RequestPreset
} from './types.js';
import {
  sendHttpRequest,
  formatResponseBody,
  generateId,
  createDefaultHeader,
  getCommonHeaders,
  getStatusDescription,
  formatFileSize,
  formatResponseTime
} from './utils.js';

const HTTP_METHODS: HttpMethod[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];

const CONTENT_TYPES: { value: ContentType; label: string }[] = [
  { value: 'application/json', label: 'JSON' },
  { value: 'application/xml', label: 'XML' },
  { value: 'text/xml', label: 'XML (text)' },
  { value: 'application/x-www-form-urlencoded', label: 'Form URL Encoded' },
  { value: 'multipart/form-data', label: 'Form Data' },
  { value: 'text/plain', label: 'Plain Text' },
  { value: 'text/html', label: 'HTML' },
  { value: 'application/javascript', label: 'JavaScript' },
  { value: 'text/css', label: 'CSS' },
  { value: 'custom', label: 'Custom' }
];

export default function HttpRequestBuilderTool() {
  const { t } = useI18n();
  const { toast } = useToast();
  
  // Request state
  const [request, setRequest] = useState<HttpRequest>({
    method: 'GET',
    url: '',
    headers: [createDefaultHeader()],
    body: '',
    contentType: 'application/json'
  });
  
  // Response state
  const [response, setResponse] = useState<HttpResponse | null>(null);
  const [formattedResponse, setFormattedResponse] = useState<FormattedResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // UI state
  const [activeTab, setActiveTab] = useState('request');
  const [showHeaders, setShowHeaders] = useState(true);
  const [showBody, setShowBody] = useState(true);
  
  // History and presets
  const [history, setHistory] = useState<RequestHistory[]>([]);
  const [presets, setPresets] = useState<RequestPreset[]>([]);
  
  // Load data from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('http-request-history');
    const savedPresets = localStorage.getItem('http-request-presets');
    
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to load history:', e);
      }
    }
    
    if (savedPresets) {
      try {
        setPresets(JSON.parse(savedPresets));
      } catch (e) {
        console.error('Failed to load presets:', e);
      }
    }
  }, []);
  
  // Save history to localStorage
  const saveHistory = (newHistory: RequestHistory[]) => {
    setHistory(newHistory);
    localStorage.setItem('http-request-history', JSON.stringify(newHistory));
  };
  
  // Save presets to localStorage
  const savePresets = (newPresets: RequestPreset[]) => {
    setPresets(newPresets);
    localStorage.setItem('http-request-presets', JSON.stringify(newPresets));
  };
  
  // Format response when response changes
  useEffect(() => {
    if (response) {
      const contentType = response.headers['content-type'] || response.headers['Content-Type'];
      const formatted = formatResponseBody(response.body, contentType);
      setFormattedResponse(formatted);
    } else {
      setFormattedResponse(null);
    }
  }, [response]);
  
  // Send HTTP request
  const handleSendRequest = async () => {
    if (!request.url.trim()) {
      toast({
        title: t('error'),
        description: t('tools.httpRequestBuilder.enterValidUrl'),
        variant: 'destructive'
      });
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setResponse(null);
    
    try {
      const result = await sendHttpRequest(request);
      setResponse(result);
      setActiveTab('response');
      
      // Add to history
      const historyItem: RequestHistory = {
        id: generateId(),
        timestamp: Date.now(),
        request: { ...request },
        response: result
      };
      
      const newHistory = [historyItem, ...history.slice(0, 49)]; // Keep last 50
      saveHistory(newHistory);
      
      toast({
        title: t('success'),
        description: `Request completed (${result.status} ${result.statusText})`,
        variant: result.status >= 200 && result.status < 300 ? 'default' : 'destructive'
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      
      // Add error to history
      const historyItem: RequestHistory = {
        id: generateId(),
        timestamp: Date.now(),
        request: { ...request },
        error: errorMessage
      };
      
      const newHistory = [historyItem, ...history.slice(0, 49)];
      saveHistory(newHistory);
      
      toast({
        title: t('error'),
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update request method
  const updateMethod = (method: HttpMethod) => {
    setRequest(prev => ({ ...prev, method }));
  };
  
  // Update request URL
  const updateUrl = (url: string) => {
    setRequest(prev => ({ ...prev, url }));
  };
  
  // Update request body
  const updateBody = (body: string) => {
    setRequest(prev => ({ ...prev, body }));
  };
  
  // Update content type
  const updateContentType = (contentType: ContentType) => {
    setRequest(prev => ({ ...prev, contentType }));
  };
  
  // Update custom content type
  const updateCustomContentType = (customContentType: string) => {
    setRequest(prev => ({ ...prev, customContentType }));
  };
  
  // Add header
  const addHeader = () => {
    setRequest(prev => ({
      ...prev,
      headers: [...prev.headers, createDefaultHeader()]
    }));
  };
  
  // Update header
  const updateHeader = (id: string, field: keyof HttpHeader, value: string | boolean) => {
    setRequest(prev => ({
      ...prev,
      headers: prev.headers.map(header => 
        header.id === id ? { ...header, [field]: value } : header
      )
    }));
  };
  
  // Remove header
  const removeHeader = (id: string) => {
    setRequest(prev => ({
      ...prev,
      headers: prev.headers.filter(header => header.id !== id)
    }));
  };
  
  // Save as preset
  const saveAsPreset = () => {
    const name = prompt(t('tools.httpRequestBuilder.presetName') + ':');
    if (!name?.trim()) return;
    
    const preset: RequestPreset = {
      id: generateId(),
      name: name.trim(),
      request: { ...request },
      createdAt: Date.now()
    };
    
    const newPresets = [preset, ...presets];
    savePresets(newPresets);
    
    toast({
        title: t('success'),
        description: t('tools.httpRequestBuilder.presetSaved')
      });
  };
  
  // Load preset
  const loadPreset = (preset: RequestPreset) => {
    setRequest({ ...preset.request });
    toast({
      title: t('success'),
      description: `${t('tools.httpRequestBuilder.presetLoaded')}: ${preset.name}`
    });
  };
  
  // Load from history
  const loadFromHistory = (historyItem: RequestHistory) => {
    setRequest({ ...historyItem.request });
    if (historyItem.response) {
      setResponse(historyItem.response);
      setActiveTab('response');
    }
    toast({
      title: t('success'),
      description: t('tools.httpRequestBuilder.presetLoaded')
    });
  };
  
  // Copy response
  const copyResponse = () => {
    if (formattedResponse) {
      navigator.clipboard.writeText(formattedResponse.formatted);
      toast({
        title: t('success'),
        description: t('tools.httpRequestBuilder.responseCopied')
      });
    }
  };
  
  // Download response
  const downloadResponse = () => {
    if (!formattedResponse) return;
    
    const blob = new Blob([formattedResponse.formatted], { 
      type: 'text/plain;charset=utf-8' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `response.${formattedResponse.language}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: t('success'),
      description: t('tools.httpRequestBuilder.downloadResponse')
    });
  };
  
  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'bg-green-600 text-white';
    if (status >= 300 && status < 400) return 'bg-yellow-600 text-white';
    if (status >= 400 && status < 500) return 'bg-orange-600 text-white';
    if (status >= 500) return 'bg-red-600 text-white';
    return 'bg-gray-600 text-white';
  };
  
  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-primary rounded-xl shadow-primary">
            <Send className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{t('tools.httpRequestBuilder.name')}</h1>
            <p className="text-muted-foreground">{t('tools.httpRequestBuilder.description')}</p>
          </div>
        </div>
        <HomeButton />
      </div>

      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="request">{t('tools.httpRequestBuilder.request')}</TabsTrigger>
              <TabsTrigger value="response">{t('tools.httpRequestBuilder.response')}</TabsTrigger>
              <TabsTrigger value="history">{t('tools.httpRequestBuilder.history')}</TabsTrigger>
              <TabsTrigger value="presets">{t('tools.httpRequestBuilder.presets')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="request" className="space-y-4">
              {/* Request Line */}
              <div className="flex gap-2">
                <Select value={request.method} onValueChange={updateMethod}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {HTTP_METHODS.map(method => (
                      <SelectItem key={method} value={method}>
                        {method}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Input
                  placeholder={t('tools.httpRequestBuilder.urlPlaceholder')}
                  value={request.url}
                  onChange={(e) => updateUrl(e.target.value)}
                  className="flex-1"
                />
                
                <Button 
                  onClick={handleSendRequest} 
                  disabled={isLoading || !request.url.trim()}
                  className="min-w-24"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      {t('tools.httpRequestBuilder.send')}
                    </>
                  )}
                </Button>
                
                <Button variant="outline" onClick={saveAsPreset}>
                  <Save className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Headers Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">{t('tools.httpRequestBuilder.headers')}</Label>
                  <div className="flex items-center gap-2">
                    <Switch
                    checked={showHeaders}
                    onCheckedChange={setShowHeaders}
                  />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={addHeader}
                      disabled={!showHeaders}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {showHeaders && (
                  <div className="space-y-2 border rounded-md p-3">
                    {request.headers.map((header) => (
                      <div key={header.id} className="flex items-center gap-2">
                        <Switch
                          checked={header.enabled}
                          onCheckedChange={(enabled) => updateHeader(header.id, 'enabled', enabled)}
                        />
                        <Input
                          placeholder={t('tools.httpRequestBuilder.key')}
                          value={header.key}
                          onChange={(e) => updateHeader(header.id, 'key', e.target.value)}
                          className="flex-1"
                          list="common-headers"
                        />
                        <Input
                          placeholder={t('tools.httpRequestBuilder.value')}
                          value={header.value}
                          onChange={(e) => updateHeader(header.id, 'value', e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeHeader(header.id)}
                          disabled={request.headers.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    
                    <datalist id="common-headers">
                      {getCommonHeaders().map((header) => (
                        <option key={header} value={header} />
                      ))}
                    </datalist>
                  </div>
                )}
              </div>
              
              {/* Body Section */}
              {['POST', 'PUT', 'PATCH'].includes(request.method) && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">{t('tools.httpRequestBuilder.body')}</Label>
                    <Switch
                      checked={showBody}
                      onCheckedChange={setShowBody}
                    />
                  </div>
                  
                  {showBody && (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Select value={request.contentType} onValueChange={updateContentType}>
                          <SelectTrigger className="w-48">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {CONTENT_TYPES.map(type => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        {request.contentType === 'custom' && (
                          <Input
                            placeholder="Custom content type"
                            value={request.customContentType || ''}
                            onChange={(e) => updateCustomContentType(e.target.value)}
                            className="flex-1"
                          />
                        )}
                      </div>
                      
                      <Textarea
                        placeholder={t('tools.httpRequestBuilder.bodyPlaceholder')}
                        value={request.body}
                        onChange={(e) => updateBody(e.target.value)}
                        className="min-h-32 font-mono text-sm"
                      />
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="response" className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <span className="text-red-800 dark:text-red-200">{error}</span>
                </div>
              )}
              
              {response && (
                <div className="space-y-4">
                  {/* Response Status */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={response.status >= 200 && response.status < 300 ? 'default' : 'destructive'}
                          className={getStatusColor(response.status)}
                        >
                          {response.status}
                        </Badge>
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {response.statusText || getStatusDescription(response.status)}
                        </span>
                      </div>
                      
                      <Separator orientation="vertical" className="h-4" />
                      
                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                        <Clock className="h-4 w-4" />
                        {formatResponseTime(response.responseTime)}
                      </div>
                      
                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                        <FileText className="h-4 w-4" />
                        {formatFileSize(response.size)}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={copyResponse}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={downloadResponse}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Response Headers */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">{t('tools.httpRequestBuilder.responseHeaders')}</Label>
                    <div className="border rounded-md p-3 max-h-32 overflow-y-auto bg-white dark:bg-gray-900">
                      {Object.entries(response.headers).map(([key, value]) => (
                        <div key={key} className="flex text-sm">
                          <span className="font-medium text-gray-600 dark:text-gray-300 w-48 flex-shrink-0">{key}:</span>
                          <span className="text-gray-800 dark:text-gray-200 break-all">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Response Body */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">{t('tools.httpRequestBuilder.responseBody')}</Label>
                      {formattedResponse && (
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{formattedResponse.language}</Badge>
                          {formattedResponse.isValid ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                      )}
                    </div>
                    
                    {formattedResponse && (
                      <div className="border rounded-md">
                        <pre className="p-3 text-sm overflow-auto max-h-96 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                          <code>{formattedResponse.formatted}</code>
                        </pre>
                        {formattedResponse.error && (
                          <div className="p-2 bg-red-50 dark:bg-red-950 border-t border-red-200 dark:border-red-800 text-sm text-red-800 dark:text-red-200">
                            {formattedResponse.error}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {!response && !error && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  {t('tools.httpRequestBuilder.noResponse')}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="history" className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">{t('tools.httpRequestBuilder.history')}</Label>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setHistory([]);
                    localStorage.removeItem('http-request-history');
                    toast({ title: t('success'), description: t('common.clear') });
                  }}
                  disabled={history.length === 0}
                >
                  {t('common.clear')}
                </Button>
              </div>
              
              {history.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  {t('tools.httpRequestBuilder.noHistory')}
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {history.map((item) => (
                    <div 
                      key={item.id} 
                      className="border rounded-md p-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer bg-white dark:bg-gray-900"
                      onClick={() => loadFromHistory(item)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{item.request.method}</Badge>
                          <span className="text-sm font-medium truncate max-w-md">
                            {item.request.url}
                          </span>
                          {item.response && (
                            <Badge 
                              variant={item.response.status >= 200 && item.response.status < 300 ? 'default' : 'destructive'}
                              className={getStatusColor(item.response.status)}
                            >
                              {item.response.status}
                            </Badge>
                          )}
                          {item.error && (
                            <Badge variant="destructive">Error</Badge>
                          )}
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(item.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="presets" className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">{t('tools.httpRequestBuilder.presets')}</Label>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setPresets([]);
                    localStorage.removeItem('http-request-presets');
                    toast({ title: t('success'), description: t('common.clear') });
                  }}
                  disabled={presets.length === 0}
                >
                  {t('common.clear')}
                </Button>
              </div>
              
              {presets.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  {t('tools.httpRequestBuilder.noPresets')}
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {presets.map((preset) => (
                    <div 
                      key={preset.id} 
                      className="border rounded-md p-3 hover:bg-gray-50 dark:hover:bg-gray-800 bg-white dark:bg-gray-900"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{preset.name}</span>
                          <Badge variant="outline">{preset.request.method}</Badge>
                          <span className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-md">
                            {preset.request.url}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            {new Date(preset.createdAt).toLocaleDateString()}
                          </span>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => loadPreset(preset)}
                          >
                            {t('tools.httpRequestBuilder.loadPreset')}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => {
                              const newPresets = presets.filter(p => p.id !== preset.id);
                              savePresets(newPresets);
                              toast({ title: t('success'), description: t('tools.httpRequestBuilder.presetDeleted') });
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}