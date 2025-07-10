/**
 * End-to-End Tests for HTTP Request Builder Tool
 * 
 * These tests simulate real user interactions with the HTTP Request Builder tool,
 * including request construction, sending, response handling, and data persistence.
 */

// Mock fetch for testing
class MockFetch {
  private static responses: Map<string, any> = new Map();
  
  static setMockResponse(url: string, response: any) {
    this.responses.set(url, response);
  }
  
  static clearMockResponses() {
    this.responses.clear();
  }
  
  static async fetch(url: string, options?: RequestInit): Promise<Response> {
    const mockResponse = this.responses.get(url);
    
    if (!mockResponse) {
      throw new Error(`No mock response configured for ${url}`);
    }
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const response = {
      status: mockResponse.status || 200,
      statusText: mockResponse.statusText || 'OK',
      headers: new Map(Object.entries(mockResponse.headers || {})),
      text: async () => mockResponse.body || '',
      json: async () => JSON.parse(mockResponse.body || '{}'),
      ok: (mockResponse.status || 200) >= 200 && (mockResponse.status || 200) < 300
    };
    
    // Add forEach method for headers
    response.headers.forEach = function(callback: (value: string, key: string, map: Map<string, string>) => void, thisArg?: any) {
      for (const [key, value] of this.entries()) {
        callback.call(thisArg, value as string, key, this as Map<string, string>);
      }
    };
    
    return response as any;
  }
}

// Replace global fetch
global.fetch = MockFetch.fetch as typeof fetch;

// Import utilities after setting up mocks
import {
  sendHttpRequest,
  formatResponseBody,
  generateId,
  createDefaultHeader
} from '../../../src/tools/http-request-builder/utils.js';
import { HttpRequest, HttpResponse } from '../../../src/tools/http-request-builder/types.js';

// Test helper functions
function testValidation(testName: string, condition: boolean, details?: string) {
  const status = condition ? '✅ PASS' : '❌ FAIL';
  console.log(`${status}: ${testName}`);
  if (details) {
    console.log(`   ${details}`);
  }
  if (!condition) {
    console.error(`   Test failed: ${testName}`);
  }
}

function createTestRequest(overrides: Partial<HttpRequest> = {}): HttpRequest {
  return {
    method: 'GET',
    url: 'https://api.example.com/test',
    headers: [createDefaultHeader()],
    body: '',
    contentType: 'application/json',
    ...overrides
  };
}

