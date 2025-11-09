import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";
import "./HomePage.css";

const HomePage = () => {
  const { t } = useLanguage();
  const { isDarkMode } = useTheme();

  // define the function before using it
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div className={`homepage ${isDarkMode ? 'dark' : 'light'}`}>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-left">
            <h1 className="hero-title">
              {t('home.title', 'Discover Government Schemes Made Simple')}
            </h1>
            <p className="hero-description">
              {t('home.subtitle', 'Navigate through 50+ government schemes with AI-powered recommendations. Find benefits you\'re eligible for in seconds, not hours.')}
            </p>
            <div className="hero-badge">🚀 {t('home.heroBadge', 'Empowering Citizens Since 2024')}</div>

            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">50+</span>
                <span className="stat-label">{t('home.heroStats.schemes', 'Government Schemes')}</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">50K+</span>
                <span className="stat-label">{t('home.heroStats.users', 'Happy Users')}</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">₹2.5Cr+</span>
                <span className="stat-label">{t('home.heroStats.benefits', 'Benefits Unlocked')}</span>
              </div>
            </div>

            <div className="hero-actions">
              <Link to="/schemes" className="hero-btn primary">
                🔍 {t('common.search', 'Find My Schemes')}
              </Link>
              <Link to="/recommendations" className="hero-btn secondary">
                ✨ {t('common.getStarted', 'Get Started')}
              </Link>
            </div>
          </div>

          <div className="hero-right">
            <div className="hero-image">
              <div className="hero-glow"></div>
              <div className="hero-emoji">🏛️</div>
            </div>
          </div>
        </div>

        {/* Floating Particles */}
        <div className="particles">
          <div className="particle particle-1">📄</div>
          <div className="particle particle-2">💰</div>
          <div className="particle particle-3">🎯</div>
          <div className="particle particle-4">📊</div>
          <div className="particle particle-5">✅</div>
          <div className="particle particle-6">🏆</div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="section-header">
          <h2>{t('home.howItWorks.title', 'How Scheme Genie Works')}</h2>
          <p>{t('home.howItWorks.subtitle', 'Get personalized scheme recommendations in 3 simple steps')}</p>
        </div>
        
        <div className="steps-container">
          <div className="step-card">
            <div className="step-number">1</div>
            <div className="step-icon">👤</div>
            <h3>{t('home.howItWorks.step1.title', 'Create Your Profile')}</h3>
            <p>{t('home.howItWorks.step1.description', 'Tell us about your age, income, location, and family details. Our secure system keeps your data safe.')}</p>
          </div>
          
          <div className="step-card">
            <div className="step-number">2</div>
            <div className="step-icon">🤖</div>
            <h3>{t('home.howItWorks.step2.title', 'AI Analysis')}</h3>
            <p>{t('home.howItWorks.step2.description', 'Our advanced AI analyzes your profile against 500+ government schemes to find perfect matches.')}</p>
          </div>
          
          <div className="step-card">
            <div className="step-number">3</div>
            <div className="step-icon">🎯</div>
            <h3>{t('home.howItWorks.step3.title', 'Get Personalized Results')}</h3>
            <p>{t('home.howItWorks.step3.description', 'Receive tailored recommendations with eligibility details, application process, and required documents.')}</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="section-header">
          <h2>{t('home.features.title', 'Why Choose Scheme Genie?')}</h2>
          <p>{t('home.features.subtitle', 'Trusted by thousands of Indians for government scheme discovery')}</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>{t('home.features.aiPowered.title', 'AI-Powered Matching')}</h3>
            <p>{t('home.features.aiPowered.description', 'Advanced algorithms analyze your profile to find schemes you\'re most likely to qualify for.')}</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>{t('home.features.instantResults.title', 'Instant Results')}</h3>
            <p>{t('home.features.instantResults.description', 'Get personalized recommendations in seconds instead of spending hours researching manually.')}</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>{t('home.features.secure.title', 'Secure & Private')}</h3>
            <p>{t('home.features.secure.description', 'Your personal information is encrypted and never shared with third parties.')}</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>{t('home.features.mobileFriendly.title', 'Mobile Friendly')}</h3>
            <p>{t('home.features.mobileFriendly.description', 'Access schemes on any device - desktop, tablet, or mobile. Works seamlessly everywhere.')}</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🆕</div>
            <h3>{t('home.features.alwaysUpdated.title', 'Always Updated')}</h3>
            <p>{t('home.features.alwaysUpdated.description', 'Our database is continuously updated with the latest government schemes and policy changes.')}</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📄</div>
            <h3>{t('home.features.documentManager.title', 'Document Manager')}</h3>
            <p>{t('home.features.documentManager.description', 'Track required documents, know where to get them, and manage your application paperwork efficiently.')}</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>{t('home.features.aiSupport.title', '24/7 AI Support')}</h3>
            <p>{t('home.features.aiSupport.description', 'Get instant answers to your questions with our intelligent chatbot assistant.')}</p>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="statistics">
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>₹2,50,00,000+</h3>
              <p>{t('home.statistics.benefits', 'Total Benefits Unlocked')}</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>50,000+</h3>
              <p>{t('home.statistics.users', 'Active Users')}</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🏛️</div>
            <div className="stat-content">
              <h3>500+</h3>
              <p>{t('home.statistics.schemes', 'Government Schemes')}</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <h3>4.8/5</h3>
              <p>{t('home.statistics.rating', 'User Rating')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Schemes Preview */}
      <section className="popular-schemes">
        <div className="section-header">
          <h2>{t('home.popularSchemes.title', 'Most Popular Schemes')}</h2>
          <Link to="/schemes" className="view-all-btn">{t('home.popularSchemes.viewAll', 'View All Schemes')} →</Link>
        </div>
        
        <div className="schemes-grid">
          <Link to="/schemes" className="scheme-card-large education-scheme">
            <div className="scheme-image">
              <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=250&fit=crop&crop=center" alt="Education" />
            </div>
            <div className="scheme-overlay">
              <span className="scheme-category">📚 {t('home.popularSchemes.education.category', 'Education')}</span>
              <h3>{t('home.popularSchemes.education.title', 'PM Scholarship Scheme')}</h3>
              <p className="scheme-description">{t('home.popularSchemes.education.description', 'Financial assistance for higher education')}</p>
              <div className="scheme-rating">⭐ 4.9 • 15,000+ {t('home.popularSchemes.beneficiaries', 'beneficiaries')}</div>
              <div className="scheme-benefit">{t('home.popularSchemes.education.benefit', 'Up to ₹36,000/year')}</div>
            </div>
          </Link>
          
          <Link to="/schemes" className="scheme-card-large healthcare-scheme">
            <div className="scheme-image">
              <img src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop&crop=center" alt="Healthcare" />
            </div>
            <div className="scheme-overlay">
              <span className="scheme-category">🏥 {t('home.popularSchemes.healthcare.category', 'Healthcare')}</span>
              <h3>{t('home.popularSchemes.healthcare.title', 'Ayushman Bharat')}</h3>
              <p className="scheme-description">{t('home.popularSchemes.healthcare.description', 'Free health insurance for families')}</p>
              <div className="scheme-rating">⭐ 4.8 • 50,000+ {t('home.popularSchemes.beneficiaries', 'beneficiaries')}</div>
              <div className="scheme-benefit">{t('home.popularSchemes.healthcare.benefit', 'Up to ₹5 Lakh coverage')}</div>
            </div>
          </Link>
          
          <Link to="/schemes" className="scheme-card-large employment-scheme">
            <div className="scheme-image">
              <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop&crop=center" alt="Employment" />
            </div>
            <div className="scheme-overlay">
              <span className="scheme-category">💼 {t('home.popularSchemes.employment.category', 'Employment')}</span>
              <h3>{t('home.popularSchemes.employment.title', 'PMKVY Training')}</h3>
              <p className="scheme-description">{t('home.popularSchemes.employment.description', 'Free skill development with placement')}</p>
              <div className="scheme-rating">⭐ 4.7 • 25,000+ {t('home.popularSchemes.beneficiaries', 'beneficiaries')}</div>
              <div className="scheme-benefit">{t('home.popularSchemes.employment.benefit', 'Free training + ₹8,000')}</div>
            </div>
          </Link>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="section-header">
          <h2>{t('home.testimonials.title', 'Success Stories')}</h2>
          <p>{t('home.testimonials.subtitle', 'Real people, real benefits unlocked through Scheme Genie')}</p>
        </div>
        
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>&ldquo;{t('home.testimonials.story1.text', 'I discovered 3 schemes I was eligible for but never knew existed. Scheme Genie helped me get ₹50,000 in education benefits for my daughter!')}&rdquo;</p>
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">👨‍💼</div>
              <div className="author-info">
                <h4>{t('home.testimonials.story1.author', 'Rajesh Kumar')}</h4>
                <span>{t('home.testimonials.story1.location', 'Small Business Owner, Delhi')}</span>
              </div>
            </div>
          </div>
          
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>&ldquo;{t('home.testimonials.story2.text', 'The AI recommendations were spot-on. I got approved for a housing loan subsidy within 2 weeks of applying. This platform is a game-changer!')}&rdquo;</p>
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">👩‍🏫</div>
              <div className="author-info">
                <h4>{t('home.testimonials.story2.author', 'Priya Sharma')}</h4>
                <span>{t('home.testimonials.story2.location', 'Teacher, Mumbai')}</span>
              </div>
            </div>
          </div>
          
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>&ldquo;{t('home.testimonials.story3.text', 'As a farmer, I struggled to find relevant schemes. Scheme Genie found 5 agriculture schemes for me, including PM-KISAN. Highly recommended!')}&rdquo;</p>
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">👨‍🌾</div>
              <div className="author-info">
                <h4>{t('home.testimonials.story3.author', 'Suresh Patel')}</h4>
                <span>{t('home.testimonials.story3.location', 'Farmer, Gujarat')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;