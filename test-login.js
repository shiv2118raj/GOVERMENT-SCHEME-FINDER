// Test login functionality
import fetch from 'node-fetch';

async function testLogin() {
  try {
    // First register a user
    const registerResponse = await fetch('http://localhost:5000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      })
    });

    console.log('Register status:', registerResponse.status);

    // Then try to login
    const loginResponse = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });

    const loginData = await loginResponse.json();
    console.log('Login status:', loginResponse.status);
    console.log('Login response:', loginData);

    if (loginResponse.ok && loginData.token) {
      console.log('✅ Login successful! Token:', loginData.token);
    } else {
      console.log('❌ Login failed');
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

testLogin();
