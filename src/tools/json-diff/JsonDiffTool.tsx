import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useI18n } from '@/hooks/useI18n';
import { GitCompare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { HomeButton } from '@/components/ui/home-button';
import { PrivacyNotice } from '@/components/ui/privacy-notice';

// JSON diff utility
const diffJson = (obj1: any, obj2: any, path = ''): Array<{ type: 'added' | 'removed' | 'changed'; path: string; oldValue?: any; newValue?: any }> => {
  const changes: Array<{ type: 'added' | 'removed' | 'changed'; path: string; oldValue?: any; newValue?: any }> = [];

  if (obj1 === obj2) return changes;

  if (typeof obj1 !== typeof obj2) {
    changes.push({ type: 'changed', path, oldValue: obj1, newValue: obj2 });
    return changes;
  }

  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    const maxLength = Math.max(obj1.length, obj2.length);
    for (let i = 0; i < maxLength; i++) {
      const currentPath = path ? `${path}[${i}]` : `[${i}]`;
      if (i >= obj1.length) {
        changes.push({ type: 'added', path: currentPath, newValue: obj2[i] });
      } else if (i >= obj2.length) {
        changes.push({ type: 'removed', path: currentPath, oldValue: obj1[i] });
      } else {
        changes.push(...diffJson(obj1[i], obj2[i], currentPath));
      }
    }
  } else if (typeof obj1 === 'object' && obj1 !== null && typeof obj2 === 'object' && obj2 !== null) {
    const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);
    
    for (const key of allKeys) {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (!(key in obj1)) {
        changes.push({ type: 'added', path: currentPath, newValue: obj2[key] });
      } else if (!(key in obj2)) {
        changes.push({ type: 'removed', path: currentPath, oldValue: obj1[key] });
      } else {
        changes.push(...diffJson(obj1[key], obj2[key], currentPath));
      }
    }
  } else if (obj1 !== obj2) {
    changes.push({ type: 'changed', path, oldValue: obj1, newValue: obj2 });
  }

  return changes;
};

export const JsonDiffTool = () => {
  const { t } = useI18n();
  const { toast } = useToast();
  const [json1, setJson1] = useState('');
  const [json2, setJson2] = useState('');

  const { diff, error } = useMemo(() => {
    if (!json1.trim() && !json2.trim()) {
      return { diff: [], error: null };
    }

    try {
      const obj1 = json1.trim() ? JSON.parse(json1) : {};
      const obj2 = json2.trim() ? JSON.parse(json2) : {};
      const differences = diffJson(obj1, obj2);
      return { diff: differences, error: null };
    } catch (err) {
      return { diff: [], error: err instanceof Error ? err.message : 'Invalid JSON' };
    }
  }, [json1, json2]);

  const stats = useMemo(() => {
    const added = diff.filter(d => d.type === 'added').length;
    const removed = diff.filter(d => d.type === 'removed').length;
    const changed = diff.filter(d => d.type === 'changed').length;
    return { added, removed, changed };
  }, [diff]);

  const formatValue = (value: any): string => {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'string') return `"${value}"`;
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    return String(value);
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-primary rounded-xl shadow-primary">
            <GitCompare className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{t('tools.jsonDiff.name')}</h1>
            <p className="text-muted-foreground">{t('tools.jsonDiff.description')}</p>
          </div>
        </div>
        <HomeButton />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">{t('tools.jsonDiff.originalJson')}</CardTitle>
            <CardDescription>Enter the original JSON</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder='{"name": "example", "value": 123}'
              value={json1}
              onChange={(e) => setJson1(e.target.value)}
              rows={12}
              className="font-mono text-sm resize-none"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">{t('tools.jsonDiff.modifiedJson')}</CardTitle>
            <CardDescription>Enter the modified JSON</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder='{"name": "updated", "value": 456, "new": true}'
              value={json2}
              onChange={(e) => setJson2(e.target.value)}
              rows={12}
              className="font-mono text-sm resize-none"
            />
          </CardContent>
        </Card>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">JSON Parse Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {!error && diff.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>JSON Diff Result</CardTitle>
            <CardDescription>
              <div className="flex space-x-4 text-sm">
                <span className="text-green-600">+{stats.added} added</span>
                <span className="text-red-600">-{stats.removed} removed</span>
                <span className="text-blue-600">~{stats.changed} changed</span>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted rounded-md p-4 max-h-96 overflow-y-auto">
              <div className="font-mono text-sm space-y-2">
                {diff.map((change, index) => (
                  <div
                    key={index}
                    className={`px-3 py-2 rounded ${
                      change.type === 'added'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                        : change.type === 'removed'
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                        : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
                    }`}
                  >
                    <div className="font-medium mb-1">
                      <span className="mr-2">
                        {change.type === 'added' ? '+' : change.type === 'removed' ? '-' : '~'}
                      </span>
                      {change.path || 'root'}
                    </div>
                    {change.type === 'changed' && (
                      <div className="ml-4 text-xs space-y-1">
                        <div className="text-red-600">- {formatValue(change.oldValue)}</div>
                        <div className="text-green-600">+ {formatValue(change.newValue)}</div>
                      </div>
                    )}
                    {change.type === 'added' && (
                      <div className="ml-4 text-xs">
                        + {formatValue(change.newValue)}
                      </div>
                    )}
                    {change.type === 'removed' && (
                      <div className="ml-4 text-xs">
                        - {formatValue(change.oldValue)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!error && diff.length === 0 && (json1.trim() || json2.trim()) && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No differences found - JSON objects are identical!</p>
          </CardContent>
        </Card>
      )}
      
      <PrivacyNotice />
    </div>
  );
};