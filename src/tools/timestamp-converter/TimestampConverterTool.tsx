import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useI18n } from '@/hooks/useI18n';
import { Clock, Copy, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { HomeButton } from '@/components/ui/home-button';

// Common timezones
const TIMEZONES = [
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'New York (EST/EDT)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (PST/PDT)' },
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
  { value: 'Asia/Hong_Kong', label: 'Hong Kong (HKT)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)' },
];

// Date format options
const DATE_FORMATS = [
  { value: 'iso', label: 'ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)' },
  { value: 'locale', label: 'Locale String' },
  { value: 'custom1', label: 'YYYY-MM-DD HH:mm:ss' },
  { value: 'custom2', label: 'MM/DD/YYYY HH:mm:ss' },
  { value: 'custom3', label: 'DD/MM/YYYY HH:mm:ss' },
  { value: 'rfc2822', label: 'RFC 2822' },
];

const formatDate = (date: Date, format: string, timezone: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };

  switch (format) {
    case 'iso':
      return new Date(date.toLocaleString('en-US', { timeZone: timezone })).toISOString();
    case 'locale':
      return date.toLocaleString('en-US', { ...options, timeZoneName: 'short' });
    case 'custom1':
      return date.toLocaleString('sv-SE', options).replace('T', ' ');
    case 'custom2':
      return date.toLocaleString('en-US', options);
    case 'custom3':
      return date.toLocaleString('en-GB', options);
    case 'rfc2822':
      return date.toString();
    default:
      return date.toLocaleString('en-US', options);
  }
};

const parseTimestamp = (input: string): number | null => {
  // Try parsing as Unix timestamp (seconds)
  const timestamp = parseInt(input);
  if (!isNaN(timestamp)) {
    // Check if it's in seconds (10 digits) or milliseconds (13 digits)
    if (input.length === 10) {
      return timestamp * 1000; // Convert to milliseconds
    } else if (input.length === 13) {
      return timestamp;
    }
  }
  
  // Try parsing as date string
  const date = new Date(input);
  if (!isNaN(date.getTime())) {
    return date.getTime();
  }
  
  return null;
};

