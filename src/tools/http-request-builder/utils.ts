import { HttpRequest, HttpResponse, FormattedResponse, HttpHeader } from './types.js';

/**
 * Send HTTP request using fetch API
 */
export async function sendHttpRequest(request: HttpRequest): Promise<HttpResponse> {
  const startTime = Date.now();
  
  try {
    // Prepare headers
    const headers: Record<string, string> = {};
    
    // Add enabled headers
    request.headers
      .filter(header => header.enabled && header.key.trim() && header.value.trim())
      .forEach(header => {
        headers[header.key.trim()] = header.value.trim();
      });
    
    // Set content type if body is present and method supports body
    if (request.body && ['POST', 'PUT', 'PATCH'].includes(request.method)) {
      const contentType = request.contentType === 'custom' 
        ? request.customContentType || 'text/plain'
        : request.contentType;
      
      if (contentType && !headers['Content-Type']) {
        headers['Content-Type'] = contentType;
      }
    }
    
    // Prepare fetch options
    const fetchOptions: RequestInit = {
      method: request.method,
      headers,
      mode: 'cors',
      credentials: 'omit'
    };
    
    // Add body for methods that support it
    if (request.body && ['POST', 'PUT', 'PATCH'].includes(request.method)) {
      fetchOptions.body = request.body;
    }
    
    // Send request
    const response = await fetch(request.url, fetchOptions);
    const endTime = Date.now();
    
    // Get response body
    const responseBody = await response.text();
    
    // Extract response headers
    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });
    
    // Calculate response size (approximate)
    const size = new Blob([responseBody]).size;
    
    return {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      body: responseBody,
      responseTime: endTime - startTime,
      size
    };
  } catch (error) {
    const endTime = Date.now();
    throw new Error(`Request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Format response body based on content type
 */
export function formatResponseBody(body: string, contentType?: string): FormattedResponse {
  if (!body.trim()) {
    return {
      formatted: '',
      language: 'text',
      isValid: true
    };
  }
  
  const lowerContentType = contentType?.toLowerCase() || '';
  
  // JSON formatting
  if (lowerContentType.includes('json') || isJsonString(body)) {
    try {
      const parsed = JSON.parse(body);
      return {
        formatted: JSON.stringify(parsed, null, 2),
        language: 'json',
        isValid: true
      };
    } catch (error) {
      return {
        formatted: body,
        language: 'json',
        isValid: false,
        error: `Invalid JSON: ${error instanceof Error ? error.message : 'Parse error'}`
      };
    }
  }
  
  // XML formatting
  if (lowerContentType.includes('xml') || isXmlString(body)) {
    try {
      const formatted = formatXml(body);
      return {
        formatted,
        language: 'xml',
        isValid: true
      };
    } catch (error) {
      return {
        formatted: body,
        language: 'xml',
        isValid: false,
        error: `Invalid XML: ${error instanceof Error ? error.message : 'Parse error'}`
      };
    }
  }
  
  // HTML formatting
  if (lowerContentType.includes('html')) {
    return {
      formatted: body,
      language: 'html',
      isValid: true
    };
  }
  
  // CSS formatting
  if (lowerContentType.includes('css')) {
    return {
      formatted: body,
      language: 'css',
      isValid: true
    };
  }
  
  // JavaScript formatting
  if (lowerContentType.includes('javascript') || lowerContentType.includes('js')) {
    return {
      formatted: body,
      language: 'javascript',
      isValid: true
    };
  }
  
  // Default to plain text
  return {
    formatted: body,
    language: 'text',
    isValid: true
  };
}

/**
 * Check if string is valid JSON
 */
function isJsonString(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if string is XML
 */
function isXmlString(str: string): boolean {
  const trimmed = str.trim();
  return trimmed.startsWith('<') && trimmed.includes('>');
}

/**
 * Format XML string with indentation
 */
function formatXml(xml: string): string {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'text/xml');
    
    // Check for parsing errors
    const parserError = doc.querySelector('parsererror');
    if (parserError) {
      throw new Error('XML parsing error');
    }
    
    return formatXmlNode(doc, 0);
  } catch {
    // Fallback to simple formatting
    return xml.replace(/></g, '>\n<');
  }
}

/**
 * Format XML node recursively
 */
function formatXmlNode(node: Node, indent: number): string {
  const indentStr = '  '.repeat(indent);
  
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent?.trim();
    return text ? text : '';
  }
  
  if (node.nodeType === Node.ELEMENT_NODE) {
    const element = node as Element;
    let result = `${indentStr}<${element.tagName}`;
    
    // Add attributes
    for (let i = 0; i < element.attributes.length; i++) {
      const attr = element.attributes[i];
      result += ` ${attr.name}="${attr.value}"`;
    }
    
    if (element.childNodes.length === 0) {
      result += ' />';
    } else {
      result += '>';
      
      const hasElementChildren = Array.from(element.childNodes)
        .some(child => child.nodeType === Node.ELEMENT_NODE);
      
      if (hasElementChildren) {
        result += '\n';
        for (let i = 0; i < element.childNodes.length; i++) {
          const childResult = formatXmlNode(element.childNodes[i], indent + 1);
          if (childResult) {
            result += childResult + '\n';
          }
        }
        result += `${indentStr}</${element.tagName}>`;
      } else {
        // Only text content
        const textContent = element.textContent?.trim();
        result += textContent + `</${element.tagName}>`;
      }
    }
    
    return result;
  }
  
  return '';
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Create default header
 */
export function createDefaultHeader(): HttpHeader {
  return {
    id: generateId(),
    key: '',
    value: '',
    enabled: true
  };
}

/**
 * Get common headers suggestions
 */
export function getCommonHeaders(): string[] {
  return [
    'Accept',
    'Accept-Encoding',
    'Accept-Language',
    'Authorization',
    'Cache-Control',
    'Content-Type',
    'Cookie',
    'Origin',
    'Referer',
    'User-Agent',
    'X-API-Key',
    'X-Requested-With'
  ];
}

/**
 * Get status code description
 */
export function getStatusDescription(status: number): string {
  const statusMap: Record<number, string> = {
    200: 'OK',
    201: 'Created',
    204: 'No Content',
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    405: 'Method Not Allowed',
    429: 'Too Many Requests',
    500: 'Internal Server Error',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
    504: 'Gateway Timeout'
  };
  
  return statusMap[status] || 'Unknown';
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Format response time
 */
export function formatResponseTime(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  return `${(ms / 1000).toFixed(2)}s`;
}