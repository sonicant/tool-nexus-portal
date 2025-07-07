import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useI18n } from '@/hooks/useI18n';
import { Network } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { HomeButton } from '@/components/ui/home-button';

export const SubnetCalculatorTool = () => {
  const { t } = useI18n();
  const { toast } = useToast();
  const [ipAddress, setIpAddress] = useState('192.168.1.0');
  const [inputType, setInputType] = useState<'cidr' | 'mask'>('cidr');
  const [cidr, setCidr] = useState(24);
  const [subnetMask, setSubnetMask] = useState('255.255.255.0');
  const [result, setResult] = useState<any>(null);

  const maskToCidr = (mask: string): number => {
    const maskParts = mask.split('.').map(Number);
    if (maskParts.length !== 4 || maskParts.some(n => n < 0 || n > 255)) {
      throw new Error('Invalid subnet mask');
    }
    
    let binary = '';
    maskParts.forEach(part => {
      binary += part.toString(2).padStart(8, '0');
    });
    
    const ones = binary.match(/^1*/)?.[0]?.length || 0;
    if (binary !== '1'.repeat(ones) + '0'.repeat(32 - ones)) {
      throw new Error('Invalid subnet mask format');
    }
    
    return ones;
  };

  const calculateSubnet = () => {
    try {
      const ip = ipAddress.split('.').map(Number);
      if (ip.length !== 4 || ip.some(n => n < 0 || n > 255)) {
        throw new Error('Invalid IP address');
      }

      let actualCidr = cidr;
      if (inputType === 'mask') {
        actualCidr = maskToCidr(subnetMask);
      }

      const mask = (0xFFFFFFFF << (32 - actualCidr)) >>> 0;
      const ipInt = (ip[0] << 24) + (ip[1] << 16) + (ip[2] << 8) + ip[3];
      const networkInt = (ipInt & mask) >>> 0;
      const broadcastInt = (networkInt | (~mask >>> 0)) >>> 0;

      const intToIp = (int: number) => [
        (int >>> 24) & 0xFF,
        (int >>> 16) & 0xFF,
        (int >>> 8) & 0xFF,
        int & 0xFF
      ].join('.');

      setResult({
        network: intToIp(networkInt),
        broadcast: intToIp(broadcastInt),
        firstHost: intToIp(networkInt + 1),
        lastHost: intToIp(broadcastInt - 1),
        subnetMask: intToIp(mask),
        cidr: actualCidr,
        totalHosts: Math.pow(2, 32 - actualCidr),
        usableHosts: Math.pow(2, 32 - actualCidr) - 2
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Invalid input",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-primary rounded-xl shadow-primary">
            <Network className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{t('tools.subnetCalculator.name')}</h1>
            <p className="text-muted-foreground">{t('tools.subnetCalculator.description')}</p>
          </div>
        </div>
        <HomeButton />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Network Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ip">{t('tools.subnetCalculator.ipAddress')}</Label>
              <Input
                id="ip"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
                placeholder="192.168.1.0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="input-type">Input Type</Label>
              <Select value={inputType} onValueChange={(value: 'cidr' | 'mask') => setInputType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cidr">CIDR Notation</SelectItem>
                  <SelectItem value="mask">Subnet Mask</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {inputType === 'cidr' ? (
              <div className="space-y-2">
                <Label htmlFor="cidr">CIDR (/{cidr})</Label>
                <Input
                  id="cidr"
                  type="number"
                  min="1"
                  max="30"
                  value={cidr}
                  onChange={(e) => setCidr(parseInt(e.target.value) || 24)}
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="mask">Subnet Mask</Label>
                <Input
                  id="mask"
                  value={subnetMask}
                  onChange={(e) => setSubnetMask(e.target.value)}
                  placeholder="255.255.255.0"
                />
              </div>
            )}
            <Button onClick={calculateSubnet} variant="gradient" className="w-full">
              {t('common.calculate')}
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Subnet Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm font-mono">
                <div className="font-medium">Network:</div>
                <div>{result.network}/{result.cidr}</div>
                <div className="font-medium">Broadcast:</div>
                <div>{result.broadcast}</div>
                <div className="font-medium">First Host:</div>
                <div>{result.firstHost}</div>
                <div className="font-medium">Last Host:</div>
                <div>{result.lastHost}</div>
                <div className="font-medium">Subnet Mask:</div>
                <div>{result.subnetMask}</div>
                <div className="font-medium">Total Hosts:</div>
                <div>{result.totalHosts.toLocaleString()}</div>
                <div className="font-medium">Usable Hosts:</div>
                <div>{result.usableHosts.toLocaleString()}</div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};