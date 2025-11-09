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

        // Test individual application details endpoint
        testApplicationDetails(loginResult.token);
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

function testApplicationDetails(token) {
  // Use the first application ID from our earlier test (68f48300efbc41f08e9cb777)
  const applicationId = '68f48300efbc41f08e9cb777';

  console.log(`\n🔍 Testing application details for ID: ${applicationId}`);

  const options = {
    hostname: 'localhost',
    port: 5002,
    path: `/api/applications/${applicationId}`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      console.log('Application Details Status:', res.statusCode);
      console.log('Response length:', data.length, 'characters');

      try {
        const application = JSON.parse(data);
        console.log('✅ Application details endpoint working!');
        console.log('📋 Application Details:');
        console.log('  - ID:', application._id);
        console.log('  - Status:', application.status);
        console.log('  - Scheme:', application.schemeId?.name || 'N/A');
        console.log('  - User:', application.userId?.name || 'N/A');
        console.log('  - Created:', new Date(application.createdAt).toLocaleDateString());
        console.log('  - Application Data:', JSON.stringify(application.applicationData, null, 2).substring(0, 200) + '...');
      } catch (e) {
        console.log('❌ Application details response not JSON');
        console.log('Raw response (first 300 chars):', data.substring(0, 300));
      }
    });
  });

  req.on('error', (err) => {
    console.log('❌ Application details request error:', err.message);
  });

  req.end();
}
