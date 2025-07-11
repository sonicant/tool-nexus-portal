import React from 'react';
import { ParsedPacket } from '../types/packet-types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useI18n } from '@/hooks/useI18n';
import { getIpColor, getIpTextColor, isIpAddress } from '../utils/ipColorUtils';

interface PacketListProps {
  packets: ParsedPacket[];
  selectedPacket: ParsedPacket | null;
  onPacketSelect: (packet: ParsedPacket) => void;
}

export const PacketList: React.FC<PacketListProps> = ({
  packets,
  selectedPacket,
  onPacketSelect
}) => {
  const { t } = useI18n();
  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    const ms = Math.floor((timestamp % 1) * 1000);
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }) + `.${ms.toString().padStart(3, '0')}`;
  };

  const getProtocolColor = (protocol: string): string => {
    switch (protocol.toLowerCase()) {
      case 'tcp':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'udp':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'icmp':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
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
        const color = getIpColor(ip);
        result.push(
          <span
            key={`${ip}-${i}`}
            className="px-1 py-0.5 rounded text-xs font-mono"
            style={{ backgroundColor: color, color: getIpTextColor() }}
          >
            {ip}
          </span>
        );
      }
    }
    
    return result.length > 1 ? result : text;
  };

  if (packets.length === 0) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full p-6">
          <div className="text-center text-muted-foreground">
            <p className="text-lg font-medium">{t('tools.pcapAnalyzer.packetList.noPackets')}</p>
            <p className="text-sm mt-2">{t('tools.pcapAnalyzer.packetList.uploadPrompt')}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardContent className="p-0">
        <div className="border-b p-4">
          <h3 className="font-semibold text-lg">{t('tools.pcapAnalyzer.packetList.title')} ({packets.length} packets)</h3>
        </div>
        <ScrollArea className="h-[400px]">
          <div className="space-y-1 p-2">
            {packets.map((packet) => (
              <div
                key={packet.index}
                className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-muted/50 ${
                  selectedPacket?.index === packet.index
                    ? 'bg-primary/10 border-primary'
                    : 'border-border'
                }`}
                onClick={() => onPacketSelect(packet)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-muted-foreground">
                      #{packet.index}
                    </span>
                    <Badge className={getProtocolColor(packet.protocol)}>
                      {packet.protocol}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">
                    {formatTimestamp(packet.timestamp)}
                  </span>
                </div>
                
                <div className="text-sm">
                  <div className="font-medium truncate">{renderTextWithColoredIPs(packet.summary)}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Length: {packet.packetHeader.inclLen} bytes
                    {packet.payload.length > 0 && (
                      <span className="ml-2">
                        Payload: {packet.payload.length} bytes
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};