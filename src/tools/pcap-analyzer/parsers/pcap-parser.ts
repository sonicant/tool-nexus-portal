import {
  PcapHeader,
  PacketHeader,
  EthernetHeader,
  IPHeader,
  TCPHeader,
  UDPHeader,
  ParsedPacket,
  FileProcessingStats
} from '../types/packet-types';

export class PcapParser {
  private static readonly PCAP_MAGIC_NUMBER = 0xa1b2c3d4;
  private static readonly PCAP_MAGIC_NUMBER_SWAPPED = 0xd4c3b2a1;
  
  private littleEndian = true;
  private pcapHeader: PcapHeader | null = null;
  private packets: ParsedPacket[] = [];
  
  public async parseFile(file: File): Promise<{ packets: ParsedPacket[], stats: FileProcessingStats }> {
    const startTime = Date.now();
    const stats: FileProcessingStats = {
      totalPackets: 0,
      processedPackets: 0,
      fileSize: file.size,
      processingTime: 0,
      errors: []
    };
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const dataView = new DataView(arrayBuffer);
      
      // Parse PCAP header
      this.pcapHeader = this.parsePcapHeader(dataView);
      
      // Parse packets
      let offset = 24; // PCAP header size
      let packetIndex = 0;
      
      while (offset < arrayBuffer.byteLength) {
        try {
          const packet = this.parsePacket(dataView, offset, packetIndex);
          if (packet) {
            this.packets.push(packet);
            stats.processedPackets++;
            offset += 16 + packet.packetHeader.inclLen; // packet header + data
          } else {
            break;
          }
          packetIndex++;
        } catch (error) {
          stats.errors.push(`Packet ${packetIndex}: ${error}`);
          break;
        }
      }
      
      stats.totalPackets = packetIndex;
      stats.processingTime = Date.now() - startTime;
      
      return { packets: this.packets, stats };
    } catch (error) {
      stats.errors.push(`File parsing error: ${error}`);
      stats.processingTime = Date.now() - startTime;
      return { packets: [], stats };
    }
  }
  
  private parsePcapHeader(dataView: DataView): PcapHeader {
    const magicNumber = dataView.getUint32(0, true);
    
    if (magicNumber === PcapParser.PCAP_MAGIC_NUMBER) {
      this.littleEndian = true;
    } else if (magicNumber === PcapParser.PCAP_MAGIC_NUMBER_SWAPPED) {
      this.littleEndian = false;
    } else {
      throw new Error('Invalid PCAP file: magic number mismatch');
    }
    
    return {
      magicNumber,
      versionMajor: dataView.getUint16(4, this.littleEndian),
      versionMinor: dataView.getUint16(6, this.littleEndian),
      thiszone: dataView.getInt32(8, this.littleEndian),
      sigfigs: dataView.getUint32(12, this.littleEndian),
      snaplen: dataView.getUint32(16, this.littleEndian),
      network: dataView.getUint32(20, this.littleEndian)
    };
  }
  
  private parsePacket(dataView: DataView, offset: number, index: number): ParsedPacket | null {
    if (offset + 16 > dataView.byteLength) {
      return null;
    }
    
    // Parse packet header
    const packetHeader: PacketHeader = {
      tsSec: dataView.getUint32(offset, this.littleEndian),
      tsUsec: dataView.getUint32(offset + 4, this.littleEndian),
      inclLen: dataView.getUint32(offset + 8, this.littleEndian),
      origLen: dataView.getUint32(offset + 12, this.littleEndian)
    };
    
    const dataOffset = offset + 16;
    if (dataOffset + packetHeader.inclLen > dataView.byteLength) {
      return null;
    }
    
    // Extract raw packet data
    const rawData = new Uint8Array(dataView.buffer, dataOffset, packetHeader.inclLen);
    
    // Parse protocol layers
    const ethernet = this.parseEthernet(rawData);
    let ip: IPHeader | undefined;
    let tcp: TCPHeader | undefined;
    let udp: UDPHeader | undefined;
    let protocol = 'Unknown';
    let payload = rawData;
    
    if (ethernet && (ethernet.etherType === 0x0800 || ethernet.etherType === 0x86dd)) {
      const ipOffset = 14; // Ethernet header size
      ip = this.parseIP(rawData, ipOffset);
      
      if (ip) {
        const ipHeaderSize = ip.headerLength * 4;
        const transportOffset = ipOffset + ipHeaderSize;
        
        if (ip.protocol === 6) { // TCP
          tcp = this.parseTCP(rawData, transportOffset);
          protocol = 'TCP';
          if (tcp) {
            const tcpHeaderSize = tcp.headerLength * 4;
            payload = rawData.slice(transportOffset + tcpHeaderSize);
          }
        } else if (ip.protocol === 17) { // UDP
          udp = this.parseUDP(rawData, transportOffset);
          protocol = 'UDP';
          payload = rawData.slice(transportOffset + 8); // UDP header is 8 bytes
        } else {
          protocol = `IP Protocol ${ip.protocol}`;
          payload = rawData.slice(transportOffset);
        }
      }
    }
    
    const timestamp = packetHeader.tsSec * 1000 + Math.floor(packetHeader.tsUsec / 1000);
    const summary = this.generateSummary(ethernet, ip, tcp, udp, protocol);
    
    return {
      index,
      timestamp,
      packetHeader,
      ethernet,
      ip,
      tcp,
      udp,
      payload,
      rawData,
      protocol,
      summary
    };
  }
  
  private parseEthernet(data: Uint8Array): EthernetHeader | undefined {
    if (data.length < 14) return undefined;
    
    const dstMac = Array.from(data.slice(0, 6))
      .map(b => b.toString(16).padStart(2, '0'))
      .join(':');
    
    const srcMac = Array.from(data.slice(6, 12))
      .map(b => b.toString(16).padStart(2, '0'))
      .join(':');
    
    const etherType = (data[12] << 8) | data[13];
    
    return { dstMac, srcMac, etherType };
  }
  
  private parseIP(data: Uint8Array, offset: number): IPHeader | undefined {
    if (offset + 20 > data.length) return undefined;
    
    const version = (data[offset] >> 4) & 0x0f;
    if (version !== 4) return undefined; // Only IPv4 for now
    
    const headerLength = data[offset] & 0x0f;
    const typeOfService = data[offset + 1];
    const totalLength = (data[offset + 2] << 8) | data[offset + 3];
    const identification = (data[offset + 4] << 8) | data[offset + 5];
    const flagsAndFragment = (data[offset + 6] << 8) | data[offset + 7];
    const flags = (flagsAndFragment >> 13) & 0x07;
    const fragmentOffset = flagsAndFragment & 0x1fff;
    const timeToLive = data[offset + 8];
    const protocol = data[offset + 9];
    const headerChecksum = (data[offset + 10] << 8) | data[offset + 11];
    
    const srcIP = `${data[offset + 12]}.${data[offset + 13]}.${data[offset + 14]}.${data[offset + 15]}`;
    const dstIP = `${data[offset + 16]}.${data[offset + 17]}.${data[offset + 18]}.${data[offset + 19]}`;
    
    return {
      version,
      headerLength,
      typeOfService,
      totalLength,
      identification,
      flags,
      fragmentOffset,
      timeToLive,
      protocol,
      headerChecksum,
      srcIP,
      dstIP
    };
  }
  
  private parseTCP(data: Uint8Array, offset: number): TCPHeader | undefined {
    if (offset + 20 > data.length) return undefined;
    
    const srcPort = (data[offset] << 8) | data[offset + 1];
    const dstPort = (data[offset + 2] << 8) | data[offset + 3];
    const sequenceNumber = (data[offset + 4] << 24) | (data[offset + 5] << 16) | (data[offset + 6] << 8) | data[offset + 7];
    const acknowledgmentNumber = (data[offset + 8] << 24) | (data[offset + 9] << 16) | (data[offset + 10] << 8) | data[offset + 11];
    const headerLength = (data[offset + 12] >> 4) & 0x0f;
    const flagsByte = data[offset + 13];
    const windowSize = (data[offset + 14] << 8) | data[offset + 15];
    const checksum = (data[offset + 16] << 8) | data[offset + 17];
    const urgentPointer = (data[offset + 18] << 8) | data[offset + 19];
    
    const flags = {
      fin: (flagsByte & 0x01) !== 0,
      syn: (flagsByte & 0x02) !== 0,
      rst: (flagsByte & 0x04) !== 0,
      psh: (flagsByte & 0x08) !== 0,
      ack: (flagsByte & 0x10) !== 0,
      urg: (flagsByte & 0x20) !== 0
    };
    
    return {
      srcPort,
      dstPort,
      sequenceNumber,
      acknowledgmentNumber,
      headerLength,
      flags,
      windowSize,
      checksum,
      urgentPointer
    };
  }
  
  private parseUDP(data: Uint8Array, offset: number): UDPHeader | undefined {
    if (offset + 8 > data.length) return undefined;
    
    return {
      srcPort: (data[offset] << 8) | data[offset + 1],
      dstPort: (data[offset + 2] << 8) | data[offset + 3],
      length: (data[offset + 4] << 8) | data[offset + 5],
      checksum: (data[offset + 6] << 8) | data[offset + 7]
    };
  }
  
  private generateSummary(
    ethernet?: EthernetHeader,
    ip?: IPHeader,
    tcp?: TCPHeader,
    udp?: UDPHeader,
    protocol?: string
  ): string {
    if (!ip) return 'Non-IP packet';
    
    let summary = `${ip.srcIP} → ${ip.dstIP}`;
    
    if (tcp) {
      summary += ` TCP ${tcp.srcPort}→${tcp.dstPort}`;
      const flags = [];
      if (tcp.flags.syn) flags.push('SYN');
      if (tcp.flags.ack) flags.push('ACK');
      if (tcp.flags.fin) flags.push('FIN');
      if (tcp.flags.rst) flags.push('RST');
      if (flags.length > 0) {
        summary += ` [${flags.join(', ')}]`;
      }
    } else if (udp) {
      summary += ` UDP ${udp.srcPort}→${udp.dstPort}`;
    } else {
      summary += ` ${protocol}`;
    }
    
    return summary;
  }
}