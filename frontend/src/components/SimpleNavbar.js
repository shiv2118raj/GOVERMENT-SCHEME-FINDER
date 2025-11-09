import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import './SimpleNavbar.css';

const SimpleNavbar = ({ onChatToggle }) => {
  const [activeTab, setActiveTab] = useState('Home');
  const navigate = useNavigate();
  const { t } = useLanguage();
  const isLoggedIn = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    window.location.reload();
  };

  const navItems = [
    { name: t('nav.home', 'Home'), path: '/', icon: '🏠' },
    { name: t('nav.browseSchemes', 'Schemes'), path: '/schemes', icon: '📄' },
    { name: t('nav.applications', 'Applications'), path: '/applications', icon: '📋' },
    { name: t('nav.documents', 'Documents'), path: '/documents', icon: '📁' },
    { name: t('nav.recommendations', 'Recommendations'), path: '/recommendations', icon: '👤' },
  ];

  return (
    <nav className="simple-navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">🏛️</div>
          <span className="logo-text">SCHEME GENIE</span>
        </Link>

        {/* Navigation Items */}
        <div className="nav-items">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`nav-item ${activeTab === item.name ? 'active' : ''}`}
              onClick={() => setActiveTab(item.name)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-text">{item.name}</span>
            </Link>
          ))}
          
          {/* Chat Button */}
          <button
            className="nav-item chat-btn"
            onClick={() => {
              setActiveTab('Chat');
              if (onChatToggle) onChatToggle();
            }}
          >
            <span className="nav-icon">💬</span>
            <span className="nav-text">{t('chatbot.title', 'Chat')}</span>
          </button>
        </div>

        {/* Right Side */}
        <div className="navbar-right">
          {isLoggedIn ? (
            <button onClick={handleLogout} className="logout-btn">
              {t('nav.logout', 'Logout')}
            </button>
          ) : (
            <Link to="/login" className="login-btn">
              {t('nav.login', 'Login')}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default SimpleNavbar;
