import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import './HomePage.css';

const HomePage = () => {
  // Government schemes data
  const popularSchemes = [
    {
      id: 1,
      title: "Pradhan Mantri Awas Yojana",
      category: "Housing",
      img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop"
    },
    {
      id: 2,
      title: "PM Kisan Samman Nidhi",
      category: "Agriculture", 
      img: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=250&fit=crop"
    },
    {
      id: 3,
      title: "Sukanya Samriddhi Yojana",
      category: "Girl Child",
      img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=250&fit=crop"
    }
  ];

  const allSchemes = [
    { icon: "🏠", title: "PM Awas Yojana", desc: "Affordable housing for all." },
    { icon: "🌾", title: "PM Kisan", desc: "₹6,000 support for farmers." },
    { icon: "🏥", title: "Ayushman Bharat", desc: "₹5 lakh family health cover." },
    { icon: "🚀", title: "Startup India", desc: "Funding for new ventures." },
    { icon: "👩‍🎓", title: "Beti Bachao Beti Padhao", desc: "Support girl education." }
  ];

  return (
    <div className="homepage">
      <Navbar />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-left">
            <h1 className="hero-title">
              <span className="title-line1">WELCOME TO</span>
              <span className="title-line2 gradient-text">SCHEME SEVA</span>
            </h1>
            <p className="hero-sub">
              Your AI‑powered portal to browse & apply for government schemes.
            </p>
            <div className="hero-actions">
              <Link to="/schemes" className="hero-btn primary">
                Browse Schemes
              </Link>
              <Link to="/recommendations" className="hero-btn secondary">
                Get Recommendations
              </Link>
            </div>
          </div>
          <div className="hero-right">
            <div className="hero-image">
              <div className="hero-glow"></div>
              <span className="hero-emoji">🇮🇳</span>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Schemes */}
      <section className="popular-schemes">
        <h2>Popular Schemes</h2>
        <div className="schemes-grid">
          {popularSchemes.map((scheme) => (
            <div key={scheme.id} className="scheme-card">
              <img src={scheme.img} alt={scheme.title} />
              <div className="scheme-overlay">
                <div className="scheme-category">{scheme.category}</div>
                <h3>{scheme.title}</h3>
                <Link to="/schemes" className="scheme-btn">Learn More</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits">
        <h2>Your Scheme Benefits</h2>
        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">🎯</div>
            <h3>Instant Eligibility Check</h3>
            <p>Check your eligibility for multiple schemes in seconds with our AI-powered system</p>
            <Link to="/recommendations" className="benefit-btn">Check Now →</Link>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">📱</div>
            <h3>One Click Apply</h3>
            <p>Apply to eligible schemes with a single click using your saved profile</p>
            <Link to="/schemes" className="benefit-btn">Apply Now →</Link>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🔔</div>
            <h3>Track Applications</h3>
            <p>Real-time tracking and notifications for all your scheme applications</p>
            <Link to="/applications" className="benefit-btn">Track Now →</Link>
          </div>
        </div>
      </section>

      {/* Browse All Schemes */}
      <section className="all-schemes">
        <h2>Browse All Schemes</h2>
        <div className="categories-grid">
          {allSchemes.map((scheme, i) => (
            <div key={i} className="category-card">
              <div className="category-icon">{scheme.icon}</div>
              <h3>{scheme.title}</h3>
              <p>{scheme.desc}</p>
              <Link to="/schemes">
                <button className="category-btn">View →</button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>
          © 2025 Scheme Seva · Smart Scheme Assistant | 
          <Link to="#">Privacy Policy</Link>
        </p>
      </footer>

      {/* Floating Chatbot */}
      <button
        onClick={() => alert('Chat feature coming soon!')}
        className="chatbot-toggle-btn"
        style={{
          position: "fixed",
          bottom: "25px",
          right: "25px",
          background: "linear-gradient(45deg,#6c63ff,#9f7aea)",
          border: "none",
          borderRadius: "50%",
          width: "55px",
          height: "55px",
          fontSize: "26px",
          cursor: "pointer",
          boxShadow: "0 3px 15px rgba(0,0,0,0.3)",
          zIndex: 99,
        }}
        title="Ask Scheme Seva"
      >
        💬
      </button>
    </div>
  );
};

export default HomePage;
