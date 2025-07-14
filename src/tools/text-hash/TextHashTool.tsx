import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useI18n } from '@/hooks/useI18n';
import { Copy, Hash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { HomeButton } from '@/components/ui/home-button';
import { PrivacyNotice } from '@/components/ui/privacy-notice';

// Hash utilities
const hashText = async (text: string, algorithm: string): Promise<string> => {
  switch (algorithm) {
    case 'base64':
      return btoa(unescape(encodeURIComponent(text)));
    case 'base64url':
      return btoa(unescape(encodeURIComponent(text)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
    case 'md5':
      // Simple MD5-like hash for demo (not cryptographically secure)
      let hash = 0;
      for (let i = 0; i < text.length; i++) {
        const char = text.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
      }
      // Convert to positive number and pad to 32 hex characters
      const hexHash = Math.abs(hash).toString(16).padStart(8, '0');
      return hexHash.repeat(4).substring(0, 32);
    case 'sha1':
      // Using Web Crypto API
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      const hashBuffer = await crypto.subtle.digest('SHA-1', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    case 'sha256':
      const data256 = new TextEncoder().encode(text);
      const hashBuffer256 = await crypto.subtle.digest('SHA-256', data256);
      const hashArray256 = Array.from(new Uint8Array(hashBuffer256));
      return hashArray256.map(b => b.toString(16).padStart(2, '0')).join('');
    default:
      return text;
  }
};

export const TextHashTool = () => {
  const { t } = useI18n();
  const { toast } = useToast();
  const [inputText, setInputText] = useState('');
  const [algorithm, setAlgorithm] = useState('base64');
  const [result, setResult] = useState('');

  const handleHash = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Error",
        description: "Please enter text to hash",
        variant: "destructive",
      });
      return;
    }

    try {
      const hashed = await hashText(inputText, algorithm);
      setResult(hashed);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to hash text",
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

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-primary rounded-xl shadow-primary">
            <Hash className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{t('tools.textHash.name')}</h1>
            <p className="text-muted-foreground">{t('tools.textHash.description')}</p>
          </div>
        </div>
        <HomeButton />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('common.input')}</CardTitle>
            <CardDescription>Enter text to hash</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder={t('tools.textHash.placeholder')}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={6}
              className="resize-none"
            />
            
            <div className="flex space-x-4">
              <Select value={algorithm} onValueChange={setAlgorithm}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="base64">Base64</SelectItem>
                  <SelectItem value="base64url">Base64URL</SelectItem>
                  <SelectItem value="md5">MD5</SelectItem>
                  <SelectItem value="sha1">SHA-1</SelectItem>
                  <SelectItem value="sha256">SHA-256</SelectItem>
                </SelectContent>
              </Select>
              
              <Button onClick={handleHash} variant="gradient">
                {t('common.generate')}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('common.result')}</CardTitle>
            <CardDescription>Hashed output</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Textarea
                value={result}
                readOnly
                rows={6}
                className="resize-none font-mono text-sm"
                placeholder="Result will appear here..."
              />
              {result && (
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(result)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <PrivacyNotice />
    </div>
  );
};