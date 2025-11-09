const axios = require('axios');

async function testAdminLogin() {
  try {
    console.log('🔍 Testing backend connectivity...');
    const healthResponse = await axios.get('http://localhost:5002/health');
    console.log('✅ Backend is running:', healthResponse.data);

    console.log('\n🔑 Testing admin login...');
    // Replace these with your actual admin credentials
    const loginResponse = await axios.post('http://localhost:5002/api/login', {
      email: 'admin@example.com',
      password: 'admin123'
    });

    console.log('✅ Login successful:', loginResponse.data);

    if (loginResponse.data.token) {
      console.log('\n📊 Testing admin dashboard...');
      const dashboardResponse = await axios.get('http://localhost:5002/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${loginResponse.data.token}`
        }
      });

      console.log('✅ Admin dashboard data:', dashboardResponse.data);
    }

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);

    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Backend server is not running on port 5002');
      console.log('   Try: cd backend && node server.js');
    }
  }
}

testAdminLogin();
