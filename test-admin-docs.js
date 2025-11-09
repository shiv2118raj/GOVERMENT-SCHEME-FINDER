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
    console.log('Response length:', data.length);
    if (data.length < 1000) {
      console.log('Response:', data);
    } else {
      try {
        const docs = JSON.parse(data);
        console.log('Documents found:', docs.length);
        if (docs.length > 0) {
          console.log('First document:', JSON.stringify(docs[0], null, 2));
        }
      } catch (e) {
        console.log('Not JSON');
      }
    }
  });
});

req.on('error', (err) => {
  console.log('Error:', err.message);
});

req.end();
