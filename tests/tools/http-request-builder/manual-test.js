/**
 * Manual Test Script for HTTP Request Builder Tool
 * 
 * This script provides a comprehensive manual testing checklist for the HTTP Request Builder tool.
 * It covers all major functionalities and edge cases that should be tested manually.
 */

console.log('🧪 HTTP Request Builder - Manual Testing Guide');
console.log('='.repeat(60));
console.log('');

// Test data for manual testing
const testData = {
  publicApis: [
    {
      name: 'JSONPlaceholder - Posts',
      url: 'https://jsonplaceholder.typicode.com/posts',
      method: 'GET',
      description: 'Free fake API for testing and prototyping'
    },
    {
      name: 'JSONPlaceholder - Create Post',
      url: 'https://jsonplaceholder.typicode.com/posts',
      method: 'POST',
      headers: [{ key: 'Content-Type', value: 'application/json' }],
      body: JSON.stringify({
        title: 'Test Post',
        body: 'This is a test post created via HTTP Request Builder',
        userId: 1
      }),
      description: 'Create a new post'
    },
    {
      name: 'HTTPBin - GET with Query Params',
      url: 'https://httpbin.org/get?param1=value1&param2=value2',
      method: 'GET',
      description: 'Test GET request with query parameters'
    },
    {
      name: 'HTTPBin - POST JSON',
      url: 'https://httpbin.org/post',
      method: 'POST',
      headers: [{ key: 'Content-Type', value: 'application/json' }],
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        timestamp: new Date().toISOString()
      }),
      description: 'Test POST request with JSON body'
    },
    {
      name: 'HTTPBin - Custom Headers',
      url: 'https://httpbin.org/headers',
      method: 'GET',
      headers: [
        { key: 'X-Custom-Header', value: 'CustomValue' },
        { key: 'User-Agent', value: 'HTTP-Request-Builder/1.0' },
        { key: 'Accept', value: 'application/json' }
      ],
      description: 'Test request with custom headers'
    },
    {
      name: 'Cat Facts API',
      url: 'https://catfact.ninja/fact',
      method: 'GET',
      description: 'Get a random cat fact (JSON response)'
    },
    {
      name: 'Dog API',
      url: 'https://dog.ceo/api/breeds/image/random',
      method: 'GET',
      description: 'Get a random dog image URL'
    }
  ],
  
  sampleBodies: {
    json: {
      simple: JSON.stringify({ message: 'Hello World' }, null, 2),
      complex: JSON.stringify({
        user: {
          id: 123,
          name: 'John Doe',
          email: 'john@example.com',
          preferences: {
            theme: 'dark',
            notifications: true,
            language: 'en'
          }
        },
        metadata: {
          timestamp: new Date().toISOString(),
          version: '1.0.0'
        }
      }, null, 2)
    },
    xml: {
      simple: '<root>\n  <message>Hello World</message>\n</root>',
      complex: `<user>
  <id>123</id>
  <name>John Doe</name>
  <email>john@example.com</email>
  <preferences>
    <theme>dark</theme>
    <notifications>true</notifications>
  </preferences>
</user>`
    },
    form: 'name=John+Doe&email=john%40example.com&message=Hello+World',
    text: 'This is a plain text message for testing purposes.'
  }
};

