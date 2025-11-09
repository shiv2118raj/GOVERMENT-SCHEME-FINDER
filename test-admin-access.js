const http = require('http');

const postData = JSON.stringify({
  email: 'kishu@gmail.com',
  password: '123'
});

const options = {
  hostname: 'localhost',
  port: 5002,
  path: '/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log('Login Status:', res.statusCode);
    try {
      const response = JSON.parse(data);
      console.log('Login Response:', response.msg);

      if (response.token) {
        console.log('✅ Admin login successful! Token received');

        // Now test admin dashboard access
        testAdminAccess(response.token);
      } else {
        console.log('❌ Login failed - no token received');
      }
    } catch (e) {
      console.log('❌ Login response not JSON:', data.substring(0, 100));
    }
  });
});

req.on('error', (err) => {
  console.log('❌ Login request error:', err.message);
});

req.write(postData);
req.end();

function testAdminAccess(token) {
  const options = {
    hostname: 'localhost',
    port: 5002,
    path: '/api/admin/dashboard',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      console.log('\nAdmin Dashboard Status:', res.statusCode);
      try {
        const response = JSON.parse(data);
        console.log('✅ Admin dashboard access successful!');
        console.log('📊 Dashboard Stats:', {
          totalUsers: response.stats?.totalUsers || 'N/A',
          totalApplications: response.stats?.totalApplications || 'N/A',
          totalSchemes: response.stats?.totalSchemes || 'N/A',
          totalDocuments: response.stats?.totalDocuments || 'N/A'
        });

        if (response.recentApplications && response.recentApplications.length > 0) {
          console.log('📋 Recent applications count:', response.recentApplications.length);
        }

      } catch (e) {
        console.log('❌ Admin dashboard response not JSON:', data.substring(0, 200));
      }
    });
  });

  req.on('error', (err) => {
    console.log('❌ Admin dashboard request error:', err.message);
  });

  req.end();
}
