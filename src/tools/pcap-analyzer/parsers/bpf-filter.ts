import { ParsedPacket, BPFFilterRule } from '../types/packet-types';

export class BPFFilter {
  private rules: BPFFilterRule[] = [];
  
  public parseFilter(filterString: string): BPFFilterRule[] {
    this.rules = [];
    
    if (!filterString.trim()) {
      return this.rules;
    }
    
    // Simple BPF parser - supports basic syntax
    const tokens = this.tokenize(filterString);
    this.parseTokens(tokens);
    
    return this.rules;
  }
  
  public applyFilter(packets: ParsedPacket[], filterString: string): ParsedPacket[] {
    if (!filterString.trim()) {
      return packets;
    }
    
    try {
      const rules = this.parseFilter(filterString);
      return packets.filter(packet => this.matchesRules(packet, rules));
    } catch (error) {
      console.warn('BPF filter error:', error);
      return packets;
    }
  }
  
  private tokenize(filterString: string): string[] {
    // Split by spaces but preserve quoted strings
    const tokens: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < filterString.length; i++) {
      const char = filterString[i];
      
      if (char === '"' || char === "'") {
        inQuotes = !inQuotes;
        current += char;
      } else if (char === ' ' && !inQuotes) {
        if (current.trim()) {
          tokens.push(current.trim());
          current = '';
        }
      } else {
        current += char;
      }
    }
    
    if (current.trim()) {
      tokens.push(current.trim());
    }
    
    return tokens;
  }
  
  private parseTokens(tokens: string[]): void {
    let i = 0;
    let currentOperator: 'and' | 'or' | 'not' | undefined;
    
    while (i < tokens.length) {
      const token = tokens[i].toLowerCase();
      
      if (token === 'and' || token === 'or' || token === 'not') {
        currentOperator = token as 'and' | 'or' | 'not';
        i++;
        continue;
      }
      
      // Parse different filter types
      if (token === 'host') {
        if (i + 1 < tokens.length) {
          this.rules.push({
            type: 'host',
            value: tokens[i + 1],
            operator: currentOperator
          });
          i += 2;
        } else {
          i++;
        }
      } else if (token === 'port') {
        if (i + 1 < tokens.length) {
          const portValue = parseInt(tokens[i + 1]);
          if (!isNaN(portValue)) {
            this.rules.push({
              type: 'port',
              value: portValue,
              operator: currentOperator
            });
          }
          i += 2;
        } else {
          i++;
        }
      } else if (token === 'tcp' || token === 'udp' || token === 'icmp') {
        this.rules.push({
          type: 'protocol',
          value: token,
          operator: currentOperator
        });
        i++;
      } else if (token === 'src' || token === 'dst') {
        if (i + 1 < tokens.length) {
          const nextToken = tokens[i + 1].toLowerCase();
          if (nextToken === 'host' && i + 2 < tokens.length) {
            this.rules.push({
              type: 'direction',
              value: `${token}_host_${tokens[i + 2]}`,
              operator: currentOperator
            });
            i += 3;
          } else if (nextToken === 'port' && i + 2 < tokens.length) {
            const portValue = parseInt(tokens[i + 2]);
            if (!isNaN(portValue)) {
              this.rules.push({
                type: 'direction',
                value: `${token}_port_${portValue}`,
                operator: currentOperator
              });
            }
            i += 3;
          } else {
            i++;
          }
        } else {
          i++;
        }
      } else {
        // Try to parse as IP address or port number
        if (this.isIPAddress(token)) {
          this.rules.push({
            type: 'host',
            value: token,
            operator: currentOperator
          });
        } else {
          const portValue = parseInt(token);
          if (!isNaN(portValue) && portValue > 0 && portValue <= 65535) {
            this.rules.push({
              type: 'port',
              value: portValue,
              operator: currentOperator
            });
          }
        }
        i++;
      }
      
      currentOperator = undefined;
    }
  }
  
  private matchesRules(packet: ParsedPacket, rules: BPFFilterRule[]): boolean {
    if (rules.length === 0) {
      return true;
    }
    
    let result = true;
    let hasAnyRule = false;
    
    for (const rule of rules) {
      const matches = this.matchesRule(packet, rule);
      
      if (!hasAnyRule) {
        result = matches;
        hasAnyRule = true;
      } else {
        switch (rule.operator) {
          case 'and':
            result = result && matches;
            break;
          case 'or':
            result = result || matches;
            break;
          case 'not':
            result = result && !matches;
            break;
          default:
            result = result && matches;
            break;
        }
      }
    }
    
    return result;
  }
  
  private matchesRule(packet: ParsedPacket, rule: BPFFilterRule): boolean {
    switch (rule.type) {
      case 'host':
        return this.matchesHost(packet, rule.value as string);
      case 'port':
        return this.matchesPort(packet, rule.value as number);
      case 'protocol':
        return this.matchesProtocol(packet, rule.value as string);
      case 'direction':
        return this.matchesDirection(packet, rule.value as string);
      default:
        return false;
    }
  }
  
  private matchesHost(packet: ParsedPacket, host: string): boolean {
    if (!packet.ip) return false;
    return packet.ip.srcIP === host || packet.ip.dstIP === host;
  }
  
  private matchesPort(packet: ParsedPacket, port: number): boolean {
    if (packet.tcp) {
      return packet.tcp.srcPort === port || packet.tcp.dstPort === port;
    }
    if (packet.udp) {
      return packet.udp.srcPort === port || packet.udp.dstPort === port;
    }
    return false;
  }
  
  private matchesProtocol(packet: ParsedPacket, protocol: string): boolean {
    const proto = protocol.toLowerCase();
    if (proto === 'tcp') {
      return packet.tcp !== undefined;
    }
    if (proto === 'udp') {
      return packet.udp !== undefined;
    }
    if (proto === 'icmp') {
      return packet.ip?.protocol === 1;
    }
    return false;
  }
  
  private matchesDirection(packet: ParsedPacket, direction: string): boolean {
    const parts = direction.split('_');
    if (parts.length < 3) return false;
    
    const dir = parts[0]; // src or dst
    const type = parts[1]; // host or port
    const value = parts.slice(2).join('_');
    
    if (type === 'host' && packet.ip) {
      if (dir === 'src') {
        return packet.ip.srcIP === value;
      } else if (dir === 'dst') {
        return packet.ip.dstIP === value;
      }
    } else if (type === 'port') {
      const portNum = parseInt(value);
      if (isNaN(portNum)) return false;
      
      if (packet.tcp) {
        if (dir === 'src') {
          return packet.tcp.srcPort === portNum;
        } else if (dir === 'dst') {
          return packet.tcp.dstPort === portNum;
        }
      }
      if (packet.udp) {
        if (dir === 'src') {
          return packet.udp.srcPort === portNum;
        } else if (dir === 'dst') {
          return packet.udp.dstPort === portNum;
        }
      }
    }
    
    return false;
  }
  
  private isIPAddress(str: string): boolean {
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipv4Regex.test(str);
  }
  
  public static getFilterExamples(): string[] {
    return [
      'host 192.168.1.1',
      'port 80',
      'tcp',
      'udp',
      'src host 10.0.0.1',
      'dst port 443',
      'host 192.168.1.1 and port 80',
      'tcp and port 22',
      'udp and port 53',
      'not port 22'
    ];
  }
}