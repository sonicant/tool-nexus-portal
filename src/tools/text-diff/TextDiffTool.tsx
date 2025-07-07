import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useI18n } from '@/hooks/useI18n';
import { GitCompare } from 'lucide-react';

// Simple diff algorithm
const diffText = (text1: string, text2: string) => {
  const lines1 = text1.split('\n');
  const lines2 = text2.split('\n');
  const result: Array<{ type: 'equal' | 'delete' | 'insert'; content: string; lineNumber?: number }> = [];
  
  let i = 0, j = 0;
  let lineNumber1 = 1, lineNumber2 = 1;

  while (i < lines1.length || j < lines2.length) {
    if (i >= lines1.length) {
      result.push({ type: 'insert', content: lines2[j], lineNumber: lineNumber2 });
      j++;
      lineNumber2++;
    } else if (j >= lines2.length) {
      result.push({ type: 'delete', content: lines1[i], lineNumber: lineNumber1 });
      i++;
      lineNumber1++;
    } else if (lines1[i] === lines2[j]) {
      result.push({ type: 'equal', content: lines1[i], lineNumber: lineNumber1 });
      i++;
      j++;
      lineNumber1++;
      lineNumber2++;
    } else {
      // Simple heuristic: if next line matches, assume current line is different
      const nextMatch1 = lines2.indexOf(lines1[i], j + 1);
      const nextMatch2 = lines1.indexOf(lines2[j], i + 1);
      
      if (nextMatch1 !== -1 && (nextMatch2 === -1 || nextMatch1 - j < nextMatch2 - i)) {
        result.push({ type: 'insert', content: lines2[j], lineNumber: lineNumber2 });
        j++;
        lineNumber2++;
      } else if (nextMatch2 !== -1) {
        result.push({ type: 'delete', content: lines1[i], lineNumber: lineNumber1 });
        i++;
        lineNumber1++;
      } else {
        result.push({ type: 'delete', content: lines1[i], lineNumber: lineNumber1 });
        result.push({ type: 'insert', content: lines2[j], lineNumber: lineNumber2 });
        i++;
        j++;
        lineNumber1++;
        lineNumber2++;
      }
    }
  }

  return result;
};

export const TextDiffTool = () => {
  const { t } = useI18n();
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');

  const diff = useMemo(() => {
    if (!text1.trim() && !text2.trim()) return [];
    return diffText(text1, text2);
  }, [text1, text2]);

  const stats = useMemo(() => {
    const additions = diff.filter(d => d.type === 'insert').length;
    const deletions = diff.filter(d => d.type === 'delete').length;
    const unchanged = diff.filter(d => d.type === 'equal').length;
    return { additions, deletions, unchanged };
  }, [diff]);

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-3 bg-gradient-primary rounded-xl shadow-primary">
          <GitCompare className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{t('tools.textDiff.name')}</h1>
          <p className="text-muted-foreground">{t('tools.textDiff.description')}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">{t('tools.textDiff.original')}</CardTitle>
            <CardDescription>Enter the original text</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Enter original text..."
              value={text1}
              onChange={(e) => setText1(e.target.value)}
              rows={12}
              className="font-mono text-sm resize-none"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">{t('tools.textDiff.modified')}</CardTitle>
            <CardDescription>Enter the modified text</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Enter modified text..."
              value={text2}
              onChange={(e) => setText2(e.target.value)}
              rows={12}
              className="font-mono text-sm resize-none"
            />
          </CardContent>
        </Card>
      </div>

      {diff.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Diff Result</CardTitle>
            <CardDescription>
              <div className="flex space-x-4 text-sm">
                <span className="text-green-600">+{stats.additions} additions</span>
                <span className="text-red-600">-{stats.deletions} deletions</span>
                <span className="text-muted-foreground">{stats.unchanged} unchanged</span>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted rounded-md p-4 max-h-96 overflow-y-auto">
              <div className="font-mono text-sm space-y-1">
                {diff.map((line, index) => (
                  <div
                    key={index}
                    className={`px-2 py-1 rounded ${
                      line.type === 'insert'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                        : line.type === 'delete'
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                        : 'text-muted-foreground'
                    }`}
                  >
                    <span className="inline-block w-8 text-xs text-muted-foreground mr-2">
                      {line.lineNumber}
                    </span>
                    <span className="mr-2">
                      {line.type === 'insert' ? '+' : line.type === 'delete' ? '-' : ' '}
                    </span>
                    <span>{line.content}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};