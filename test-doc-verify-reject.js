const http = require('http');

// Test document verification (verify)
const verifyData = JSON.stringify({ status: 'verified' });

const verifyOptions = {
  hostname: 'localhost',
  port: 5002,
  path: '/api/admin/documents/68f4745c5559496222b96be3',
  method: 'PUT',
  headers: {
    'Authorization': 'Bearer demo_token_12345',
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(verifyData)
  }
};

console.log('🔍 Testing document verification...');
const verifyReq = http.request(verifyOptions, (res) => {
  let verifyResponse = '';
  res.on('data', (chunk) => verifyResponse += chunk);
  res.on('end', () => {
    console.log('Verify Status:', res.statusCode);
    console.log('Verify Response:', verifyResponse);

    // Test document rejection (with remarks)
    const rejectData = JSON.stringify({
      status: 'rejected',
      adminRemarks: 'Document is not clear enough for verification'
    });

    const rejectOptions = {
      hostname: 'localhost',
      port: 5002,
      path: '/api/admin/documents/68f4745c5559496222b96be3',
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer demo_token_12345',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(rejectData)
      }
    };

    console.log('\n❌ Testing document rejection...');
    const rejectReq = http.request(rejectOptions, (res) => {
      let rejectResponse = '';
      res.on('data', (chunk) => rejectResponse += chunk);
      res.on('end', () => {
        console.log('Reject Status:', res.statusCode);
        console.log('Reject Response:', rejectResponse);
      });
    });

    rejectReq.on('error', (err) => {
      console.log('❌ Reject request error:', err.message);
    });

    rejectReq.write(rejectData);
    rejectReq.end();
  });
});

verifyReq.on('error', (err) => {
  console.log('❌ Verify request error:', err.message);
});

verifyReq.write(verifyData);
verifyReq.end();
