import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Filter, X, HelpCircle, Search } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { BPFFilter } from '../parsers/bpf-filter';

interface FilterControlsProps {
  filterString: string;
  onFilterChange: (filter: string) => void;
  totalPackets: number;
  filteredPackets: number;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  filterString,
  onFilterChange,
  totalPackets,
  filteredPackets
}) => {
  const { t } = useI18n();
  const [inputValue, setInputValue] = useState(filterString);
  const [isValid, setIsValid] = useState(true);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    
    // Validate filter syntax
    try {
      const bpfFilter = new BPFFilter();
      bpfFilter.parseFilter(value);
      setIsValid(true);
    } catch (error) {
      setIsValid(value.trim() === '' || false);
    }
  };

  const handleApplyFilter = () => {
    if (isValid) {
      onFilterChange(inputValue);
    }
  };

  const handleClearFilter = () => {
    setInputValue('');
    onFilterChange('');
    setIsValid(true);
  };

  const handleExampleClick = (example: string) => {
    setInputValue(example);
    handleInputChange(example);
  };

  const filterExamples = BPFFilter.getFilterExamples();

  const quickFilters = [
    { label: 'TCP', filter: 'tcp' },
    { label: 'UDP', filter: 'udp' },
    { label: 'HTTP', filter: 'port 80' },
    { label: 'HTTPS', filter: 'port 443' },
    { label: 'DNS', filter: 'port 53' },
    { label: 'SSH', filter: 'port 22' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            <span>{t('tools.pcapAnalyzer.filters.title')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">
              {t('tools.pcapAnalyzer.filters.showing')} {filteredPackets} {t('tools.pcapAnalyzer.filters.of')} {totalPackets} {t('tools.pcapAnalyzer.filters.packets')}
            </span>
            {filterString && (
              <Badge variant="secondary">
                {t('tools.pcapAnalyzer.filters.filtered')}
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filter Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="filter-input">{t('tools.pcapAnalyzer.filters.expression')}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <HelpCircle className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">BPF Filter Syntax</h4>
                    <div className="text-xs space-y-1 text-muted-foreground">
                      <div>• <code>host 192.168.1.1</code> - Filter by IP address</div>
                      <div>• <code>port 80</code> - Filter by port number</div>
                      <div>• <code>tcp</code>, <code>udp</code> - Filter by protocol</div>
                      <div>• <code>src host 10.0.0.1</code> - Source IP filter</div>
                      <div>• <code>dst port 443</code> - Destination port filter</div>
                      <div>• <code>host 192.168.1.1 and port 80</code> - Combined filters</div>
                      <div>• <code>not port 22</code> - Exclude SSH traffic</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Examples</h4>
                    <ScrollArea className="h-32">
                      <div className="space-y-1">
                        {filterExamples.map((example, index) => (
                          <button
                            key={index}
                            onClick={() => handleExampleClick(example)}
                            className="block w-full text-left text-xs font-mono p-1 rounded hover:bg-muted transition-colors"
                          >
                            {example}
                          </button>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                id="filter-input"
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={t('tools.pcapAnalyzer.filters.placeholder')}
                className={`font-mono ${!isValid ? 'border-destructive' : ''}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && isValid) {
                    handleApplyFilter();
                  }
                }}
              />
              {!isValid && (
                <div className="text-xs text-destructive mt-1">
                  Invalid filter syntax
                </div>
              )}
            </div>
            <Button
              onClick={handleApplyFilter}
              disabled={!isValid}
              size="sm"
            >
              <Search className="w-4 h-4 mr-1" />
              {t('tools.pcapAnalyzer.filters.apply')}
            </Button>
            {filterString && (
              <Button
                onClick={handleClearFilter}
                variant="outline"
                size="sm"
              >
                <X className="w-4 h-4 mr-1" />
                {t('tools.pcapAnalyzer.filters.clear')}
              </Button>
            )}
          </div>
        </div>

        {/* Quick Filters */}
        <div className="space-y-2">
          <Label className="text-sm">{t('tools.pcapAnalyzer.filters.quickFilters')}</Label>
          <div className="flex flex-wrap gap-2">
            {quickFilters.map((quick) => (
              <Button
                key={quick.label}
                variant="outline"
                size="sm"
                onClick={() => {
                  setInputValue(quick.filter);
                  onFilterChange(quick.filter);
                  setIsValid(true);
                }}
                className="h-7 text-xs"
              >
                {quick.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Active Filter Display */}
        {filterString && (
          <div className="space-y-2">
            <Label className="text-sm">{t('tools.pcapAnalyzer.filters.activeFilter')}</Label>
            <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
              <code className="text-xs flex-1">{filterString}</code>
              <Button
                onClick={handleClearFilter}
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};