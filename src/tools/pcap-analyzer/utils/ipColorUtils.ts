// IP地址颜色编码工具函数

// 为IP地址生成一致的哈希值
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 转换为32位整数
  }
  return Math.abs(hash);
}

// 生成浅色系颜色
function generateLightColor(hash: number): string {
  // 使用HSL颜色空间生成浅色
  const hue = hash % 360; // 色相 0-360
  const saturation = 40 + (hash % 30); // 饱和度 40-70%
  const lightness = 85 + (hash % 10); // 亮度 85-95%
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

// IP地址颜色缓存
const ipColorCache = new Map<string, string>();

// 为IP地址获取唯一的浅色
export function getIpColor(ip: string): string {
  if (ipColorCache.has(ip)) {
    return ipColorCache.get(ip)!;
  }
  
  const hash = hashString(ip);
  const color = generateLightColor(hash);
  ipColorCache.set(ip, color);
  
  return color;
}

// 获取IP地址的文本颜色（确保在浅色背景上可读）
export function getIpTextColor(): string {
  // 始终返回黑色，确保在浅色背景上可读
  return '#000000';
}

// 清除颜色缓存（在需要重置时使用）
export function clearIpColorCache(): void {
  ipColorCache.clear();
}

// 检查字符串是否为IP地址
export function isIpAddress(str: string): boolean {
  // IPv4正则表达式
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  // IPv6正则表达式（简化版）
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^::$/;
  
  return ipv4Regex.test(str) || ipv6Regex.test(str);
}