// Manual test cases
const manualTests = [
  {
    category: '🌐 Basic Request Functionality',
    tests: [
      {
        name: 'Send GET Request',
        steps: [
          '1. Select GET method',
          '2. Enter URL: https://jsonplaceholder.typicode.com/posts/1',
          '3. Click Send button',
          '4. Verify response shows post data with status 200',
          '5. Check response time and size are displayed'
        ],
        expected: 'Should receive JSON response with post data'
      },
      {
        name: 'Send POST Request',
        steps: [
          '1. Select POST method',
          '2. Enter URL: https://httpbin.org/post',
          '3. Add Content-Type: application/json header',
          '4. Add JSON body: {"test": "data"}',
          '5. Click Send button',
          '6. Verify response echoes the sent data'
        ],
        expected: 'Should receive response containing the sent JSON data'
      },
      {
        name: 'Send PUT Request',
        steps: [
          '1. Select PUT method',
          '2. Enter URL: https://jsonplaceholder.typicode.com/posts/1',
          '3. Add JSON body with updated data',
          '4. Send request and verify response'
        ],
        expected: 'Should receive updated resource data'
      },
      {
        name: 'Send DELETE Request',
        steps: [
          '1. Select DELETE method',
          '2. Enter URL: https://jsonplaceholder.typicode.com/posts/1',
          '3. Send request',
          '4. Verify response status (usually 200 or 204)'
        ],
        expected: 'Should receive successful deletion response'
      }
    ]
  },
  {
    category: '📋 Headers Management',
    tests: [
      {
        name: 'Add Custom Headers',
        steps: [
          '1. Click + button to add new header',
          '2. Enter header name: X-API-Key',
          '3. Enter header value: test-key-123',
          '4. Verify header is added to list',
          '5. Send request to https://httpbin.org/headers',
          '6. Verify custom header appears in response'
        ],
        expected: 'Custom header should be included in request and visible in response'
      },
      {
        name: 'Disable/Enable Headers',
        steps: [
          '1. Add multiple headers',
          '2. Toggle some headers off using the switch',
          '3. Send request',
          '4. Verify only enabled headers are sent'
        ],
        expected: 'Only enabled headers should be included in request'
      },
      {
        name: 'Remove Headers',
        steps: [
          '1. Add several headers',
          '2. Click trash icon to remove a header',
          '3. Verify header is removed from list',
          '4. Ensure at least one header remains (cannot remove all)'
        ],
        expected: 'Selected header should be removed, minimum one header maintained'
      },
      {
        name: 'Common Headers Autocomplete',
        steps: [
          '1. Click in header name field',
          '2. Start typing "Auth"',
          '3. Verify autocomplete suggestions appear',
          '4. Select "Authorization" from suggestions'
        ],
        expected: 'Common headers should be suggested via autocomplete'
      }
    ]
  },
  {
    category: '📝 Request Body Handling',
    tests: [
      {
        name: 'JSON Body',
        steps: [
          '1. Select POST method',
          '2. Set Content-Type to JSON',
          '3. Enter valid JSON in body textarea',
          '4. Send request to https://httpbin.org/post',
          '5. Verify JSON is properly sent and echoed back'
        ],
        expected: 'JSON body should be sent correctly and formatted in response'
      },
      {
        name: 'XML Body',
        steps: [
          '1. Select POST method',
          '2. Set Content-Type to XML',
          '3. Enter XML content in body',
          '4. Send request',
          '5. Verify XML is sent correctly'
        ],
        expected: 'XML body should be sent with correct content type'
      },
      {
        name: 'Form Data',
        steps: [
          '1. Select POST method',
          '2. Set Content-Type to Form URL Encoded',
          '3. Enter form data: name=test&value=123',
          '4. Send request to https://httpbin.org/post',
          '5. Verify form data is parsed correctly'
        ],
        expected: 'Form data should be sent and parsed correctly'
      },
      {
        name: 'Custom Content Type',
        steps: [
          '1. Select POST method',
          '2. Set Content-Type to Custom',
          '3. Enter custom type: application/vnd.api+json',
          '4. Add appropriate body content',
          '5. Send request and verify custom type is used'
        ],
        expected: 'Custom content type should be applied to request'
      },
      {
        name: 'Body Toggle',
        steps: [
          '1. Select POST method',
          '2. Toggle body section off',
          '3. Verify body section is hidden',
          '4. Toggle back on and verify it reappears'
        ],
        expected: 'Body section should show/hide based on toggle state'
      }
    ]
  },
  {
    category: '📊 Response Handling',
    tests: [
      {
        name: 'JSON Response Formatting',
        steps: [
          '1. Send GET request to https://jsonplaceholder.typicode.com/posts/1',
          '2. Switch to Response tab',
          '3. Verify JSON is formatted with proper indentation',
          '4. Check that JSON badge shows "json" language',
          '5. Verify green checkmark indicates valid JSON'
        ],
        expected: 'JSON response should be pretty-printed and validated'
      },
      {
        name: 'XML Response Formatting',
        steps: [
          '1. Send request that returns XML',
          '2. Verify XML is formatted with proper indentation',
          '3. Check XML language badge',
          '4. Verify validation status'
        ],
        expected: 'XML response should be formatted and validated'
      },
      {
        name: 'Error Response Handling',
        steps: [
          '1. Send request to https://httpbin.org/status/404',
          '2. Verify error status (404) is displayed in red',
          '3. Check that error response body is shown',
          '4. Verify response time is still recorded'
        ],
        expected: 'Error responses should be clearly indicated with appropriate styling'
      },
      {
        name: 'Response Headers Display',
        steps: [
          '1. Send any request',
          '2. Check Response Headers section',
          '3. Verify all response headers are displayed',
          '4. Check header names and values are properly formatted'
        ],
        expected: 'All response headers should be clearly displayed'
      },
      {
        name: 'Response Metrics',
        steps: [
          '1. Send request',
          '2. Verify response time is displayed (e.g., "150ms" or "1.25s")',
          '3. Verify response size is shown (e.g., "1.2 KB")',
          '4. Check status code and description'
        ],
        expected: 'Response metrics should be accurate and well-formatted'
      }
    ]
  },
  {
    category: '💾 Data Persistence',
    tests: [
      {
        name: 'Request History',
        steps: [
          '1. Send several different requests',
          '2. Switch to History tab',
          '3. Verify all requests are listed with timestamps',
          '4. Click on a history item to reload it',
          '5. Verify request is restored correctly'
        ],
        expected: 'Request history should be maintained and restorable'
      },
      {
        name: 'Save and Load Presets',
        steps: [
          '1. Configure a complex request with headers and body',
          '2. Click Save button',
          '3. Enter preset name and save',
          '4. Switch to Presets tab',
          '5. Verify preset is listed',
          '6. Load preset and verify all settings are restored'
        ],
        expected: 'Presets should save and restore complete request configuration'
      },
      {
        name: 'Clear History',
        steps: [
          '1. Ensure there are items in history',
          '2. Go to History tab',
          '3. Click "Clear All" button',
          '4. Verify history is empty',
          '5. Refresh page and verify history remains empty'
        ],
        expected: 'History should be completely cleared and persist after refresh'
      },
      {
        name: 'Delete Presets',
        steps: [
          '1. Create some presets',
          '2. Go to Presets tab',
          '3. Delete individual presets using trash button',
          '4. Verify presets are removed',
          '5. Test "Clear All" for presets'
        ],
        expected: 'Presets should be deletable individually and in bulk'
      }
    ]
  },
  {
    category: '🎨 User Interface',
    tests: [
      {
        name: 'Tab Navigation',
        steps: [
          '1. Click through all tabs (Request, Response, History, Presets)',
          '2. Verify each tab displays appropriate content',
          '3. Check that tab state is maintained during interactions'
        ],
        expected: 'Tab navigation should be smooth and maintain state'
      },
      {
        name: 'Loading States',
        steps: [
          '1. Send request to slow endpoint',
          '2. Verify Send button shows loading spinner',
          '3. Verify button is disabled during request',
          '4. Check that loading state clears after response'
        ],
        expected: 'Loading states should provide clear feedback'
      },
      {
        name: 'Form Validation',
        steps: [
          '1. Try to send request with empty URL',
          '2. Verify error message appears',
          '3. Enter invalid URL and test behavior',
          '4. Verify Send button is disabled when appropriate'
        ],
        expected: 'Form validation should prevent invalid requests'
      },
      {
        name: 'Responsive Design',
        steps: [
          '1. Resize browser window to different sizes',
          '2. Test on mobile viewport',
          '3. Verify all elements remain accessible',
          '4. Check that text areas and inputs scale appropriately'
        ],
        expected: 'Interface should work well on different screen sizes'
      }
    ]
  },
  {
    category: '🔧 Advanced Features',
    tests: [
      {
        name: 'Copy Response',
        steps: [
          '1. Send request and get response',
          '2. Click copy button in response section',
          '3. Paste into text editor',
          '4. Verify complete response is copied'
        ],
        expected: 'Response should be copied to clipboard correctly'
      },
      {
        name: 'Download Response',
        steps: [
          '1. Send request and get response',
          '2. Click download button',
          '3. Verify file is downloaded with appropriate extension',
          '4. Open downloaded file and verify content'
        ],
        expected: 'Response should download as file with correct format'
      },
      {
        name: 'Large Response Handling',
        steps: [
          '1. Send request that returns large response (>1MB)',
          '2. Verify response loads without freezing browser',
          '3. Check that formatting still works',
          '4. Test scrolling through large response'
        ],
        expected: 'Large responses should be handled gracefully'
      },
      {
        name: 'Special Characters',
        steps: [
          '1. Test URLs with special characters',
          '2. Test headers with Unicode characters',
          '3. Test body with emoji and special symbols',
          '4. Verify proper encoding/decoding'
        ],
        expected: 'Special characters should be handled correctly'
      }
    ]
  },
  {
    category: '🚨 Error Handling',
    tests: [
      {
        name: 'Network Errors',
        steps: [
          '1. Send request to non-existent domain',
          '2. Verify error message is displayed',
          '3. Check that error is added to history',
          '4. Test with malformed URLs'
        ],
        expected: 'Network errors should be caught and displayed clearly'
      },
      {
        name: 'CORS Errors',
        steps: [
          '1. Send request to endpoint that blocks CORS',
          '2. Verify CORS error is displayed',
          '3. Check error message explains CORS limitation'
        ],
        expected: 'CORS errors should be explained to user'
      },
      {
        name: 'Invalid JSON in Body',
        steps: [
          '1. Enter malformed JSON in request body',
          '2. Send request',
          '3. Verify request is sent as-is (server will handle validation)',
          '4. Check response for server error'
        ],
        expected: 'Invalid JSON should be sent to server for validation'
      },
      {
        name: 'Timeout Handling',
        steps: [
          '1. Send request to very slow endpoint',
          '2. Wait for timeout',
          '3. Verify timeout error is displayed',
          '4. Check that UI returns to normal state'
        ],
        expected: 'Timeouts should be handled gracefully'
      }
    ]
  }
];

