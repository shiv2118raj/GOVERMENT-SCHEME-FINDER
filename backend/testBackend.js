// Simple test script to verify backend functionality
import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

async function testBackend() {
  try {
    console.log('🧪 Testing backend functionality...\n');

    // Test 1: Check if server is running
    console.log('1️⃣ Testing server connectivity...');
    try {
      const response = await axios.get(`${BASE_URL}/`);
      console.log('✅ Server is running:', response.data);
    } catch (error) {
      console.log('❌ Server not accessible:', error.message);
      return;
    }

    // Test 2: Get all schemes
    console.log('\n2️⃣ Testing schemes endpoint...');
    try {
      const response = await axios.get(`${BASE_URL}/api/schemes`);
      console.log(`✅ Found ${response.data.length} schemes`);
    } catch (error) {
      console.log('❌ Schemes endpoint error:', error.response?.data?.msg || error.message);
    }

    // Test 3: Test chat endpoint
    console.log('\n3️⃣ Testing chat endpoint...');
    try {
      const response = await axios.post(`${BASE_URL}/chat`, {
        message: 'Tell me about PM Kisan scheme',
        language: 'en'
      });
      console.log('✅ Chat response:', response.data.reply.substring(0, 100) + '...');
    } catch (error) {
      console.log('❌ Chat endpoint error:', error.response?.data?.error || error.message);
    }

    // Test 4: Test user registration
    console.log('\n4️⃣ Testing user registration...');
    try {
      const response = await axios.post(`${BASE_URL}/register`, {
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'testpassword123'
      });
      console.log('✅ User registered:', response.data.msg);
    } catch (error) {
      console.log('❌ Registration error:', error.response?.data?.msg || error.message);
    }

    // Test 5: Test user login
    console.log('\n5️⃣ Testing user login...');
    try {
      const response = await axios.post(`${BASE_URL}/login`, {
        email: 'test@example.com',
        password: 'testpassword123'
      });
      console.log('✅ User logged in:', response.data.msg);
      if (response.data.token) {
        console.log('✅ Token received');
      }
    } catch (error) {
      console.log('❌ Login error:', error.response?.data?.msg || error.message);
    }

    console.log('\n🎉 Backend tests completed!');

  } catch (error) {
    console.error('❌ Test script error:', error.message);
  }
}

testBackend();
