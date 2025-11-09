const http = require('http');

const data = JSON.stringify({ status: 'verified' });

const options = {
  hostname: 'localhost',
  port: 5002,
  path: '/api/admin/documents/68f4745c5559496222b96be3',
  method: 'PUT',
  headers: {
    'Authorization': 'Bearer demo_token_12345',
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, (res) => {
  let response = '';
  res.on('data', (chunk) => response += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', response);
  });
});

req.on('error', (err) => {
  console.log('Request error:', err.message);
});

req.write(data);
req.end();
