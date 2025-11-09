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
    try {
      const docs = JSON.parse(data);
      if (docs.length > 0) {
        console.log('First document structure:');
        console.log(JSON.stringify(docs[0], null, 2));
      }
    } catch (e) {
      console.log('Response not JSON');
    }
  });
});

req.on('error', (err) => {
  console.log('Error:', err.message);
});

req.end();
