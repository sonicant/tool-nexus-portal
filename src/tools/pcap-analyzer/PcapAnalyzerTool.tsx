import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Network, AlertTriangle } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { HomeButton } from '@/components/ui/home-button';
import { FileUpload } from './components/FileUpload';
import { FilterControls } from './components/FilterControls';
import { PacketList } from './components/PacketList';
import { PacketDetails } from './components/PacketDetails';
import { PcapParser } from './parsers/pcap-parser';
import { BPFFilter } from './parsers/bpf-filter';
import { ParsedPacket, FileProcessingStats, PayloadDisplayOptions } from './types/packet-types';

const PcapAnalyzerTool: React.FC = () => {
  const { t } = useI18n();
  const [allPackets, setAllPackets] = useState<ParsedPacket[]>([]);
  const [filteredPackets, setFilteredPackets] = useState<ParsedPacket[]>([]);
  const [selectedPacket, setSelectedPacket] = useState<ParsedPacket | null>(null);
  const [filterString, setFilterString] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [stats, setStats] = useState<FileProcessingStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [payloadOptions, setPayloadOptions] = useState<PayloadDisplayOptions>({
    showFull: false,
    truncateAt: 128,
    format: 'hex'
  });

  const handleFileSelect = useCallback(async (file: File) => {
    setIsProcessing(true);
    setProcessingProgress(0);
    setError(null);
    setAllPackets([]);
    setFilteredPackets([]);
    setSelectedPacket(null);
    setFilterString('');

    try {
      const parser = new PcapParser();
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProcessingProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const result = await parser.parseFile(file);
      
      clearInterval(progressInterval);
      setProcessingProgress(100);
      
      if (result.stats.errors.length > 0 && result.packets.length === 0) {
        throw new Error(`${t('tools.pcapAnalyzer.errors.processingFailed')}: ${result.stats.errors[0]}`);
      }

      setAllPackets(result.packets);
      setFilteredPackets(result.packets);
      setStats(result.stats);
      
      if (result.packets.length > 0) {
        setSelectedPacket(result.packets[0]);
      }

      // Show warning if there were parsing errors but some packets were processed
      if (result.stats.errors.length > 0) {
        setError(t('tools.pcapAnalyzer.errors.parsingErrors'));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('tools.pcapAnalyzer.errors.processingFailed'));
      setStats(null);
    } finally {
      setIsProcessing(false);
      setProcessingProgress(0);
    }
  }, []);

  const handleFilterChange = useCallback((filter: string) => {
    setFilterString(filter);
    setSelectedPacket(null);
    
    if (!filter.trim()) {
      setFilteredPackets(allPackets);
      if (allPackets.length > 0) {
        setSelectedPacket(allPackets[0]);
      }
      return;
    }

    try {
      const bpfFilter = new BPFFilter();
      const filtered = bpfFilter.applyFilter(allPackets, filter);
      setFilteredPackets(filtered);
      
      if (filtered.length > 0) {
        setSelectedPacket(filtered[0]);
      }
    } catch (err) {
      console.error('Filter error:', err);
      setFilteredPackets(allPackets);
    }
  }, [allPackets]);

  const handlePacketSelect = useCallback((packet: ParsedPacket) => {
    setSelectedPacket(packet);
  }, []);

  const handlePayloadOptionsChange = useCallback((options: PayloadDisplayOptions) => {
    setPayloadOptions(options);
  }, []);

  const renderStats = () => {
    if (!stats || allPackets.length === 0) return null;

    const protocolCounts = allPackets.reduce((acc, packet) => {
      acc[packet.protocol] = (acc[packet.protocol] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="w-5 h-5" />
            <span>{t('tools.pcapAnalyzer.stats.title')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.processedPackets}</div>
              <div className="text-sm text-muted-foreground">{t('tools.pcapAnalyzer.stats.totalPackets')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{(stats.fileSize / 1024 / 1024).toFixed(1)}MB</div>
              <div className="text-sm text-muted-foreground">{t('tools.pcapAnalyzer.stats.fileSize')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.processingTime}ms</div>
              <div className="text-sm text-muted-foreground">{t('tools.pcapAnalyzer.stats.processingTime')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{Object.keys(protocolCounts).length}</div>
              <div className="text-sm text-muted-foreground">{t('tools.pcapAnalyzer.stats.protocols')}</div>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="flex-1">
            <h4 className="font-semibold mb-3">{t('tools.pcapAnalyzer.stats.protocolDistribution')}</h4>
            <div className="space-y-2">
              {Object.entries(protocolCounts)
                .sort(([,a], [,b]) => b - a)
                .map(([protocol, count]) => {
                  const percentage = (count / stats.processedPackets) * 100;
                  const getProtocolColor = (proto: string) => {
                    switch (proto.toLowerCase()) {
                      case 'tcp': return 'bg-blue-500';
                      case 'udp': return 'bg-green-500';
                      case 'icmp': return 'bg-yellow-500';
                      case 'arp': return 'bg-purple-500';
                      case 'dns': return 'bg-orange-500';
                      default: return 'bg-gray-500';
                    }
                  };
                  
                  return (
                    <div key={protocol} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{protocol}</span>
                        <span className="text-muted-foreground">{count} ({percentage.toFixed(1)}%)</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${getProtocolColor(protocol)}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-primary rounded-xl shadow-primary">
            <Network className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{t('tools.pcapAnalyzer.title')}</h1>
            <p className="text-muted-foreground">{t('tools.pcapAnalyzer.subtitle')}</p>
          </div>
        </div>
        <HomeButton />
      </div>

      {/* File Upload and Analysis Summary Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* File Upload */}
        <div className="flex flex-col">
          <FileUpload
            onFileSelect={handleFileSelect}
            isProcessing={isProcessing}
            processingProgress={processingProgress}
            stats={stats}
          />
        </div>
        
        {/* Analysis Summary */}
        <div className="flex flex-col">
          {allPackets.length > 0 ? (
            renderStats()
          ) : (
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="w-5 h-5" />
                  <span>{t('tools.pcapAnalyzer.stats.title')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <div className="text-sm mb-2">{t('tools.pcapAnalyzer.emptyState.title')}</div>
                  <div className="text-xs">{t('tools.pcapAnalyzer.emptyState.description')}</div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Analysis Results */}
      {allPackets.length > 0 && (
        <>

          {/* Filter Controls */}
          <FilterControls
            filterString={filterString}
            onFilterChange={handleFilterChange}
            totalPackets={allPackets.length}
            filteredPackets={filteredPackets.length}
          />

          {/* Main Analysis View */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Packet List */}
            <div className="space-y-4">
              <PacketList
                packets={filteredPackets}
                selectedPacket={selectedPacket}
                onPacketSelect={handlePacketSelect}
              />
            </div>

            {/* Packet Details */}
            <div className="space-y-4">
              <PacketDetails
                packet={selectedPacket}
                payloadOptions={payloadOptions}
                onPayloadOptionsChange={handlePayloadOptionsChange}
              />
            </div>
          </div>
        </>
      )}

      {/* Empty State */}
      {!isProcessing && allPackets.length === 0 && !error && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Network className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Ready to Analyze</h3>
            <p className="text-muted-foreground text-center max-w-md">
              {t('tools.pcapAnalyzer.emptyState.description')}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PcapAnalyzerTool;