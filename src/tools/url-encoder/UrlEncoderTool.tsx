import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useI18n } from '@/hooks/useI18n';
import { Link, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { HomeButton } from '@/components/ui/home-button';

export const UrlEncoderTool = () => {
  const { t } = useI18n();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('encode');
  const [encodeInput, setEncodeInput] = useState('');
  const [decodeInput, setDecodeInput] = useState('');
  const [encodeResult, setEncodeResult] = useState('');
  const [decodeResult, setDecodeResult] = useState('');

  const encodeUrl = () => {
    try {
      if (!encodeInput.trim()) {
        toast({
          title: "Error",
          description: "Please enter URL to encode",
          variant: "destructive",
        });
        return;
      }

      const encoded = encodeURIComponent(encodeInput);
      setEncodeResult(encoded);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to encode URL",
        variant: "destructive",
      });
    }
  };

  const decodeUrl = () => {
    try {
      if (!decodeInput.trim()) {
        toast({
          title: "Error",
          description: "Please enter URL to decode",
          variant: "destructive",
        });
        return;
      }

      const decoded = decodeURIComponent(decodeInput);
      setDecodeResult(decoded);
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid URL encoding",
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
    setEncodeInput('');
    setDecodeInput('');
    setEncodeResult('');
    setDecodeResult('');
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-primary rounded-xl shadow-primary">
            <Link className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{t('tools.urlEncoder.name')}</h1>
            <p className="text-muted-foreground">{t('tools.urlEncoder.description')}</p>
          </div>
        </div>
        <HomeButton />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="encode">{t('common.encode')}</TabsTrigger>
          <TabsTrigger value="decode">{t('common.decode')}</TabsTrigger>
        </TabsList>

        <TabsContent value="encode" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('tools.urlEncoder.urlToEncode')}</CardTitle>
                <CardDescription>Enter URL or text to encode</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="https://example.com/search?q=hello world&type=web"
                  value={encodeInput}
                  onChange={(e) => setEncodeInput(e.target.value)}
                  rows={6}
                  className="font-mono text-sm resize-none"
                />
                <div className="flex space-x-2">
                  <Button onClick={encodeUrl} variant="gradient">
                    {t('common.encode')}
                  </Button>
                  <Button onClick={clearAll} variant="outline">
                    {t('common.clear')}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Encoded Result</CardTitle>
                <CardDescription>URL-encoded output</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Textarea
                    value={encodeResult}
                    readOnly
                    rows={6}
                    className="font-mono text-sm resize-none"
                    placeholder="Encoded result will appear here..."
                  />
                  {encodeResult && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(encodeResult)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="decode" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('tools.urlEncoder.urlToDecode')}</CardTitle>
                <CardDescription>Enter URL-encoded text to decode</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="https%3A//example.com/search%3Fq%3Dhello%20world%26type%3Dweb"
                  value={decodeInput}
                  onChange={(e) => setDecodeInput(e.target.value)}
                  rows={6}
                  className="font-mono text-sm resize-none"
                />
                <div className="flex space-x-2">
                  <Button onClick={decodeUrl} variant="gradient">
                    {t('common.decode')}
                  </Button>
                  <Button onClick={clearAll} variant="outline">
                    {t('common.clear')}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Decoded Result</CardTitle>
                <CardDescription>URL-decoded output</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Textarea
                    value={decodeResult}
                    readOnly
                    rows={6}
                    className="font-mono text-sm resize-none"
                    placeholder="Decoded result will appear here..."
                  />
                  {decodeResult && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(decodeResult)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-sm">Common URL Encoding Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm font-mono">
            <div>
              <p className="text-muted-foreground mb-2">Characters that need encoding:</p>
              <div className="space-y-1">
                <div>Space → %20</div>
                <div>! → %21</div>
                <div>" → %22</div>
                <div># → %23</div>
                <div>$ → %24</div>
                <div>% → %25</div>
              </div>
            </div>
            <div>
              <p className="text-muted-foreground mb-2">More examples:</p>
              <div className="space-y-1">
                <div>& → %26</div>
                <div>' → %27</div>
                <div>( → %28</div>
                <div>) → %29</div>
                <div>+ → %2B</div>
                <div>/ → %2F</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};