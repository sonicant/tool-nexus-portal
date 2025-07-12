import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  sendHttpRequest,
  formatResponseBody,
  generateId,
  createDefaultHeader,
  getCommonHeaders,
  getStatusDescription,
  formatFileSize,
  formatResponseTime
} from '../../../src/tools/http-request-builder/utils';
import { HttpRequest, HttpMethod, ContentType } from '../../../src/tools/http-request-builder/types';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock DOMParser for XML formatting
class MockDOMParser {
  parseFromString(xmlString: string, mimeType: string) {
    // Simple mock that returns a basic document structure
    const mockDoc = {
      querySelector: vi.fn().mockReturnValue(null), // No parser errors
      documentElement: {
        tagName: 'root',
        attributes: [],
        childNodes: []
      }
    };
    
    // Simulate parsing error for invalid XML
    if (xmlString.includes('invalid')) {
      mockDoc.querySelector = vi.fn().mockReturnValue({ textContent: 'Parse error' });
    }
    
    return mockDoc;
  }
}

global.DOMParser = MockDOMParser as any;

describe('HTTP Request Builder Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
  });
  
  describe('sendHttpRequest', () => {
    it('should send GET request successfully', async () => {
      const mockResponse = {
        status: 200,
        statusText: 'OK',
        headers: new Map([['content-type', 'application/json']]),
        text: vi.fn().mockResolvedValue('{"message": "success"}')
      };
      
      mockResponse.headers.forEach = vi.fn((callback) => {
        callback('application/json', 'content-type');
      });
      
      // Add a small delay to simulate network request
      mockFetch.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(mockResponse), 1))
      );
      
      const request: HttpRequest = {
        method: 'GET',
        url: 'https://api.example.com/data',
        headers: [{ id: '1', key: 'Accept', value: 'application/json', enabled: true }],
        body: '',
        contentType: 'application/json'
      };
      
      const response = await sendHttpRequest(request);
      
      expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/data', {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        mode: 'cors',
        credentials: 'omit'
      });
      
      expect(response.status).toBe(200);
      expect(response.statusText).toBe('OK');
      expect(response.body).toBe('{"message": "success"}');
      expect(response.responseTime).toBeGreaterThanOrEqual(0);
    });
    
    it('should send POST request with body', async () => {
      const mockResponse = {
        status: 201,
        statusText: 'Created',
        headers: new Map(),
        text: vi.fn().mockResolvedValue('{"id": 123}')
      };
      
      mockResponse.headers.forEach = vi.fn();
      mockFetch.mockResolvedValue(mockResponse);
      
      const request: HttpRequest = {
        method: 'POST',
        url: 'https://api.example.com/users',
        headers: [{ id: '1', key: 'Authorization', value: 'Bearer token', enabled: true }],
        body: '{"name": "John Doe"}',
        contentType: 'application/json'
      };
      
      const response = await sendHttpRequest(request);
      
      expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/users', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer token',
          'Content-Type': 'application/json'
        },
        body: '{"name": "John Doe"}',
        mode: 'cors',
        credentials: 'omit'
      });
      
      expect(response.status).toBe(201);
    });
    
    it('should handle custom content type', async () => {
      const mockResponse = {
        status: 200,
        statusText: 'OK',
        headers: new Map(),
        text: vi.fn().mockResolvedValue('success')
      };
      
      mockResponse.headers.forEach = vi.fn();
      mockFetch.mockResolvedValue(mockResponse);
      
      const request: HttpRequest = {
        method: 'POST',
        url: 'https://api.example.com/data',
        headers: [],
        body: 'custom data',
        contentType: 'custom',
        customContentType: 'application/custom'
      };
      
      await sendHttpRequest(request);
      
      expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/custom'
        },
        body: 'custom data',
        mode: 'cors',
        credentials: 'omit'
      });
    });
    
    it('should filter disabled headers', async () => {
      const mockResponse = {
        status: 200,
        statusText: 'OK',
        headers: new Map(),
        text: vi.fn().mockResolvedValue('success')
      };
      
      mockResponse.headers.forEach = vi.fn();
      mockFetch.mockResolvedValue(mockResponse);
      
      const request: HttpRequest = {
        method: 'GET',
        url: 'https://api.example.com/data',
        headers: [
          { id: '1', key: 'Accept', value: 'application/json', enabled: true },
          { id: '2', key: 'Authorization', value: 'Bearer token', enabled: false },
          { id: '3', key: '', value: 'empty-key', enabled: true },
          { id: '4', key: 'Valid-Header', value: '', enabled: true }
        ],
        body: '',
        contentType: 'application/json'
      };
      
      await sendHttpRequest(request);
      
      expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/data', {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
          // Disabled, empty key, and empty value headers should be filtered out
        },
        mode: 'cors',
        credentials: 'omit'
      });
    });
    
    it('should handle fetch errors', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));
      
      const request: HttpRequest = {
        method: 'GET',
        url: 'https://api.example.com/data',
        headers: [],
        body: '',
        contentType: 'application/json'
      };
      
      await expect(sendHttpRequest(request)).rejects.toThrow('Request failed: Network error');
    });
  });
  
  describe('formatResponseBody', () => {
    it('should format valid JSON', () => {
      const jsonString = '{"name":"John","age":30}';
      const result = formatResponseBody(jsonString, 'application/json');
      
      expect(result.language).toBe('json');
      expect(result.isValid).toBe(true);
      expect(result.formatted).toBe(JSON.stringify({ name: 'John', age: 30 }, null, 2));
    });
    
    it('should handle invalid JSON', () => {
      const invalidJson = '{"name":"John","age":}';
      const result = formatResponseBody(invalidJson, 'application/json');
      
      expect(result.language).toBe('json');
      expect(result.isValid).toBe(false);
      expect(result.formatted).toBe(invalidJson);
      expect(result.error).toContain('Invalid JSON');
    });
    
    it('should detect JSON without content type', () => {
      const jsonString = '{"message": "hello"}';
      const result = formatResponseBody(jsonString);
      
      expect(result.language).toBe('json');
      expect(result.isValid).toBe(true);
    });
    
    it('should format XML', () => {
      const xmlString = '<root><item>value</item></root>';
      const result = formatResponseBody(xmlString, 'application/xml');
      
      expect(result.language).toBe('xml');
      expect(result.isValid).toBe(true);
    });
    
    it('should handle invalid XML', () => {
      const invalidXml = '<root><item>invalid</root>';
      const result = formatResponseBody(invalidXml, 'application/xml');
      
      expect(result.language).toBe('xml');
      expect(result.isValid).toBe(false);
    });
    
    it('should detect XML without content type', () => {
      const xmlString = '<root><item>value</item></root>';
      const result = formatResponseBody(xmlString);
      
      expect(result.language).toBe('xml');
      expect(result.isValid).toBe(true);
    });
    
    it('should handle HTML content type', () => {
      const htmlString = '<html><body>Hello</body></html>';
      const result = formatResponseBody(htmlString, 'text/html');
      
      expect(result.language).toBe('html');
      expect(result.isValid).toBe(true);
      expect(result.formatted).toBe(htmlString);
    });
    
    it('should handle CSS content type', () => {
      const cssString = 'body { color: red; }';
      const result = formatResponseBody(cssString, 'text/css');
      
      expect(result.language).toBe('css');
      expect(result.isValid).toBe(true);
    });
    
    it('should handle JavaScript content type', () => {
      const jsString = 'function hello() { return "world"; }';
      const result = formatResponseBody(jsString, 'application/javascript');
      
      expect(result.language).toBe('javascript');
      expect(result.isValid).toBe(true);
    });
    
    it('should handle empty body', () => {
      const result = formatResponseBody('', 'application/json');
      
      expect(result.language).toBe('text');
      expect(result.isValid).toBe(true);
      expect(result.formatted).toBe('');
    });
    
    it('should default to plain text', () => {
      const textString = 'Plain text response';
      const result = formatResponseBody(textString, 'text/plain');
      
      expect(result.language).toBe('text');
      expect(result.isValid).toBe(true);
      expect(result.formatted).toBe(textString);
    });
  });
  
  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      
      expect(id1).toBeTruthy();
      expect(id2).toBeTruthy();
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
      expect(typeof id2).toBe('string');
    });
  });
  
  describe('createDefaultHeader', () => {
    it('should create default header with correct structure', () => {
      const header = createDefaultHeader();
      
      expect(header).toHaveProperty('id');
      expect(header).toHaveProperty('key', '');
      expect(header).toHaveProperty('value', '');
      expect(header).toHaveProperty('enabled', true);
      expect(typeof header.id).toBe('string');
    });
  });
  
  describe('getCommonHeaders', () => {
    it('should return array of common header names', () => {
      const headers = getCommonHeaders();
      
      expect(Array.isArray(headers)).toBe(true);
      expect(headers.length).toBeGreaterThan(0);
      expect(headers).toContain('Accept');
      expect(headers).toContain('Authorization');
      expect(headers).toContain('Content-Type');
    });
  });
  
  describe('getStatusDescription', () => {
    it('should return correct descriptions for known status codes', () => {
      expect(getStatusDescription(200)).toBe('OK');
      expect(getStatusDescription(201)).toBe('Created');
      expect(getStatusDescription(400)).toBe('Bad Request');
      expect(getStatusDescription(404)).toBe('Not Found');
      expect(getStatusDescription(500)).toBe('Internal Server Error');
    });
    
    it('should return "Unknown" for unknown status codes', () => {
      expect(getStatusDescription(999)).toBe('Unknown');
      expect(getStatusDescription(123)).toBe('Unknown');
    });
  });
  
  describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 B');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1048576)).toBe('1 MB');
      expect(formatFileSize(1073741824)).toBe('1 GB');
      expect(formatFileSize(1536)).toBe('1.5 KB');
    });
  });
  
  describe('formatResponseTime', () => {
    it('should format response time correctly', () => {
      expect(formatResponseTime(500)).toBe('500ms');
      expect(formatResponseTime(1000)).toBe('1.00s');
      expect(formatResponseTime(1500)).toBe('1.50s');
      expect(formatResponseTime(2500)).toBe('2.50s');
    });
  });
});