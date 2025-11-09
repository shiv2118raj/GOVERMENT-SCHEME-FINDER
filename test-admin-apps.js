const http = require('http');

// First login as admin
const loginData = JSON.stringify({
  email: 'kishu@gmail.com',
  password: '123'
});

const loginOptions = {
  hostname: 'localhost',
  port: 5002,
  path: '/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(loginData)
  }
};

console.log('🔐 Logging in as admin...');
const loginReq = http.request(loginOptions, (res) => {
  let loginResponse = '';
  res.on('data', (chunk) => loginResponse += chunk);
  res.on('end', () => {
    console.log('Login Status:', res.statusCode);
    try {
      const loginResult = JSON.parse(loginResponse);
      console.log('Login Response:', loginResult.msg);

      if (loginResult.token) {
        console.log('✅ Admin login successful!');

        // Now test admin applications endpoint
        testAdminApplications(loginResult.token);
      } else {
        console.log('❌ Login failed - no token received');
      }
    } catch (e) {
      console.log('❌ Login response not JSON:', loginResponse.substring(0, 100));
    }
  });
});

loginReq.on('error', (err) => {
  console.log('❌ Login request error:', err.message);
});

loginReq.write(loginData);
loginReq.end();

function testAdminApplications(token) {
  console.log('\n📋 Testing admin applications endpoint...');

  const options = {
    hostname: 'localhost',
    port: 5002,
    path: '/api/admin/applications',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      console.log('Applications Status:', res.statusCode);
      console.log('Response length:', data.length, 'characters');

      try {
        const applications = JSON.parse(data);
        console.log('✅ Applications endpoint working!');
        console.log('📊 Total applications found:', applications.length);

        if (applications.length > 0) {
          console.log('🔍 First application details:');
          const firstApp = applications[0];
          console.log('  - ID:', firstApp._id);
          console.log('  - Status:', firstApp.status);
          console.log('  - Scheme:', firstApp.schemeId?.name || 'N/A');
          console.log('  - User:', firstApp.userId?.name || 'N/A');
          console.log('  - Created:', new Date(firstApp.createdAt).toLocaleDateString());
        } else {
          console.log('⚠️ No applications found in database');
        }
      } catch (e) {
        console.log('❌ Applications response not JSON');
        console.log('Raw response (first 300 chars):', data.substring(0, 300));
      }
    });
  });

  req.on('error', (err) => {
    console.log('❌ Applications request error:', err.message);
  });

  req.end();
}