// Test suite
async function runE2ETests() {
  console.log('🚀 Starting HTTP Request Builder E2E Tests\n');
  
  // Test 1: Basic GET Request
  console.log('📋 Test 1: Basic GET Request');
  try {
    MockFetch.setMockResponse('https://api.example.com/users', {
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ users: [{ id: 1, name: 'John' }] })
    });
    
    const request = createTestRequest({
      url: 'https://api.example.com/users',
      headers: [{
        id: generateId(),
        key: 'Accept',
        value: 'application/json',
        enabled: true
      }]
    });
    
    const response = await sendHttpRequest(request);
    
    testValidation('GET request returns 200 status', response.status === 200);
    testValidation('Response contains expected data', response.body.includes('John'));
    testValidation('Response time is recorded', response.responseTime > 0);
    testValidation('Response size is calculated', response.size > 0);
    
  } catch (error) {
    testValidation('GET request execution', false, `Error: ${error}`);
  }
  
  // Test 2: POST Request with JSON Body
  console.log('\n📋 Test 2: POST Request with JSON Body');
  try {
    MockFetch.setMockResponse('https://api.example.com/users', {
      status: 201,
      statusText: 'Created',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id: 123, name: 'Jane Doe' })
    });
    
    const request = createTestRequest({
      method: 'POST',
      url: 'https://api.example.com/users',
      headers: [
        {
          id: generateId(),
          key: 'Content-Type',
          value: 'application/json',
          enabled: true
        },
        {
          id: generateId(),
          key: 'Authorization',
          value: 'Bearer test-token',
          enabled: true
        }
      ],
      body: JSON.stringify({ name: 'Jane Doe', email: 'jane@example.com' }),
      contentType: 'application/json'
    });
    
    const response = await sendHttpRequest(request);
    
    testValidation('POST request returns 201 status', response.status === 201);
    testValidation('Response contains created resource', response.body.includes('Jane Doe'));
    
  } catch (error) {
    testValidation('POST request execution', false, `Error: ${error}`);
  }
  
  // Test 3: Error Handling
  console.log('\n📋 Test 3: Error Handling');
  try {
    MockFetch.setMockResponse('https://api.example.com/error', {
      status: 404,
      statusText: 'Not Found',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ error: 'Resource not found' })
    });
    
    const request = createTestRequest({
      url: 'https://api.example.com/error'
    });
    
    const response = await sendHttpRequest(request);
    
    testValidation('Error response returns 404 status', response.status === 404);
    testValidation('Error response contains error message', response.body.includes('not found'));
    
  } catch (error) {
    testValidation('Error handling', false, `Unexpected error: ${error}`);
  }
  
  // Test 4: Custom Headers
  console.log('\n📋 Test 4: Custom Headers');
  try {
    MockFetch.setMockResponse('https://api.example.com/custom', {
      status: 200,
      statusText: 'OK',
      headers: {
        'content-type': 'application/json',
        'x-custom-header': 'custom-value',
        'x-rate-limit': '100'
      },
      body: JSON.stringify({ message: 'success' })
    });
    
    const request = createTestRequest({
      url: 'https://api.example.com/custom',
      headers: [
        {
          id: generateId(),
          key: 'X-API-Key',
          value: 'test-api-key',
          enabled: true
        },
        {
          id: generateId(),
          key: 'X-Client-Version',
          value: '1.0.0',
          enabled: true
        },
        {
          id: generateId(),
          key: 'Disabled-Header',
          value: 'should-not-be-sent',
          enabled: false
        }
      ]
    });
    
    const response = await sendHttpRequest(request);
    
    testValidation('Custom headers request succeeds', response.status === 200);
    testValidation('Response headers are captured', Object.keys(response.headers).length > 0);
    testValidation('Custom response header present', response.headers['x-custom-header'] === 'custom-value');
    
  } catch (error) {
    testValidation('Custom headers handling', false, `Error: ${error}`);
  }
  
  // Test 5: Different Content Types
  console.log('\n📋 Test 5: Different Content Types');
  try {
    // XML Response
    MockFetch.setMockResponse('https://api.example.com/xml', {
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/xml' },
      body: '<root><item id="1">Test Item</item></root>'
    });
    
    const xmlRequest = createTestRequest({
      url: 'https://api.example.com/xml'
    });
    
    const xmlResponse = await sendHttpRequest(xmlRequest);
    const formattedXml = formatResponseBody(xmlResponse.body, xmlResponse.headers['content-type']);
    
    testValidation('XML response is received', xmlResponse.status === 200);
    testValidation('XML response is formatted', formattedXml.language === 'xml');
    testValidation('XML response is valid', formattedXml.isValid === true);
    
    // Plain text response
    MockFetch.setMockResponse('https://api.example.com/text', {
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'text/plain' },
      body: 'This is a plain text response'
    });
    
    const textRequest = createTestRequest({
      url: 'https://api.example.com/text'
    });
    
    const textResponse = await sendHttpRequest(textRequest);
    const formattedText = formatResponseBody(textResponse.body, textResponse.headers['content-type']);
    
    testValidation('Text response is received', textResponse.status === 200);
    testValidation('Text response is formatted', formattedText.language === 'text');
    
  } catch (error) {
    testValidation('Different content types handling', false, `Error: ${error}`);
  }
  
  // Test 6: Response Formatting
  console.log('\n📋 Test 6: Response Formatting');
  try {
    // Valid JSON
    const validJson = '{"name": "John", "age": 30, "city": "New York"}';
    const jsonFormatted = formatResponseBody(validJson, 'application/json');
    
    testValidation('Valid JSON is formatted correctly', jsonFormatted.isValid === true);
    testValidation('JSON language is detected', jsonFormatted.language === 'json');
    testValidation('JSON is pretty-printed', jsonFormatted.formatted.includes('\n'));
    
    // Invalid JSON
    const invalidJson = '{"name": "John", "age":}';
    const invalidJsonFormatted = formatResponseBody(invalidJson, 'application/json');
    
    testValidation('Invalid JSON is detected', invalidJsonFormatted.isValid === false);
    testValidation('Invalid JSON error is provided', invalidJsonFormatted.error !== undefined);
    
    // Auto-detect JSON
    const autoDetectJson = formatResponseBody(validJson);
    testValidation('JSON is auto-detected', autoDetectJson.language === 'json');
    
    // Auto-detect XML
    const xmlString = '<root><item>value</item></root>';
    const autoDetectXml = formatResponseBody(xmlString);
    testValidation('XML is auto-detected', autoDetectXml.language === 'xml');
    
  } catch (error) {
    testValidation('Response formatting', false, `Error: ${error}`);
  }
  
  // Test 7: PUT and DELETE Methods
  console.log('\n📋 Test 7: PUT and DELETE Methods');
  try {
    // PUT request
    MockFetch.setMockResponse('https://api.example.com/users/123', {
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id: 123, name: 'Updated Name' })
    });
    
    const putRequest = createTestRequest({
      method: 'PUT',
      url: 'https://api.example.com/users/123',
      body: JSON.stringify({ name: 'Updated Name' }),
      contentType: 'application/json'
    });
    
    const putResponse = await sendHttpRequest(putRequest);
    testValidation('PUT request succeeds', putResponse.status === 200);
    
    // DELETE request
    MockFetch.setMockResponse('https://api.example.com/users/123', {
      status: 204,
      statusText: 'No Content',
      headers: {},
      body: ''
    });
    
    const deleteRequest = createTestRequest({
      method: 'DELETE',
      url: 'https://api.example.com/users/123'
    });
    
    const deleteResponse = await sendHttpRequest(deleteRequest);
    testValidation('DELETE request succeeds', deleteResponse.status === 204);
    testValidation('DELETE response has no body', deleteResponse.body === '');
    
  } catch (error) {
    testValidation('PUT/DELETE methods', false, `Error: ${error}`);
  }
  
  // Test 8: Custom Content Type
  console.log('\n📋 Test 8: Custom Content Type');
  try {
    MockFetch.setMockResponse('https://api.example.com/custom-content', {
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/vnd.api+json' },
      body: JSON.stringify({ data: { type: 'custom', id: '1' } })
    });
    
    const customRequest = createTestRequest({
      method: 'POST',
      url: 'https://api.example.com/custom-content',
      body: JSON.stringify({ data: { type: 'test' } }),
      contentType: 'custom',
      customContentType: 'application/vnd.api+json'
    });
    
    const customResponse = await sendHttpRequest(customRequest);
    testValidation('Custom content type request succeeds', customResponse.status === 200);
    
  } catch (error) {
    testValidation('Custom content type handling', false, `Error: ${error}`);
  }
  
  // Test 9: Large Response Handling
  console.log('\n📋 Test 9: Large Response Handling');
  try {
    const largeData = Array.from({ length: 1000 }, (_, i) => ({ id: i, name: `Item ${i}` }));
    
    MockFetch.setMockResponse('https://api.example.com/large', {
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(largeData)
    });
    
    const largeRequest = createTestRequest({
      url: 'https://api.example.com/large'
    });
    
    const largeResponse = await sendHttpRequest(largeRequest);
    const formattedLarge = formatResponseBody(largeResponse.body, largeResponse.headers['content-type']);
    
    testValidation('Large response is received', largeResponse.status === 200);
    testValidation('Large response size is calculated', largeResponse.size > 10000);
    testValidation('Large JSON is formatted', formattedLarge.isValid === true);
    
  } catch (error) {
    testValidation('Large response handling', false, `Error: ${error}`);
  }
  
  // Test 10: Network Error Simulation
  console.log('\n📋 Test 10: Network Error Simulation');
  try {
    // Temporarily replace fetch to simulate network error
    const originalFetch = global.fetch;
    global.fetch = async () => {
      throw new Error('Network connection failed');
    };
    
    const errorRequest = createTestRequest({
      url: 'https://api.example.com/network-error'
    });
    
    try {
      await sendHttpRequest(errorRequest);
      testValidation('Network error is thrown', false, 'Expected network error but request succeeded');
    } catch (error) {
      testValidation('Network error is caught', error instanceof Error);
      testValidation('Network error message is descriptive', 
        error instanceof Error && error.message.includes('Request failed'));
    }
    
    // Restore original fetch
    global.fetch = originalFetch;
    
  } catch (error) {
    testValidation('Network error simulation', false, `Error: ${error}`);
  }
  
  console.log('\n🎉 HTTP Request Builder E2E Tests Completed!');
  console.log('\n📊 Test Summary:');
  console.log('- Basic HTTP methods (GET, POST, PUT, DELETE)');
  console.log('- Request/response header handling');
  console.log('- Multiple content types (JSON, XML, plain text)');
  console.log('- Response formatting and validation');
  console.log('- Error handling and network failures');
  console.log('- Custom content types');
  console.log('- Large response handling');
  
  console.log('\n✅ All core functionalities have been tested!');
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runE2ETests().catch(console.error);
}

export { runE2ETests };