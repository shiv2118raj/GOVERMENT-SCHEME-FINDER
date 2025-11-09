const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5002,
  path: '/api/schemes',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    try {
      const json = JSON.parse(data);
      console.log('Response type:', typeof json);
      console.log('Is array:', Array.isArray(json));
      if (Array.isArray(json)) {
        console.log('Number of schemes:', json.length);
        if (json.length > 0) {
          console.log('First scheme keys:', Object.keys(json[0]));
        }
      }
    } catch (e) {
      console.log('Response is not JSON:', data.substring(0, 100));
    }
  });
});

req.on('error', (err) => {
  console.log('Error:', err.message);
});

req.end();
