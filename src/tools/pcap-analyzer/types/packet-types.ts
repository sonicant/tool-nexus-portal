export interface PcapHeader {
  magicNumber: number;
  versionMajor: number;
  versionMinor: number;
  thiszone: number;
  sigfigs: number;
  snaplen: number;
  network: number;
}

export interface PacketHeader {
  tsSec: number;
  tsUsec: number;
  inclLen: number;
  origLen: number;
}

export interface EthernetHeader {
  dstMac: string;
  srcMac: string;
  etherType: number;
}

export interface IPHeader {
  version: number;
  headerLength: number;
  typeOfService: number;
  totalLength: number;
  identification: number;
  flags: number;
  fragmentOffset: number;
  timeToLive: number;
  protocol: number;
  headerChecksum: number;
  srcIP: string;
  dstIP: string;
}

export interface TCPHeader {
  srcPort: number;
  dstPort: number;
  sequenceNumber: number;
  acknowledgmentNumber: number;
  headerLength: number;
  flags: {
    fin: boolean;
    syn: boolean;
    rst: boolean;
    psh: boolean;
    ack: boolean;
    urg: boolean;
  };
  windowSize: number;
  checksum: number;
  urgentPointer: number;
}

export interface UDPHeader {
  srcPort: number;
  dstPort: number;
  length: number;
  checksum: number;
}

export interface ParsedPacket {
  index: number;
  timestamp: number;
  packetHeader: PacketHeader;
  ethernet?: EthernetHeader;
  ip?: IPHeader;
  tcp?: TCPHeader;
  udp?: UDPHeader;
  payload: Uint8Array;
  rawData: Uint8Array;
  protocol: string;
  summary: string;
}

export interface BPFFilterRule {
  type: 'host' | 'port' | 'protocol' | 'direction';
  value: string | number;
  operator?: 'and' | 'or' | 'not';
}

export interface FileProcessingStats {
  totalPackets: number;
  processedPackets: number;
  fileSize: number;
  processingTime: number;
  errors: string[];
}

export interface PayloadDisplayOptions {
  showFull: boolean;
  truncateAt: number;
  format: 'hex' | 'ascii' | 'both';
}