// Display test cases
manualTests.forEach((category, categoryIndex) => {
  console.log(`\n${category.category}`);
  console.log('-'.repeat(category.category.length));
  
  category.tests.forEach((test, testIndex) => {
    console.log(`\n${categoryIndex + 1}.${testIndex + 1} ${test.name}`);
    console.log('Steps:');
    test.steps.forEach(step => {
      console.log(`   ${step}`);
    });
    console.log(`Expected: ${test.expected}`);
  });
});

// Test data display
console.log('\n\n📋 Test Data for Manual Testing');
console.log('='.repeat(40));

console.log('\n🌐 Public APIs for Testing:');
testData.publicApis.forEach((api, index) => {
  console.log(`\n${index + 1}. ${api.name}`);
  console.log(`   URL: ${api.url}`);
  console.log(`   Method: ${api.method}`);
  if (api.headers) {
    console.log(`   Headers:`);
    api.headers.forEach(header => {
      console.log(`     ${header.key}: ${header.value}`);
    });
  }
  if (api.body) {
    console.log(`   Body: ${api.body}`);
  }
  console.log(`   Description: ${api.description}`);
});

console.log('\n📝 Sample Request Bodies:');
console.log('\nJSON (Simple):');
console.log(testData.sampleBodies.json.simple);

