import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useI18n } from '@/hooks/useI18n';
import { Copy, Cog, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// UUID generation utilities
const generateUUIDv4 = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const generateUUIDv1 = (): string => {
  // Simplified UUID v1 implementation
  const now = Date.now();
  const timeHex = now.toString(16).padStart(12, '0');
  const randomHex = Math.random().toString(16).substr(2, 6);
  return `${timeHex.substr(0, 8)}-${timeHex.substr(8, 4)}-1${timeHex.substr(11, 3)}-${randomHex.substr(0, 4)}-${randomHex}${Math.random().toString(16).substr(2, 6)}`;
};

export const UuidGeneratorTool = () => {
  const { t } = useI18n();
  const { toast } = useToast();
  const [version, setVersion] = useState('v4');
  const [quantity, setQuantity] = useState(1);
  const [results, setResults] = useState<string[]>([]);

  const generateUUIDs = () => {
    const uuids: string[] = [];
    const count = Math.min(Math.max(1, quantity), 100); // Limit to 100

    for (let i = 0; i < count; i++) {
      if (version === 'v4') {
        uuids.push(generateUUIDv4());
      } else {
        uuids.push(generateUUIDv1());
      }
    }

    setResults(uuids);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "UUID copied to clipboard",
    });
  };

  const copyAllToClipboard = () => {
    const allUUIDs = results.join('\n');
    navigator.clipboard.writeText(allUUIDs);
    toast({
      title: "Copied!",
      description: `${results.length} UUIDs copied to clipboard`,
    });
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-3 bg-gradient-primary rounded-xl shadow-primary">
          <Cog className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{t('tools.uuidGenerator.name')}</h1>
          <p className="text-muted-foreground">{t('tools.uuidGenerator.description')}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>Set UUID generation parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="version">{t('tools.uuidGenerator.version')}</Label>
              <Select value={version} onValueChange={setVersion}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="v1">UUID v1 (timestamp-based)</SelectItem>
                  <SelectItem value="v4">UUID v4 (random)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">{t('tools.uuidGenerator.quantity')}</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                max="100"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              />
            </div>

            <Button onClick={generateUUIDs} variant="gradient" className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              {t('common.generate')}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generated UUIDs</CardTitle>
            <CardDescription>
              {results.length > 0 && (
                <div className="flex items-center justify-between">
                  <span>{results.length} UUID(s) generated</span>
                  <Button size="sm" variant="outline" onClick={copyAllToClipboard}>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy All
                  </Button>
                </div>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {results.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {results.map((uuid, index) => (
                  <div key={index} className="flex items-center justify-between bg-muted p-2 rounded group">
                    <code className="font-mono text-sm flex-1">{uuid}</code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(uuid)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                Click generate to create UUIDs
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};