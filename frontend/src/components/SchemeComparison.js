import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';
import './SchemeComparison.css';

const SchemeComparison = () => {
  const { t } = useLanguage();
  const [schemes, setSchemes] = useState([]);
  const [selectedSchemes, setSelectedSchemes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSchemes, setFilteredSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchemes();
  }, []);

  useEffect(() => {
    filterSchemes();
  }, [schemes, searchTerm]);

  const fetchSchemes = async () => {
    try {
      const response = await axios.get('http://localhost:5002/schemes');
      setSchemes(response.data);
      setFilteredSchemes(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching schemes:', error);
      setLoading(false);
    }
  };

  const filterSchemes = () => {
    if (!searchTerm) {
      setFilteredSchemes(schemes);
      return;
    }

    const filtered = schemes.filter(scheme =>
      scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scheme.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scheme.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSchemes(filtered);
  };

  const addSchemeToComparison = (scheme) => {
    if (selectedSchemes.length >= 3) {
      alert(t('comparison.maxSchemesError', 'You can compare maximum 3 schemes at a time'));
      return;
    }

    if (selectedSchemes.find(s => s._id === scheme._id)) {
      alert(t('comparison.alreadyAddedError', 'This scheme is already added for comparison'));
      return;
    }

    setSelectedSchemes([...selectedSchemes, scheme]);
  };

  const removeSchemeFromComparison = (schemeId) => {
    setSelectedSchemes(selectedSchemes.filter(s => s._id !== schemeId));
  };

  const clearComparison = () => {
    setSelectedSchemes([]);
  };

  const getEligibilityScore = (scheme) => {
    // Simple scoring based on eligibility criteria complexity
    let score = 100;
    if (scheme.eligibility.income && scheme.eligibility.income !== 'No limit') score -= 20;
    if (scheme.eligibility.age && scheme.eligibility.age !== 'All ages') score -= 15;
    if (scheme.eligibility.caste && scheme.eligibility.caste !== 'All') score -= 10;
    if (scheme.eligibility.gender && scheme.eligibility.gender !== 'All') score -= 5;
    return Math.max(score, 40);
  };

  const getBenefitValue = (benefits) => {
    if (!benefits || benefits.length === 0) return 0;
    
    // Extract monetary values from benefits
    const benefitText = benefits.join(' ').toLowerCase();
    const amounts = benefitText.match(/₹[\d,]+/g) || [];
    
    if (amounts.length === 0) return 50; // Default value for non-monetary benefits
    
    const maxAmount = Math.max(...amounts.map(amount => 
      parseInt(amount.replace(/₹|,/g, ''))
    ));
    
    return Math.min(maxAmount / 1000, 100); // Scale to 0-100
  };

  const getProcessingTime = (scheme) => {
    // Estimate processing time based on scheme type
    const category = scheme.category.toLowerCase();
    if (category.includes('financial') || category.includes('loan')) return '30-45 days';
    if (category.includes('housing')) return '45-90 days';
    if (category.includes('education')) return '15-30 days';
    if (category.includes('healthcare')) return '7-15 days';
    return '15-30 days';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Agriculture': '🌾',
      'Education': '📚',
      'Healthcare': '🏥',
      'Housing': '🏠',
      'Employment': '💼',
      'Financial': '💰',
      'MSME': '🏭',
      'Social Security': '🛡️',
      'Energy': '⚡',
      'Infrastructure': '🏗️',
      'Sanitation': '🚿',
      'Digital Services': '💻',
      'Food Security': '🍽️',
      'Women & Child Welfare': '👶',
      'Senior Citizens': '👴',
      'Business': '💼',
      'Disability': '♿'
    };
    return icons[category] || '📋';
  };

  if (loading) {
    return (
      <div className="comparison-loading">
        <div className="loading-spinner"></div>
        <p>{t('common.loading', 'Loading...')}</p>
      </div>
    );
  }

  return (
    <div className="scheme-comparison">
      <div className="comparison-container">
        {/* Header */}
        <div className="comparison-header">
          <h1 className="comparison-title">
            {t('comparison.title', 'Scheme Comparison Tool')}
          </h1>
          <p className="comparison-subtitle">
            {t('comparison.subtitle', 'Compare up to 3 government schemes side-by-side to make informed decisions')}
          </p>
        </div>

        {/* Search and Selection */}
        <div className="scheme-selection">
          <div className="search-section">
            <div className="search-input-container">
              <input
                type="text"
                placeholder={t('comparison.searchPlaceholder', 'Search schemes to compare...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>
          </div>

          <div className="selected-schemes-bar">
            <div className="selected-info">
              <span className="selected-count">
                {selectedSchemes.length}/3 {t('comparison.schemesSelected', 'schemes selected')}
              </span>
              {selectedSchemes.length > 0 && (
                <button onClick={clearComparison} className="clear-btn">
                  {t('comparison.clearAll', 'Clear All')}
                </button>
              )}
            </div>
            
            <div className="selected-schemes-preview">
              {selectedSchemes.map((scheme) => (
                <div key={scheme._id} className="selected-scheme-chip">
                  <span className="scheme-chip-icon">{getCategoryIcon(scheme.category)}</span>
                  <span className="scheme-chip-name">{scheme.name}</span>
                  <button
                    onClick={() => removeSchemeFromComparison(scheme._id)}
                    className="remove-chip-btn"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {selectedSchemes.length < 3 && (
            <div className="scheme-list">
              <h3>{t('comparison.availableSchemes', 'Available Schemes')}</h3>
              <div className="scheme-grid">
                {filteredSchemes.slice(0, 12).map((scheme) => (
                  <div key={scheme._id} className="scheme-card">
                    <div className="scheme-card-header">
                      <span className="scheme-icon">{getCategoryIcon(scheme.category)}</span>
                      <div className="scheme-info">
                        <h4 className="scheme-name">{scheme.name}</h4>
                        <p className="scheme-category">{scheme.category}</p>
                      </div>
                    </div>
                    <p className="scheme-description">
                      {scheme.description.substring(0, 100)}...
                    </p>
                    <button
                      onClick={() => addSchemeToComparison(scheme)}
                      className="add-to-compare-btn"
                      disabled={selectedSchemes.find(s => s._id === scheme._id)}
                    >
                      {selectedSchemes.find(s => s._id === scheme._id) 
                        ? t('comparison.added', 'Added') 
                        : t('comparison.addToCompare', 'Add to Compare')
                      }
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Comparison Table */}
        {selectedSchemes.length > 0 && (
          <div className="comparison-table-section">
            <h2 className="comparison-section-title">
              {t('comparison.comparisonResults', 'Comparison Results')}
            </h2>
            
            <div className="comparison-table">
              <div className="comparison-row header-row">
                <div className="comparison-cell criteria-cell">
                  <strong>{t('comparison.criteria', 'Criteria')}</strong>
                </div>
                {selectedSchemes.map((scheme) => (
                  <div key={scheme._id} className="comparison-cell scheme-header-cell">
                    <div className="scheme-header">
                      <span className="scheme-header-icon">{getCategoryIcon(scheme.category)}</span>
                      <div className="scheme-header-info">
                        <h4>{scheme.name}</h4>
                        <p>{scheme.category}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Benefits */}
              <div className="comparison-row">
                <div className="comparison-cell criteria-cell">
                  <strong>{t('comparison.benefits', 'Benefits')}</strong>
                </div>
                {selectedSchemes.map((scheme) => (
                  <div key={scheme._id} className="comparison-cell">
                    <ul className="benefits-list">
                      {scheme.benefits.slice(0, 3).map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      ))}
                      {scheme.benefits.length > 3 && (
                        <li className="more-benefits">
                          +{scheme.benefits.length - 3} {t('comparison.moreBenefits', 'more')}
                        </li>
                      )}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Eligibility */}
              <div className="comparison-row">
                <div className="comparison-cell criteria-cell">
                  <strong>{t('comparison.eligibility', 'Eligibility')}</strong>
                </div>
                {selectedSchemes.map((scheme) => (
                  <div key={scheme._id} className="comparison-cell">
                    <div className="eligibility-info">
                      <div className="eligibility-score">
                        <div className="score-circle">
                          <span>{getEligibilityScore(scheme)}</span>
                        </div>
                        <span className="score-label">{t('comparison.easyScore', 'Easy Score')}</span>
                      </div>
                      <div className="eligibility-details">
                        {scheme.eligibility.income && (
                          <div className="eligibility-item">
                            <strong>{t('comparison.income', 'Income')}:</strong> {scheme.eligibility.income}
                          </div>
                        )}
                        {scheme.eligibility.age && (
                          <div className="eligibility-item">
                            <strong>{t('comparison.age', 'Age')}:</strong> {scheme.eligibility.age}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Processing Time */}
              <div className="comparison-row">
                <div className="comparison-cell criteria-cell">
                  <strong>{t('comparison.processingTime', 'Processing Time')}</strong>
                </div>
                {selectedSchemes.map((scheme) => (
                  <div key={scheme._id} className="comparison-cell">
                    <div className="processing-time">
                      <span className="time-icon">⏱️</span>
                      <span>{getProcessingTime(scheme)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Documents Required */}
              <div className="comparison-row">
                <div className="comparison-cell criteria-cell">
                  <strong>{t('comparison.documents', 'Documents Required')}</strong>
                </div>
                {selectedSchemes.map((scheme) => (
                  <div key={scheme._id} className="comparison-cell">
                    <div className="documents-count">
                      <span className="doc-icon">📄</span>
                      <span>{scheme.documents.length} {t('comparison.documents', 'documents')}</span>
                    </div>
                    <div className="documents-preview">
                      {scheme.documents.slice(0, 2).map((doc, index) => (
                        <span key={index} className="doc-tag">{doc}</span>
                      ))}
                      {scheme.documents.length > 2 && (
                        <span className="doc-tag more">+{scheme.documents.length - 2}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Application Method */}
              <div className="comparison-row">
                <div className="comparison-cell criteria-cell">
                  <strong>{t('comparison.applicationMethod', 'Application Method')}</strong>
                </div>
                {selectedSchemes.map((scheme) => (
                  <div key={scheme._id} className="comparison-cell">
                    <div className="application-method">
                      <span className="method-icon">💻</span>
                      <span>{t('comparison.onlineOffline', 'Online & Offline')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="comparison-actions">
              {selectedSchemes.map((scheme) => (
                <button key={scheme._id} className="apply-scheme-btn">
                  {t('comparison.applyFor', 'Apply for')} {scheme.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedSchemes.length === 0 && (
          <div className="empty-comparison">
            <div className="empty-icon">📊</div>
            <h3>{t('comparison.noSchemesSelected', 'No schemes selected for comparison')}</h3>
            <p>{t('comparison.selectSchemesMessage', 'Select up to 3 schemes from the list above to start comparing')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchemeComparison;
