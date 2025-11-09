import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
  const { currentLanguage, changeLanguage, supportedLanguages, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (languageCode) => {
    changeLanguage(languageCode);
    setIsOpen(false);
  };

  const currentLang = supportedLanguages.find(lang => lang.code === currentLanguage);

  return (
    <div className="language-switcher">
      <button 
        className="language-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t('language.change', 'Change Language')}
      >
        <span className="language-icon">🌐</span>
        <span className="language-text">{currentLang?.nativeName || 'English'}</span>
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="language-dropdown">
          <div className="dropdown-header">
            <span>{t('language.title', 'Select Language')}</span>
          </div>
          <div className="language-list">
            {supportedLanguages.map((language) => (
              <button
                key={language.code}
                className={`language-option ${currentLanguage === language.code ? 'active' : ''}`}
                onClick={() => handleLanguageChange(language.code)}
              >
                <div className="language-info">
                  <span className="language-native">{language.nativeName}</span>
                  <span className="language-english">{language.name}</span>
                </div>
                {currentLanguage === language.code && (
                  <span className="check-icon">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {isOpen && (
        <div 
          className="language-overlay" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default LanguageSwitcher;
