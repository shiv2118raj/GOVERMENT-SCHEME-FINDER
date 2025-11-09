import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './FAQSection.css';

const FAQSection = () => {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('general');
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const faqCategories = [
    { id: 'general', name: t('faq.categories.general', 'General'), icon: '❓' },
    { id: 'eligibility', name: t('faq.categories.eligibility', 'Eligibility'), icon: '✅' },
    { id: 'documents', name: t('faq.categories.documents', 'Documents'), icon: '📄' },
    { id: 'application', name: t('faq.categories.application', 'Application'), icon: '📝' },
    { id: 'security', name: t('faq.categories.security', 'Security'), icon: '🔒' },
    { id: 'technical', name: t('faq.categories.technical', 'Technical'), icon: '⚙️' }
  ];

  const faqData = {
    general: [
      {
        question: t('faq.general.q1', 'What is Scheme Genie?'),
        answer: t('faq.general.a1', 'Scheme Genie is an AI-powered platform that helps Indian citizens discover and apply for government schemes they are eligible for. We have 50+ schemes across 17 categories with personalized recommendations.')
      },
      {
        question: t('faq.general.q2', 'Is Scheme Genie free to use?'),
        answer: t('faq.general.a2', 'Yes, Scheme Genie is completely free to use. We believe every citizen should have easy access to government benefits without any cost barriers.')
      },
      {
        question: t('faq.general.q3', 'How accurate are the scheme recommendations?'),
        answer: t('faq.general.a3', 'Our AI analyzes your profile against official government criteria with 95%+ accuracy. However, final eligibility is always determined by the respective government departments.')
      },
      {
        question: t('faq.general.q4', 'Which languages are supported?'),
        answer: t('faq.general.a4', 'We support 12 major Indian languages including Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam, Punjabi, Odia, and Assamese.')
      }
    ],
    eligibility: [
      {
        question: t('faq.eligibility.q1', 'How do I know if I am eligible for a scheme?'),
        answer: t('faq.eligibility.a1', 'Create your profile with accurate information about age, income, location, and family details. Our AI will automatically match you with eligible schemes and show detailed eligibility criteria.')
      },
      {
        question: t('faq.eligibility.q2', 'What if my income changes after applying?'),
        answer: t('faq.eligibility.a2', 'Update your profile immediately when your income changes. Some schemes have income limits, and changes may affect your eligibility. Contact the scheme authority for ongoing applications.')
      },
      {
        question: t('faq.eligibility.q3', 'Can I apply for multiple schemes simultaneously?'),
        answer: t('faq.eligibility.a3', 'Yes, you can apply for multiple schemes as long as you meet the eligibility criteria for each. Some schemes may have restrictions on concurrent benefits.')
      },
      {
        question: t('faq.eligibility.q4', 'What if I belong to multiple categories (SC/ST/OBC)?'),
        answer: t('faq.eligibility.a4', 'Select your primary category as per your official documents. You can benefit from schemes specific to your category, but you cannot claim benefits under multiple categories for the same scheme.')
      }
    ],
    documents: [
      {
        question: t('faq.documents.q1', 'What documents do I need for most schemes?'),
        answer: t('faq.documents.a1', 'Common documents include: Aadhaar Card, Income Certificate, Bank Account details, Address Proof, and Category Certificate (if applicable). Specific requirements vary by scheme.')
      },
      {
        question: t('faq.documents.q2', 'How do I get an Income Certificate?'),
        answer: t('faq.documents.a2', 'Visit your local Tehsildar office or apply online through your state portal. You need salary slips, bank statements, and other income proofs. Processing takes 7-15 days.')
      },
      {
        question: t('faq.documents.q3', 'Are photocopies acceptable?'),
        answer: t('faq.documents.a3', 'Most schemes accept self-attested photocopies for online applications. However, you may need to submit original documents for verification during the approval process.')
      },
      {
        question: t('faq.documents.q4', 'What if my documents are in regional language?'),
        answer: t('faq.documents.a4', 'Documents in regional languages are generally accepted. However, for central government schemes, you may need certified translations. Check specific scheme requirements.')
      }
    ],
    application: [
      {
        question: t('faq.application.q1', 'How long does the application process take?'),
        answer: t('faq.application.a1', 'Application submission takes 10-30 minutes. Processing time varies: 15-30 days for most schemes, 45-90 days for housing/loan schemes, and 7-15 days for direct benefit transfers.')
      },
      {
        question: t('faq.application.q2', 'Can I track my application status?'),
        answer: t('faq.application.a2', 'Yes, use our Applications page to track status. You will also receive SMS/email updates. For detailed tracking, use the official scheme portal with your application number.')
      },
      {
        question: t('faq.application.q3', 'What if my application is rejected?'),
        answer: t('faq.application.a3', 'Check the rejection reason in your application status. You can reapply after correcting issues, appeal the decision, or contact the scheme helpline for clarification.')
      },
      {
        question: t('faq.application.q4', 'Can I edit my application after submission?'),
        answer: t('faq.application.a4', 'Most schemes do not allow editing after submission. However, you can contact the scheme authority for critical corrections or submit a fresh application if permitted.')
      }
    ],
    security: [
      {
        question: t('faq.security.q1', 'Is my personal data safe?'),
        answer: t('faq.security.a1', 'Yes, we use bank-grade encryption and follow strict data protection protocols. Your data is never shared with third parties and is used only for scheme recommendations.')
      },
      {
        question: t('faq.security.q2', 'Do you store my Aadhaar number?'),
        answer: t('faq.security.a2', 'We do not store complete Aadhaar numbers. We only use masked Aadhaar for verification purposes and follow UIDAI guidelines for data handling.')
      },
      {
        question: t('faq.security.q3', 'How do I delete my account?'),
        answer: t('faq.security.a3', 'Go to Profile Settings > Account Management > Delete Account. All your data will be permanently deleted within 30 days as per data protection laws.')
      },
      {
        question: t('faq.security.q4', 'What if I suspect unauthorized access?'),
        answer: t('faq.security.a4', 'Immediately change your password, check login history in settings, and contact our support team. We monitor for suspicious activities and will assist in securing your account.')
      }
    ],
    technical: [
      {
        question: t('faq.technical.q1', 'Why is the app running slowly?'),
        answer: t('faq.technical.a1', 'Clear your browser cache, check internet connection, or try using a different browser. For mobile, ensure you have the latest app version and sufficient storage space.')
      },
      {
        question: t('faq.technical.q2', 'The chatbot is not responding correctly'),
        answer: t('faq.technical.a2', 'Try refreshing the page or restarting the chat. Be specific in your questions and mention your income/location for better recommendations. Report persistent issues to support.')
      },
      {
        question: t('faq.technical.q3', 'Can I use Scheme Genie offline?'),
        answer: t('faq.technical.a3', 'Basic browsing works offline after initial load, but you need internet for real-time recommendations, applications, and status updates. Download important information for offline reference.')
      },
      {
        question: t('faq.technical.q4', 'Which browsers are supported?'),
        answer: t('faq.technical.a4', 'We support Chrome, Firefox, Safari, and Edge (latest versions). For best experience, use Chrome or Firefox with JavaScript enabled and cookies allowed.')
      }
    ]
  };

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <div className="faq-section">
      <div className="faq-container">
        <div className="faq-header">
          <h1 className="faq-title">{t('faq.title', 'Frequently Asked Questions')}</h1>
          <p className="faq-subtitle">
            {t('faq.subtitle', 'Find answers to common questions about Scheme Genie and government schemes')}
          </p>
        </div>

        <div className="faq-content">
          <div className="faq-categories">
            {faqCategories.map((category) => (
              <button
                key={category.id}
                className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
              </button>
            ))}
          </div>

          <div className="faq-list">
            {faqData[activeCategory]?.map((faq, index) => (
              <div key={index} className={`faq-item ${expandedFAQ === index ? 'expanded' : ''}`}>
                <button
                  className="faq-question"
                  onClick={() => toggleFAQ(index)}
                >
                  <span className="question-text">{faq.question}</span>
                  <span className={`expand-icon ${expandedFAQ === index ? 'rotated' : ''}`}>
                    ▼
                  </span>
                </button>
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="faq-footer">
          <div className="help-section">
            <h3>{t('faq.stillNeedHelp', 'Still need help?')}</h3>
            <p>{t('faq.contactInfo', 'Contact our support team or use the chatbot for instant assistance')}</p>
            <div className="help-actions">
              <button className="help-btn primary">
                💬 {t('faq.startChat', 'Start Chat')}
              </button>
              <button className="help-btn secondary">
                📧 {t('faq.contactSupport', 'Contact Support')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
