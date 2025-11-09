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
        testDocumentFunctions(loginResult.token);
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

function testDocumentFunctions(token) {
  console.log('\n📄 Testing document functionality...');

  // First get all documents
  getAllDocuments(token);
}

function getAllDocuments(token) {
  console.log('\n📋 Getting all documents...');

  const options = {
    hostname: 'localhost',
    port: 5002,
    path: '/api/admin/documents',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      console.log('Documents Status:', res.statusCode);
      console.log('Response length:', data.length, 'characters');

      try {
        const documents = JSON.parse(data);
        console.log('✅ Documents endpoint working!');
        console.log('📊 Total documents found:', documents.length);

        if (documents.length > 0) {
          console.log('🔍 First document details:');
          const firstDoc = documents[0];
          console.log('  - ID:', firstDoc._id);
          console.log('  - Name:', firstDoc.name);
          console.log('  - User:', firstDoc.userId?.name || 'N/A');
          console.log('  - Status:', firstDoc.verificationStatus);
          console.log('  - File:', firstDoc.filename);

          // Test document verification
          testDocumentVerification(token, firstDoc._id);

          // Test individual document viewing
          testDocumentDetails(token, firstDoc._id);
        } else {
          console.log('⚠️ No documents found in database');
        }
      } catch (e) {
        console.log('❌ Documents response not JSON');
        console.log('Raw response (first 300 chars):', data.substring(0, 300));
      }
    });
  });

  req.on('error', (err) => {
    console.log('❌ Documents request error:', err.message);
  });

  req.end();
}

function testDocumentVerification(token, documentId) {
  console.log(`\n✅ Testing document verification for ID: ${documentId}`);

  const verifyData = JSON.stringify({
    status: 'verified'
  });

  const options = {
    hostname: 'localhost',
    port: 5002,
    path: `/api/admin/documents/${documentId}`,
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(verifyData)
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      console.log('Verification Status:', res.statusCode);
      try {
        const result = JSON.parse(data);
        console.log('✅ Document verification successful!');
        console.log('📋 Response:', result.msg);
      } catch (e) {
        console.log('❌ Verification response not JSON');
        console.log('Raw response:', data);
      }
    });
  });

  req.on('error', (err) => {
    console.log('❌ Document verification request error:', err.message);
  });

  req.write(verifyData);
  req.end();
}

function testDocumentDetails(token, documentId) {
  console.log(`\n🔍 Testing document details for ID: ${documentId}`);

  const options = {
    hostname: 'localhost',
    port: 5002,
    path: `/api/admin/documents/${documentId}`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      console.log('Document Details Status:', res.statusCode);
      console.log('Response length:', data.length, 'characters');

      try {
        const document = JSON.parse(data);
        console.log('✅ Document details endpoint working!');
        console.log('📋 Document Details:');
        console.log('  - ID:', document._id);
        console.log('  - Name:', document.name);
        console.log('  - User:', document.userId?.name || 'N/A');
        console.log('  - Status:', document.verificationStatus);
        console.log('  - File:', document.filename);

        // Test document rejection
        testDocumentRejection(token, documentId);
      } catch (e) {
        console.log('❌ Document details response not JSON');
        console.log('Raw response (first 300 chars):', data.substring(0, 300));
      }
    });
  });

  req.on('error', (err) => {
    console.log('❌ Document details request error:', err.message);
  });

  req.end();
}

function testDocumentRejection(token, documentId) {
  console.log(`\n❌ Testing document rejection for ID: ${documentId}`);

  const rejectData = JSON.stringify({
    status: 'rejected'
  });

  const options = {
    hostname: 'localhost',
    port: 5002,
    path: `/api/admin/documents/${documentId}`,
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(rejectData)
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      console.log('Rejection Status:', res.statusCode);
      try {
        const result = JSON.parse(data);
        console.log('✅ Document rejection successful!');
        console.log('📋 Response:', result.msg);
      } catch (e) {
        console.log('❌ Rejection response not JSON');
        console.log('Raw response:', data);
      }
    });
  });

  req.on('error', (err) => {
    console.log('❌ Document rejection request error:', err.message);
  });

  req.write(rejectData);
  req.end();
}
