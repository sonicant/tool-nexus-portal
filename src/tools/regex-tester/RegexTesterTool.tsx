import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Copy, AlertCircle, CheckCircle, Info, Search } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { useToast } from '@/hooks/use-toast';
import { HomeButton } from '@/components/ui/home-button';

interface RegexMatch {
  match: string;
  index: number;
  groups: string[];
  namedGroups: Record<string, string>;
}

interface RegexFlags {
  global: boolean;
  ignoreCase: boolean;
  multiline: boolean;
  dotAll: boolean;
  unicode: boolean;
  sticky: boolean;
}

export const RegexTesterTool: React.FC = () => {
  const { t } = useI18n();
  const { toast } = useToast();
  
  const [pattern, setPattern] = useState('');
  const [testString, setTestString] = useState('');
  const [flags, setFlags] = useState<RegexFlags>({
    global: true,
    ignoreCase: false,
    multiline: false,
    dotAll: false,
    unicode: false,
    sticky: false
  });
  const [matches, setMatches] = useState<RegexMatch[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);

  const flagsString = useMemo(() => {
    let flagStr = '';
    if (flags.global) flagStr += 'g';
    if (flags.ignoreCase) flagStr += 'i';
    if (flags.multiline) flagStr += 'm';
    if (flags.dotAll) flagStr += 's';
    if (flags.unicode) flagStr += 'u';
    if (flags.sticky) flagStr += 'y';
    return flagStr;
  }, [flags]);

  const testRegex = () => {
    if (!pattern) {
      setMatches([]);
      setError(null);
      setIsValid(false);
      return;
    }

    try {
      const regex = new RegExp(pattern, flagsString);
      setError(null);
      setIsValid(true);

      if (!testString) {
        setMatches([]);
        return;
      }

      const foundMatches: RegexMatch[] = [];
      
      if (flags.global) {
        // Reset lastIndex to ensure consistent behavior
        regex.lastIndex = 0;
        let match;
        let iterationCount = 0;
        const maxIterations = 10000; // Prevent infinite loops
        
        while ((match = regex.exec(testString)) !== null && iterationCount < maxIterations) {
          foundMatches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
            namedGroups: match.groups || {}
          });
          
          // Prevent infinite loop for zero-length matches
          if (match.index === regex.lastIndex) {
            regex.lastIndex++;
          }
          
          iterationCount++;
        }
        
        if (iterationCount >= maxIterations) {
          setError('Too many matches found. Pattern may be causing infinite loop.');
          setIsValid(false);
          setMatches([]);
          return;
        }
      } else {
        const match = regex.exec(testString);
        if (match) {
          foundMatches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
            namedGroups: match.groups || {}
          });
        }
      }
      
      setMatches(foundMatches);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid regular expression');
      setIsValid(false);
      setMatches([]);
    }
  };

  useEffect(() => {
    testRegex();
  }, [pattern, testString, flagsString]);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: t('common.copied'),
        description: `${type} ${t('common.copied').toLowerCase()}`,
      });
    });
  };

  const highlightMatches = (text: string, matches: RegexMatch[]) => {
    if (matches.length === 0) return text;
    
    const parts = [];
    let lastIndex = 0;
    
    matches.forEach((match, i) => {
      // Add text before match
      if (match.index > lastIndex) {
        parts.push(
          <span key={`before-${i}`}>
            {text.slice(lastIndex, match.index)}
          </span>
        );
      }
      
      // Add highlighted match
      parts.push(
        <span 
          key={`match-${i}`} 
          className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded"
        >
          {match.match}
        </span>
      );
      
      lastIndex = match.index + match.match.length;
    });
    
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(
        <span key="after">
          {text.slice(lastIndex)}
        </span>
      );
    }
    
    return parts;
  };

  const renderFlagControls = () => {
    const flagOptions = [
      { key: 'global', label: 'Global (g)', description: t('tools.regexTester.flags.globalDesc') },
      { key: 'ignoreCase', label: 'Ignore Case (i)', description: t('tools.regexTester.flags.ignoreCaseDesc') },
      { key: 'multiline', label: 'Multiline (m)', description: t('tools.regexTester.flags.multilineDesc') },
      { key: 'dotAll', label: 'Dot All (s)', description: t('tools.regexTester.flags.dotAllDesc') },
      { key: 'unicode', label: 'Unicode (u)', description: t('tools.regexTester.flags.unicodeDesc') },
      { key: 'sticky', label: 'Sticky (y)', description: t('tools.regexTester.flags.stickyDesc') }
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {flagOptions.map((option) => (
          <div key={option.key} className="flex items-center justify-between space-x-2">
            <div className="flex-1">
              <Label htmlFor={option.key} className="text-sm font-medium">
                {option.label}
              </Label>
              <p className="text-xs text-muted-foreground">
                {option.description}
              </p>
            </div>
            <Switch
              id={option.key}
              checked={flags[option.key as keyof RegexFlags]}
              onCheckedChange={(checked) => 
                setFlags(prev => ({ ...prev, [option.key]: checked }))
              }
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-primary rounded-xl shadow-primary">
            <Search className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{t('tools.regexTester.name')}</h1>
            <p className="text-muted-foreground">{t('tools.regexTester.description')}</p>
          </div>
        </div>
        <HomeButton />
      </div>
      {/* Pattern Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {t('tools.regexTester.pattern')}
            {isValid && <CheckCircle className="h-4 w-4 text-green-500" />}
            {error && <AlertCircle className="h-4 w-4 text-red-500" />}
          </CardTitle>
          <CardDescription>
            {t('tools.regexTester.patternDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-mono">/</span>
            <Input
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder={t('tools.regexTester.patternPlaceholder')}
              className="font-mono"
            />
            <span className="text-sm font-mono">/{flagsString}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(`/${pattern}/${flagsString}`, 'Regex')}
              disabled={!pattern}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Flags */}
      <Card>
        <CardHeader>
          <CardTitle>{t('tools.regexTester.flags.title')}</CardTitle>
          <CardDescription>
            {t('tools.regexTester.flags.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderFlagControls()}
        </CardContent>
      </Card>

      {/* Test String */}
      <Card>
        <CardHeader>
          <CardTitle>{t('tools.regexTester.testString')}</CardTitle>
          <CardDescription>
            {t('tools.regexTester.testStringDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            placeholder={t('tools.regexTester.testStringPlaceholder')}
            className="min-h-[120px] font-mono"
          />
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {t('tools.regexTester.results')}
            <Badge variant="secondary">
              {matches.length} {t('tools.regexTester.matches')}
            </Badge>
          </CardTitle>
          <CardDescription>
            {t('tools.regexTester.resultsDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Highlighted Text */}
          {testString && (
            <div>
              <Label className="text-sm font-medium mb-2 block">
                {t('tools.regexTester.highlightedText')}
              </Label>
              <div className="p-3 bg-muted rounded-md font-mono text-sm whitespace-pre-wrap break-all">
                {highlightMatches(testString, matches)}
              </div>
            </div>
          )}

          {/* Match Details */}
          {matches.length > 0 && (
            <div>
              <Label className="text-sm font-medium mb-2 block">
                {t('tools.regexTester.matchDetails')}
              </Label>
              <div className="space-y-3">
                {matches.map((match, index) => (
                  <Card key={index} className="border-l-4 border-l-blue-500">
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs text-muted-foreground">
                            {t('tools.regexTester.match')} {index + 1}
                          </Label>
                          <div className="font-mono text-sm bg-muted p-2 rounded mt-1">
                            "{match.match}"
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">
                            {t('tools.regexTester.position')}
                          </Label>
                          <div className="text-sm mt-1">
                            {match.index} - {match.index + match.match.length - 1}
                          </div>
                        </div>
                      </div>
                      
                      {match.groups.length > 0 && (
                        <div className="mt-3">
                          <Label className="text-xs text-muted-foreground">
                            {t('tools.regexTester.captureGroups')}
                          </Label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
                            {match.groups.map((group, groupIndex) => (
                              <div key={groupIndex} className="text-sm">
                                <span className="text-muted-foreground">Group {groupIndex + 1}:</span>
                                <span className="font-mono ml-2 bg-muted px-1 rounded">
                                  "{group || ''}"
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {Object.keys(match.namedGroups).length > 0 && (
                        <div className="mt-3">
                          <Label className="text-xs text-muted-foreground">
                            {t('tools.regexTester.namedGroups')}
                          </Label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-1">
                            {Object.entries(match.namedGroups).map(([name, value]) => (
                              <div key={name} className="text-sm">
                                <span className="text-muted-foreground">{name}:</span>
                                <span className="font-mono ml-2 bg-muted px-1 rounded">
                                  "{value}"
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* No Matches */}
          {pattern && testString && matches.length === 0 && !error && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                {t('tools.regexTester.noMatches')}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};