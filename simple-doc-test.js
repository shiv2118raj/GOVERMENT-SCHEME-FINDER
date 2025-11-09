const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5002,
  path: '/api/admin/documents',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer demo_token_12345'
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    if (data.length < 500) {
      console.log('Response:', data);
    } else {
      console.log('Response length:', data.length);
    }
  });
});

req.on('error', (err) => {
  console.log('Error:', err.message);
});

req.end();
