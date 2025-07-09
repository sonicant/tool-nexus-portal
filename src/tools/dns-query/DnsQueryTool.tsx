import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useI18n } from '@/hooks/useI18n';
import { Globe, Copy, Clock, Shield, Server } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { HomeButton } from '@/components/ui/home-button';

interface DnsRecord {
  name: string;
  type: number;
  TTL: number;
  data: string;
}

interface DnsResponse {
  Status: number;
  TC: boolean;
  RD: boolean;
  RA: boolean;
  AD: boolean;
  CD: boolean;
  Question: Array<{
    name: string;
    type: number;
  }>;
  Answer?: DnsRecord[];
  Authority?: DnsRecord[];
  Additional?: DnsRecord[];
}

const DOH_PROVIDERS = {
  google: {
    name: 'Google DNS',
    url: import.meta.env.DEV ? '/api/dns-google' : 'https://dns.google/resolve'
  },
  cloudflare: {
    name: 'Cloudflare DNS',
    url: import.meta.env.DEV ? '/api/dns-cloudflare' : 'https://cloudflare-dns.com/dns-query'
  }
};

const DNS_TYPES = {
  A: 1,
  AAAA: 28,
  CNAME: 5,
  MX: 15,
  TXT: 16,
  NS: 2,
  PTR: 12,
  SOA: 6
};

const DNS_TYPE_NAMES: { [key: number]: string } = {
  1: 'A',
  28: 'AAAA',
  5: 'CNAME',
  15: 'MX',
  16: 'TXT',
  2: 'NS',
  12: 'PTR',
  6: 'SOA'
};

export const DnsQueryTool = () => {
  const { t } = useI18n();
  const { toast } = useToast();
  const [domain, setDomain] = useState('');
  const [recordType, setRecordType] = useState('A');
  const [provider, setProvider] = useState('google');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DnsResponse | null>(null);
  const [queryTime, setQueryTime] = useState<number>(0);

  const validateDomain = (domain: string): boolean => {
    const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?([.][a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return domainRegex.test(domain);
  };

  const queryDNS = async () => {
    if (!domain.trim()) {
      toast({
        title: t('common.error'),
        description: t('tools.dnsQuery.emptyDomainError'),
        variant: 'destructive',
      });
      return;
    }

    if (!validateDomain(domain)) {
      toast({
        title: t('common.error'),
        description: t('tools.dnsQuery.invalidDomainError'),
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    const startTime = Date.now();

    try {
      const providerConfig = DOH_PROVIDERS[provider as keyof typeof DOH_PROVIDERS];
      const typeCode = DNS_TYPES[recordType as keyof typeof DNS_TYPES];
      
      const headers: Record<string, string> = {};
      let url: string;
      
      if (provider === 'google') {
        // Google DNS uses different parameter format
        url = `${providerConfig.url}?name=${encodeURIComponent(domain)}&type=${recordType}`;
      } else {
        // Cloudflare uses numeric type and requires specific headers
        url = `${providerConfig.url}?name=${encodeURIComponent(domain)}&type=${typeCode}`;
        headers['Accept'] = 'application/dns-json';
      }
      
      const response = await fetch(url, {
        headers
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: DnsResponse = await response.json();
      const endTime = Date.now();
      
      setResult(data);
      setQueryTime(endTime - startTime);
      
      toast({
        title: t('common.success'),
        description: t('tools.dnsQuery.querySuccess'),
      });
    } catch (error) {
      console.error('DNS query error:', error);
      toast({
        title: t('common.error'),
        description: t('tools.dnsQuery.queryError'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: t('common.success'),
      description: t('common.copied'),
    });
  };

  const formatTTL = (ttl: number): string => {
    if (ttl < 60) return `${ttl}s`;
    if (ttl < 3600) return `${Math.floor(ttl / 60)}m ${ttl % 60}s`;
    if (ttl < 86400) return `${Math.floor(ttl / 3600)}h ${Math.floor((ttl % 3600) / 60)}m`;
    return `${Math.floor(ttl / 86400)}d ${Math.floor((ttl % 86400) / 3600)}h`;
  };

  const renderRecord = (record: DnsRecord, index: number) => {
    const typeName = DNS_TYPE_NAMES[record.type] || record.type.toString();
    
    return (
      <div key={index} className="border rounded-lg p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-sm bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
              {typeName}
            </span>
            <span className="font-medium">{record.name}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(record.data)}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="font-mono text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded break-all">
          {record.data}
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>TTL: {formatTTL(record.TTL)}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Globe className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold">{t('tools.dnsQuery.name')}</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('tools.dnsQuery.description')}
            </p>
          </div>
        </div>
        <HomeButton />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('tools.dnsQuery.querySettings')}</CardTitle>
          <CardDescription>
            {t('tools.dnsQuery.querySettingsDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="domain">{t('tools.dnsQuery.domain')}</Label>
              <Input
                id="domain"
                placeholder={t('tools.dnsQuery.domainPlaceholder')}
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && queryDNS()}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="recordType">{t('tools.dnsQuery.recordType')}</Label>
              <Select value={recordType} onValueChange={setRecordType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(DNS_TYPES).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="provider">{t('tools.dnsQuery.provider')}</Label>
              <Select value={provider} onValueChange={setProvider}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(DOH_PROVIDERS).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button 
            onClick={queryDNS} 
            disabled={loading}
            className="w-full md:w-auto"
          >
            {loading ? t('tools.dnsQuery.querying') : t('tools.dnsQuery.query')}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{t('tools.dnsQuery.results')}</CardTitle>
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <Server className="h-4 w-4" />
                  <span>{DOH_PROVIDERS[provider as keyof typeof DOH_PROVIDERS].name}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{queryTime}ms</span>
                </div>
                {result.AD && (
                  <div className="flex items-center space-x-1">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span>{t('tools.dnsQuery.authenticated')}</span>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {result.Status === 0 ? (
              <>
                {result.Answer && result.Answer.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">{t('tools.dnsQuery.answers')}</h3>
                    {result.Answer.map((record, index) => renderRecord(record, index))}
                  </div>
                )}
                
                {result.Authority && result.Authority.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">{t('tools.dnsQuery.authority')}</h3>
                    {result.Authority.map((record, index) => renderRecord(record, index))}
                  </div>
                )}
                
                {result.Additional && result.Additional.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">{t('tools.dnsQuery.additional')}</h3>
                    {result.Additional.map((record, index) => renderRecord(record, index))}
                  </div>
                )}
                
                {(!result.Answer || result.Answer.length === 0) && 
                 (!result.Authority || result.Authority.length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    {t('tools.dnsQuery.noRecords')}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <div className="text-red-600 font-semibold">
                  {t('tools.dnsQuery.queryFailed')}: {result.Status}
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  {t('tools.dnsQuery.statusCodes.' + result.Status) || t('tools.dnsQuery.unknownError')}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};