console.log('\nJSON (Complex):');
console.log(testData.sampleBodies.json.complex);

console.log('\nXML (Simple):');
console.log(testData.sampleBodies.xml.simple);

console.log('\nForm Data:');
console.log(testData.sampleBodies.form);

// Testing instructions
console.log('\n\n📋 Manual Testing Instructions');
console.log('='.repeat(40));
console.log('\n1. 🚀 Start the development server');
console.log('2. 🌐 Navigate to the HTTP Request Builder tool');
console.log('3. 📝 Work through each test category systematically');
console.log('4. ✅ Record results for each test case');
console.log('5. 🐛 Report any issues or unexpected behavior');
console.log('6. 📊 Verify all features work as expected');

console.log('\n🎯 Focus Areas:');
console.log('- Request construction and sending');
console.log('- Response formatting and display');
console.log('- Data persistence (history/presets)');
console.log('- Error handling and edge cases');
console.log('- User interface and experience');
console.log('- Performance with large responses');

console.log('\n✅ Test Completion Criteria:');
console.log('- All HTTP methods work correctly');
console.log('- Headers can be added, modified, and removed');
console.log('- Request bodies are sent with correct content types');
console.log('- Responses are formatted and displayed properly');
console.log('- History and presets persist across sessions');
console.log('- Error states are handled gracefully');
console.log('- UI is responsive and user-friendly');

console.log('\n🎉 Manual Testing Guide Complete!');
console.log('\nHappy Testing! 🧪');