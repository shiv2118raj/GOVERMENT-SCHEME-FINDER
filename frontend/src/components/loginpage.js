import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginPage.css';

const LoginPage = ({ setIsLoggedIn, setUserRole }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password || (!isLogin && !formData.name)) {
      alert('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const baseUrl = 'http://localhost:5002';
      if (isLogin) {
        const { email, password } = formData;
        const response = await axios.post(`${baseUrl}/login`, { email: email.trim(), password });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.role);
        setIsLoggedIn(true);
        setUserRole(response.data.role);
        navigate('/');
      } else {
        const { name, email, password } = formData;
        await axios.post(`${baseUrl}/register`, { name: name.trim(), email: email.trim(), password });
        alert('Registration successful! Please login.');
        setIsLogin(true);
        setFormData({ name: '', email: '', password: '' });
      }
    } catch (error) {
      const message = error.response?.data?.msg || error.message || 'An error occurred';
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // Check if backend is available
      try {
        await axios.get('http://localhost:5002/');
      } catch (networkError) {
        console.log('Backend not available, using fallback mode');
        // Fallback to demo login if backend is not running
        const demoToken = "demo_token_12345";
        localStorage.setItem("token", demoToken);
        localStorage.setItem("role", "user");
        setIsLoggedIn(true);
        setUserRole("user");
        navigate('/');
        alert('Google login successful! (Demo mode - backend not running)');
        return;
      }

      // For demo purposes, we'll use a simplified approach
      // In production, you would implement proper Google OAuth flow
      const demoGoogleUser = {
        name: 'Demo User',
        email: 'demo@gmail.com'
      };

      // Try to register/login with demo credentials
      try {
        await axios.post('http://localhost:5002/register', {
          name: demoGoogleUser.name,
          email: demoGoogleUser.email,
          password: 'demo123'
        });
      } catch (registerError) {
        // User might already exist, that's okay
        console.log('User registration attempt:', registerError.response?.data?.msg);
      }

      // Now login
      const response = await axios.post('http://localhost:5002/login', {
        email: demoGoogleUser.email,
        password: 'demo123'
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      setIsLoggedIn(true);
      setUserRole(response.data.role);
      navigate('/');
      alert('Google login successful! (Demo mode)');
    } catch (error) {
      console.error('Google login error:', error);

      // If network error, fallback to demo mode
      if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNREFUSED') {
        const demoToken = "demo_token_12345";
        localStorage.setItem("token", demoToken);
        localStorage.setItem("role", "user");
        setIsLoggedIn(true);
        setUserRole("user");
        navigate('/');
        alert('Google login successful! (Demo mode - backend offline)');
        return;
      }

      alert('Google login failed. Please try regular login.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>🧞‍♂️ SCHEME GENIE</h1>
          <p>Your magical gateway to government schemes</p>
        </div>

        <div className="login-form-container">
          <div className="form-toggle">
            <button 
              className={isLogin ? 'active' : ''}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button 
              className={!isLogin ? 'active' : ''}
              onClick={() => setIsLogin(false)}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {!isLogin && (
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}
            
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Register')}
            </button>
          </form>

          <div className="divider">
            <button 
              type="button" 
              className="google-btn"
              onClick={handleGoogleLogin}
            >
              <span className="google-icon">🔍</span>
              ✨ Continue with Google (Demo)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;