export const TimestampConverterTool = () => {
  const { t } = useI18n();
  const { toast } = useToast();
  
  // State for timestamp to date conversion
  const [timestampInput, setTimestampInput] = useState('');
  const [timestampResult, setTimestampResult] = useState('');
  const [timestampTimezone, setTimestampTimezone] = useState('UTC');
  const [timestampFormat, setTimestampFormat] = useState('iso');
  
  // State for date to timestamp conversion
  const [dateInput, setDateInput] = useState('');
  const [dateResult, setDateResult] = useState('');
  const [dateTimezone, setDateTimezone] = useState('UTC');
  
  // Current timestamp
  const [currentTimestamp, setCurrentTimestamp] = useState(Date.now());
  
  // Update current timestamp every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTimestamp(Date.now());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const convertTimestampToDate = () => {
    if (!timestampInput.trim()) {
      toast({
        title: t('common.error'),
        description: t('tools.timestampConverter.errors.emptyTimestamp'),
        variant: 'destructive',
      });
      return;
    }
    
    const timestamp = parseTimestamp(timestampInput.trim());
    if (timestamp === null) {
      toast({
        title: t('common.error'),
        description: t('tools.timestampConverter.errors.invalidTimestamp'),
        variant: 'destructive',
      });
      return;
    }
    
    try {
      const date = new Date(timestamp);
      const formatted = formatDate(date, timestampFormat, timestampTimezone);
      setTimestampResult(formatted);
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('tools.timestampConverter.errors.conversionFailed'),
        variant: 'destructive',
      });
    }
  };
  
  const convertDateToTimestamp = () => {
    if (!dateInput.trim()) {
      toast({
        title: t('common.error'),
        description: t('tools.timestampConverter.errors.emptyDate'),
        variant: 'destructive',
      });
      return;
    }
    
    try {
      const date = new Date(dateInput.trim());
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      
      const timestamp = Math.floor(date.getTime() / 1000); // Unix timestamp in seconds
      setDateResult(timestamp.toString());
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('tools.timestampConverter.errors.invalidDate'),
        variant: 'destructive',
      });
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: t('common.success'),
      description: t('common.copied'),
    });
  };
  
  const useCurrentTimestamp = () => {
    setTimestampInput(Math.floor(currentTimestamp / 1000).toString());
  };
  
  const useCurrentDateTime = () => {
    setDateInput(new Date().toISOString().slice(0, 19));
  };
  
  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-primary rounded-xl shadow-primary">
            <Clock className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{t('tools.timestampConverter.name')}</h1>
            <p className="text-muted-foreground">{t('tools.timestampConverter.description')}</p>
          </div>
        </div>
        <HomeButton />
      </div>
      
      {/* Current Timestamp Display */}
      <Card>
        <CardHeader>
          <CardTitle>{t('tools.timestampConverter.currentTime')}</CardTitle>
          <CardDescription>{t('tools.timestampConverter.currentTimeDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>{t('tools.timestampConverter.unixTimestamp')}</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Input 
                  value={Math.floor(currentTimestamp / 1000)} 
                  readOnly 
                  className="font-mono"
                />
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => copyToClipboard(Math.floor(currentTimestamp / 1000).toString())}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              <Label>{t('tools.timestampConverter.humanReadable')}</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Input 
                  value={new Date(currentTimestamp).toISOString()} 
                  readOnly 
                  className="font-mono"
                />
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => copyToClipboard(new Date(currentTimestamp).toISOString())}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Timestamp to Date Converter */}
        <Card>
          <CardHeader>
            <CardTitle>{t('tools.timestampConverter.timestampToDate')}</CardTitle>
            <CardDescription>{t('tools.timestampConverter.timestampToDateDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>{t('tools.timestampConverter.timestampInput')}</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Input
                  placeholder={t('tools.timestampConverter.timestampPlaceholder')}
                  value={timestampInput}
                  onChange={(e) => setTimestampInput(e.target.value)}
                  className="font-mono"
                />
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={useCurrentTimestamp}
                  title={t('tools.timestampConverter.useCurrentTimestamp')}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>{t('tools.timestampConverter.timezone')}</Label>
                <Select value={timestampTimezone} onValueChange={setTimestampTimezone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMEZONES.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>{t('tools.timestampConverter.format')}</Label>
                <Select value={timestampFormat} onValueChange={setTimestampFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DATE_FORMATS.map((fmt) => (
                      <SelectItem key={fmt.value} value={fmt.value}>
                        {fmt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button onClick={convertTimestampToDate} variant="gradient" className="w-full">
              {t('common.convert')}
            </Button>
            
            {timestampResult && (
              <div>
                <Label>{t('common.result')}</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Input
                    value={timestampResult}
                    readOnly
                    className="font-mono"
                  />
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => copyToClipboard(timestampResult)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Date to Timestamp Converter */}
        <Card>
          <CardHeader>
            <CardTitle>{t('tools.timestampConverter.dateToTimestamp')}</CardTitle>
            <CardDescription>{t('tools.timestampConverter.dateToTimestampDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>{t('tools.timestampConverter.dateInput')}</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Input
                  placeholder={t('tools.timestampConverter.datePlaceholder')}
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                  className="font-mono"
                />
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={useCurrentDateTime}
                  title={t('tools.timestampConverter.useCurrentDateTime')}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <Label>{t('tools.timestampConverter.timezone')}</Label>
              <Select value={dateTimezone} onValueChange={setDateTimezone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONES.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button onClick={convertDateToTimestamp} variant="gradient" className="w-full">
              {t('common.convert')}
            </Button>
            
            {dateResult && (
              <div>
                <Label>{t('common.result')}</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Input
                    value={dateResult}
                    readOnly
                    className="font-mono"
                  />
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => copyToClipboard(dateResult)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};