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

  // Helper function to create DNS query in wireformat and encode to base64
  const createDnsQuery = (domain: string, type: number): string => {
    // Simple DNS query packet construction
    const labels = domain.split('.');
    let query = new Uint8Array(12 + domain.length + 2 + 4); // Header + QNAME + QTYPE + QCLASS
    let offset = 0;
    
    // DNS Header (12 bytes)
    const id = Math.floor(Math.random() * 65536);
    query[offset++] = (id >> 8) & 0xFF;
    query[offset++] = id & 0xFF;
    query[offset++] = 0x01; // QR=0, Opcode=0, AA=0, TC=0, RD=1
    query[offset++] = 0x00; // RA=0, Z=0, RCODE=0
    query[offset++] = 0x00; // QDCOUNT high byte
    query[offset++] = 0x01; // QDCOUNT low byte (1 question)
    query[offset++] = 0x00; // ANCOUNT high byte
    query[offset++] = 0x00; // ANCOUNT low byte
    query[offset++] = 0x00; // NSCOUNT high byte
    query[offset++] = 0x00; // NSCOUNT low byte
    query[offset++] = 0x00; // ARCOUNT high byte
    query[offset++] = 0x00; // ARCOUNT low byte
    
    // QNAME
    for (const label of labels) {
      query[offset++] = label.length;
      for (let i = 0; i < label.length; i++) {
        query[offset++] = label.charCodeAt(i);
      }
    }
    query[offset++] = 0x00; // End of QNAME
    
    // QTYPE
    query[offset++] = (type >> 8) & 0xFF;
    query[offset++] = type & 0xFF;
    
    // QCLASS (IN = 1)
    query[offset++] = 0x00;
    query[offset++] = 0x01;
    
    // Convert to base64
    let binary = '';
    for (let i = 0; i < offset; i++) {
      binary += String.fromCharCode(query[i]);
    }
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
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
        // Google DNS uses JSON API format
        url = `${providerConfig.url}?name=${encodeURIComponent(domain)}&type=${recordType}`;
      } else if (provider === 'cloudflare') {
        // Cloudflare uses DNS wireformat with base64 encoding
        const dnsQuery = createDnsQuery(domain, typeCode);
        url = `${providerConfig.url}?dns=${dnsQuery}`;
        headers['Accept'] = 'application/dns-message';
      }
      
      const response = await fetch(url, {
        headers
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      let data: DnsResponse;
      if (provider === 'cloudflare') {
        // Cloudflare returns binary DNS response in wireformat
        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/dns-message')) {
          // Binary wireformat response
          const arrayBuffer = await response.arrayBuffer();
          data = parseDnsResponse(new Uint8Array(arrayBuffer));
        } else {
          // Fallback: try to parse as text (hex encoded)
          const text = await response.text();
          if (text.match(/^[0-9a-fA-F\s]+$/)) {
            // Convert hex string to binary
            const hexString = text.replace(/\s/g, '');
            const bytes = new Uint8Array(hexString.length / 2);
            for (let i = 0; i < hexString.length; i += 2) {
              bytes[i / 2] = parseInt(hexString.substr(i, 2), 16);
            }
            data = parseDnsResponse(bytes);
          } else {
            throw new Error('Invalid response format from Cloudflare');
          }
        }
      } else {
        data = await response.json();
      }
      
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

  // Helper function to parse DNS response from binary format
  const parseDnsResponse = (data: Uint8Array): DnsResponse => {
    let offset = 0;
    
    // Parse DNS header
    const id = (data[offset] << 8) | data[offset + 1];
    offset += 2;
    const flags = (data[offset] << 8) | data[offset + 1];
    offset += 2;
    const qdcount = (data[offset] << 8) | data[offset + 1];
    offset += 2;
    const ancount = (data[offset] << 8) | data[offset + 1];
    offset += 2;
    const nscount = (data[offset] << 8) | data[offset + 1];
    offset += 2;
    const arcount = (data[offset] << 8) | data[offset + 1];
    offset += 2;
    
    const response: DnsResponse = {
      Status: flags & 0x0F, // RCODE
      TC: (flags & 0x0200) !== 0,
      RD: (flags & 0x0100) !== 0,
      RA: (flags & 0x0080) !== 0,
      AD: (flags & 0x0020) !== 0,
      CD: (flags & 0x0010) !== 0,
      Question: [],
      Answer: [],
      Authority: [],
      Additional: []
    };
    
    // Skip questions section for simplicity
    for (let i = 0; i < qdcount; i++) {
      // Skip QNAME
      while (data[offset] !== 0) {
        if ((data[offset] & 0xC0) === 0xC0) {
          offset += 2;
          break;
        }
        offset += data[offset] + 1;
      }
      if (data[offset] === 0) offset++;
      offset += 4; // Skip QTYPE and QCLASS
    }
    
    // Parse answer records
    for (let i = 0; i < ancount; i++) {
      const record = parseResourceRecord(data, offset);
      if (record) {
        response.Answer!.push(record.record);
        offset = record.newOffset;
      }
    }
    
    return response;
  };
  
  // Helper function to parse DNS name from binary data
  const parseDnsName = (data: Uint8Array, offset: number): { name: string; newOffset: number } => {
    const labels = [];
    let currentOffset = offset;
    let jumped = false;
    let jumpOffset = 0;
    
    while (true) {
      const length = data[currentOffset];
      
      if (length === 0) {
        currentOffset++;
        break;
      }
      
      if ((length & 0xC0) === 0xC0) {
        // DNS compression pointer
        if (!jumped) {
          jumpOffset = currentOffset + 2;
          jumped = true;
        }
        currentOffset = ((length & 0x3F) << 8) | data[currentOffset + 1];
      } else {
        // Regular label
        currentOffset++;
        const label = Array.from(data.slice(currentOffset, currentOffset + length))
          .map(b => String.fromCharCode(b))
          .join('');
        labels.push(label);
        currentOffset += length;
      }
    }
    
    return {
      name: labels.join('.'),
      newOffset: jumped ? jumpOffset : currentOffset
    };
  };

  // Helper function to parse a single resource record
  const parseResourceRecord = (data: Uint8Array, offset: number): { record: DnsRecord; newOffset: number } | null => {
    try {
      // Skip NAME (simplified - assume compression)
      if ((data[offset] & 0xC0) === 0xC0) {
        offset += 2;
      } else {
        while (data[offset] !== 0) {
          offset += data[offset] + 1;
        }
        offset++;
      }
      
      const type = (data[offset] << 8) | data[offset + 1];
      offset += 2;
      const cls = (data[offset] << 8) | data[offset + 1];
      offset += 2;
      const ttl = (data[offset] << 24) | (data[offset + 1] << 16) | (data[offset + 2] << 8) | data[offset + 3];
      offset += 4;
      const rdlength = (data[offset] << 8) | data[offset + 1];
      offset += 2;
      
      let rdata = '';
      if (type === 1) { // A record
        rdata = `${data[offset]}.${data[offset + 1]}.${data[offset + 2]}.${data[offset + 3]}`;
      } else if (type === 28) { // AAAA record
        const parts = [];
        for (let i = 0; i < 8; i++) {
          parts.push(((data[offset + i * 2] << 8) | data[offset + i * 2 + 1]).toString(16));
        }
        rdata = parts.join(':');
      } else if (type === 5) { // CNAME record
        const parsed = parseDnsName(data, offset);
        rdata = parsed.name;
      } else if (type === 15) { // MX record
        const priority = (data[offset] << 8) | data[offset + 1];
        const parsed = parseDnsName(data, offset + 2);
        rdata = `${priority} ${parsed.name}`;
      } else if (type === 2) { // NS record
        const parsed = parseDnsName(data, offset);
        rdata = parsed.name;
      } else if (type === 16) { // TXT record
        const txtLength = data[offset];
        rdata = Array.from(data.slice(offset + 1, offset + 1 + txtLength))
          .map(b => String.fromCharCode(b))
          .join('');
      } else {
        // For other types, convert to hex string with explanation
        const hexData = Array.from(data.slice(offset, offset + rdlength))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
        rdata = `${hexData} (原始十六进制数据)`;
      }
      
      offset += rdlength;
      
      return {
        record: {
          name: domain,
          type,
          TTL: ttl,
          data: rdata
        },
        newOffset: offset
      };
    } catch (error) {
      console.error('Error parsing resource record:', error);
      return null;
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