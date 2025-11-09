const http = require('http');

// Test document verification with detailed error logging
const testData = JSON.stringify({
  status: 'verified'
});

const options = {
  hostname: 'localhost',
  port: 5002,
  path: '/api/admin/documents/68f4745c5559496222b96be3',
  method: 'PUT',
  headers: {
    'Authorization': 'Bearer demo_token_12345',
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(testData)
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', data);
  });
});

req.on('error', (err) => {
  console.log('Error:', err.message);
});

req.write(testData);
req.end();
