import React from 'react';
import { ParsedPacket, PayloadDisplayOptions } from '../types/packet-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useI18n } from '@/hooks/useI18n';
import { getIpColor, getIpTextColor } from '../utils/ipColorUtils';

interface PacketDetailsProps {
  packet: ParsedPacket | null;
  payloadOptions: PayloadDisplayOptions;
  onPayloadOptionsChange: (options: PayloadDisplayOptions) => void;
}

export const PacketDetails: React.FC<PacketDetailsProps> = ({
  packet,
  payloadOptions,
  onPayloadOptionsChange
}) => {
  const { t } = useI18n();
  if (!packet) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full p-6">
          <div className="text-center text-muted-foreground">
            <p className="text-lg font-medium">{t('tools.pcapAnalyzer.packetDetails.noPacketSelected')}</p>
            <p className="text-sm mt-2">{t('tools.pcapAnalyzer.packetDetails.selectPacket')}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    const ms = Math.floor((timestamp % 1) * 1000);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }) + `.${ms.toString().padStart(3, '0')}`;
  };

  const formatHex = (data: Uint8Array, maxBytes?: number): string => {
    const bytes = maxBytes ? data.slice(0, maxBytes) : data;
    const hex = Array.from(bytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join(' ');
    
    if (maxBytes && data.length > maxBytes) {
      return hex + ` ... (${data.length - maxBytes} more bytes)`;
    }
    return hex;
  };

  const formatAscii = (data: Uint8Array, maxBytes?: number): string => {
    const bytes = maxBytes ? data.slice(0, maxBytes) : data;
    const ascii = Array.from(bytes)
      .map(b => (b >= 32 && b <= 126) ? String.fromCharCode(b) : '.')
      .join('');
    
    if (maxBytes && data.length > maxBytes) {
      return ascii + ` ... (${data.length - maxBytes} more bytes)`;
    }
    return ascii;
  };

  const formatPayload = (): string => {
    if (packet.payload.length === 0) {
      return t('tools.pcapAnalyzer.packetDetails.noPayloadData');
    }

    const maxBytes = payloadOptions.showFull ? undefined : payloadOptions.truncateAt;
    
    switch (payloadOptions.format) {
      case 'hex':
        return formatHex(packet.payload, maxBytes);
      case 'ascii':
        return formatAscii(packet.payload, maxBytes);
      case 'both':
        return `Hex: ${formatHex(packet.payload, maxBytes)}\n\nASCII: ${formatAscii(packet.payload, maxBytes)}`;
      default:
        return formatHex(packet.payload, maxBytes);
    }
  };

  // 为IP地址添加颜色编码的组件
  const ColoredIP: React.FC<{ ip: string }> = ({ ip }) => {
    const color = getIpColor(ip);
    return (
      <span
        className="px-1 py-0.5 rounded font-mono"
        style={{ backgroundColor: color, color: getIpTextColor() }}
      >
        {ip}
      </span>
    );
  };

  // 为文本中的IP地址添加颜色编码
  const renderTextWithColoredIPs = (text: string) => {
    // 匹配IPv4和IPv6地址的正则表达式
    const ipRegex = /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b|\b(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}\b|\b::1\b|\b::\b/g;
    
    const parts = text.split(ipRegex);
    const matches = text.match(ipRegex) || [];
    
    const result = [];
    for (let i = 0; i < parts.length; i++) {
      if (parts[i]) {
        result.push(parts[i]);
      }
      if (matches[i]) {
        const ip = matches[i];
        result.push(<ColoredIP key={`${ip}-${i}`} ip={ip} />);
      }
    }
    
    return result.length > 1 ? result : text;
  };

  const renderEthernetHeader = () => {
    if (!packet.ethernet) return null;
    
    return (
      <div className="space-y-2">
        <h4 className="font-semibold text-sm">{t('tools.pcapAnalyzer.packetDetails.ethernetHeader')}</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">{t('tools.pcapAnalyzer.packetDetails.sourceMac')}:</span>
            <div className="font-mono">{packet.ethernet.srcMac}</div>
          </div>
          <div>
            <span className="text-muted-foreground">{t('tools.pcapAnalyzer.packetDetails.destMac')}:</span>
            <div className="font-mono">{packet.ethernet.dstMac}</div>
          </div>
          <div className="col-span-2">
            <span className="text-muted-foreground">{t('tools.pcapAnalyzer.packetDetails.etherType')}:</span>
            <div className="font-mono">0x{packet.ethernet.etherType.toString(16).padStart(4, '0')}</div>
          </div>
        </div>
      </div>
    );
  };

  const renderIPHeader = () => {
    if (!packet.ip) return null;
    
    return (
      <div className="space-y-2">
        <h4 className="font-semibold text-sm">{t('tools.pcapAnalyzer.packetDetails.ipHeader')}</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">{t('tools.pcapAnalyzer.packetDetails.sourceIp')}:</span>
            <div><ColoredIP ip={packet.ip.srcIP} /></div>
          </div>
          <div>
            <span className="text-muted-foreground">{t('tools.pcapAnalyzer.packetDetails.destIp')}:</span>
            <div><ColoredIP ip={packet.ip.dstIP} /></div>
          </div>
          <div>
            <span className="text-muted-foreground">{t('tools.pcapAnalyzer.packetDetails.version')}:</span>
            <div className="font-mono">{packet.ip.version}</div>
          </div>
          <div>
            <span className="text-muted-foreground">{t('tools.pcapAnalyzer.packetDetails.headerLength')}:</span>
            <div className="font-mono">{packet.ip.headerLength * 4} bytes</div>
          </div>
          <div>
            <span className="text-muted-foreground">Total Length:</span>
            <div className="font-mono">{packet.ip.totalLength} bytes</div>
          </div>
          <div>
            <span className="text-muted-foreground">{t('tools.pcapAnalyzer.packetDetails.protocol')}:</span>
            <div className="font-mono">{packet.ip.protocol}</div>
          </div>
          <div>
            <span className="text-muted-foreground">{t('tools.pcapAnalyzer.packetDetails.ttl')}:</span>
            <div className="font-mono">{packet.ip.timeToLive}</div>
          </div>
          <div>
            <span className="text-muted-foreground">{t('tools.pcapAnalyzer.packetDetails.checksum')}:</span>
            <div className="font-mono">0x{packet.ip.headerChecksum.toString(16).padStart(4, '0')}</div>
          </div>
        </div>
      </div>
    );
  };

  const renderTCPHeader = () => {
    if (!packet.tcp) return null;
    
    const flags = [];
    if (packet.tcp.flags.syn) flags.push('SYN');
    if (packet.tcp.flags.ack) flags.push('ACK');
    if (packet.tcp.flags.fin) flags.push('FIN');
    if (packet.tcp.flags.rst) flags.push('RST');
    if (packet.tcp.flags.psh) flags.push('PSH');
    if (packet.tcp.flags.urg) flags.push('URG');
    
    return (
      <div className="space-y-2">
        <h4 className="font-semibold text-sm">{t('tools.pcapAnalyzer.packetDetails.tcpHeader')}</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">{t('tools.pcapAnalyzer.packetDetails.sourcePort')}:</span>
            <div className="font-mono">{packet.tcp.srcPort}</div>
          </div>
          <div>
            <span className="text-muted-foreground">{t('tools.pcapAnalyzer.packetDetails.destPort')}:</span>
            <div className="font-mono">{packet.tcp.dstPort}</div>
          </div>
          <div>
            <span className="text-muted-foreground">{t('tools.pcapAnalyzer.packetDetails.sequenceNumber')}:</span>
            <div className="font-mono">{packet.tcp.sequenceNumber}</div>
          </div>
          <div>
            <span className="text-muted-foreground">{t('tools.pcapAnalyzer.packetDetails.acknowledgment')}:</span>
            <div className="font-mono">{packet.tcp.acknowledgmentNumber}</div>
          </div>
          <div>
            <span className="text-muted-foreground">Header Length:</span>
            <div className="font-mono">{packet.tcp.headerLength * 4} bytes</div>
          </div>
          <div>
            <span className="text-muted-foreground">{t('tools.pcapAnalyzer.packetDetails.windowSize')}:</span>
            <div className="font-mono">{packet.tcp.windowSize}</div>
          </div>
          <div className="col-span-2">
            <span className="text-muted-foreground">{t('tools.pcapAnalyzer.packetDetails.flags')}:</span>
            <div className="flex gap-1 mt-1">
              {flags.map(flag => (
                <Badge key={flag} variant="outline" className="text-xs">
                  {flag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderUDPHeader = () => {
    if (!packet.udp) return null;
    
    return (
      <div className="space-y-2">
        <h4 className="font-semibold text-sm">{t('tools.pcapAnalyzer.packetDetails.udpHeader')}</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">Source Port:</span>
            <div className="font-mono">{packet.udp.srcPort}</div>
          </div>
          <div>
            <span className="text-muted-foreground">Destination Port:</span>
            <div className="font-mono">{packet.udp.dstPort}</div>
          </div>
          <div>
            <span className="text-muted-foreground">{t('tools.pcapAnalyzer.packetDetails.length')}:</span>
            <div className="font-mono">{packet.udp.length} bytes</div>
          </div>
          <div>
            <span className="text-muted-foreground">Checksum:</span>
            <div className="font-mono">0x{packet.udp.checksum.toString(16).padStart(4, '0')}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{t('tools.pcapAnalyzer.packetDetails.title')} #{packet.index}</span>
          <Badge>{packet.protocol}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {/* Packet Summary */}
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">{t('tools.pcapAnalyzer.packetDetails.summary')}</h4>
              <div className="text-sm space-y-1">
                <div>
                  <span className="text-muted-foreground">{t('tools.pcapAnalyzer.packetDetails.timestamp')}:</span>
                  <div className="font-mono">{formatTimestamp(packet.timestamp)}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">{t('tools.pcapAnalyzer.packetDetails.summary')}:</span>
                  <div>{renderTextWithColoredIPs(packet.summary)}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">{t('tools.pcapAnalyzer.packetDetails.totalLength')}:</span>
                  <div className="font-mono">{packet.packetHeader.inclLen} bytes</div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Protocol Headers */}
            {renderEthernetHeader()}
            {packet.ethernet && <Separator />}
            
            {renderIPHeader()}
            {packet.ip && <Separator />}
            
            {renderTCPHeader()}
            {renderUDPHeader()}
            {(packet.tcp || packet.udp) && <Separator />}

            {/* Payload Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm">{t('tools.pcapAnalyzer.packetDetails.payload')} ({packet.payload.length} bytes)</h4>
                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="show-full"
                      checked={payloadOptions.showFull}
                      onCheckedChange={(checked) =>
                        onPayloadOptionsChange({ ...payloadOptions, showFull: checked })
                      }
                    />
                    <Label htmlFor="show-full" className="text-xs">
                      {t('tools.pcapAnalyzer.packetDetails.showFull')}
                    </Label>
                  </div>
                  <Select
                    value={payloadOptions.format}
                    onValueChange={(value) =>
                      onPayloadOptionsChange({ ...payloadOptions, format: value as 'hex' | 'ascii' | 'both' })
                    }
                  >
                    <SelectTrigger className="w-20 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hex">{t('tools.pcapAnalyzer.packetDetails.hex')}</SelectItem>
                      <SelectItem value="ascii">{t('tools.pcapAnalyzer.packetDetails.ascii')}</SelectItem>
                      <SelectItem value="both">{t('tools.pcapAnalyzer.packetDetails.both')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="bg-muted/50 p-3 rounded-lg">
                <pre className="text-xs font-mono whitespace-pre-wrap break-all">
                  {formatPayload()}
                </pre>
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};