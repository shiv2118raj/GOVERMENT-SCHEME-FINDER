import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';
import './SchemesPage.css';

const SchemesPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [schemes, setSchemes] = useState([]);
  const [filteredSchemes, setFilteredSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedScheme, setSelectedScheme] = useState(null);

  const categories = [
    'All', 'Agriculture', 'Education', 'Healthcare', 'Housing', 'Employment', 
    'Financial', 'MSME', 'Social Security', 'Energy', 'Infrastructure', 
    'Sanitation', 'Digital Services', 'Food Security', 'Women & Child Welfare', 
    'Senior Citizens', 'Business', 'Disability'
  ];

  useEffect(() => {
    fetchSchemes();
  }, []);

  useEffect(() => {
    filterSchemes();
  }, [schemes, searchTerm, selectedCategory]);

  const fetchSchemes = async () => {
    try {
      const response = await axios.get('http://localhost:5002/api/schemes');
      setSchemes(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching schemes:', error);
      setLoading(false);
    }
  };

  const filterSchemes = () => {
    let filtered = schemes;

    if (selectedCategory && selectedCategory !== 'All') {
      filtered = filtered.filter(scheme => scheme.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(scheme =>
        scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scheme.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredSchemes(filtered);
  };

  const handleApply = (schemeId) => {
    navigate(`/apply/${schemeId}`);
  };

  if (loading) {
    return (
      <div className="schemes-page">
        <div className="loading">Loading schemes...</div>
      </div>
    );
  }

  return (
    <div className="schemes-page">
      <div className="schemes-header">
        <h1>{t('schemes.title', 'Government Schemes')}</h1>
        <p>{t('schemes.subtitle', 'Discover schemes that you\'re eligible for')}</p>
      </div>

      <div className="schemes-filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder={t('schemes.searchPlaceholder', 'Search schemes...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="category-filter">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {t(`schemes.categories.${category.toLowerCase().replace(/\s+/g, '').replace('&', '')}`, category)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="schemes-grid">
        {filteredSchemes.map(scheme => (
          <div key={scheme._id} className="scheme-card">
            <div className="scheme-header">
              <h3>{scheme.name}</h3>
              <span className={`category-badge ${scheme.category.toLowerCase()}`}>
                {scheme.category}
              </span>
            </div>
            
            <p className="scheme-description">{scheme.description}</p>
            
            <div className="scheme-benefits">
              <h4>{t('schemes.card.benefits', 'Benefits:')}:</h4>
              <ul>
                {scheme.benefits.slice(0, 2).map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
                {scheme.benefits.length > 2 && <li>+ {scheme.benefits.length - 2} {t('schemes.card.moreItems', 'more')}</li>}
              </ul>
            </div>

            <div className="scheme-eligibility">
              <h4>{t('schemes.card.eligibility', 'Eligibility:')}:</h4>
              <div className="eligibility-tags">
                {scheme.eligibility.income && (
                  <span className="tag">{t('schemes.card.income', 'Income')}: {scheme.eligibility.income}</span>
                )}
                {scheme.eligibility.minAge && (
                  <span className="tag">{t('schemes.card.age', 'Age')}: {scheme.eligibility.minAge}+ years</span>
                )}
                {scheme.eligibility.caste && scheme.eligibility.caste[0] !== 'All' && (
                  <span className="tag">{t('schemes.card.caste', 'Caste')}: {scheme.eligibility.caste.join(', ')}</span>
                )}
              </div>
            </div>

            <div className="scheme-actions">
              <button 
                className="btn-view-details"
                onClick={() => setSelectedScheme(scheme)}
              >
                {t('common.viewDetails', 'View Details')}
              </button>
              <button 
                className="btn-apply"
                onClick={() => handleApply(scheme._id)}
              >
                {t('common.applyNow', 'Apply Now')}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredSchemes.length === 0 && (
        <div className="no-schemes">
          <h3>{t('schemes.noSchemesFound', 'No schemes found')}</h3>
          <p>{t('schemes.noSchemesMessage', 'Try adjusting your search or filter criteria')}</p>
        </div>
      )}

      {selectedScheme && (
        <div className="scheme-modal-overlay" onClick={() => setSelectedScheme(null)}>
          <div className="scheme-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedScheme.name}</h2>
              <button className="close-btn" onClick={() => setSelectedScheme(null)}>×</button>
            </div>
            
            <div className="modal-content">
              <div className="modal-section">
                <h3>Description</h3>
                <p>{selectedScheme.description}</p>
              </div>

              <div className="modal-section">
                <h3>Benefits</h3>
                <ul>
                  {selectedScheme.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>

              <div className="modal-section">
                <h3>Required Documents</h3>
                <ul>
                  {selectedScheme.documents.map((doc, index) => (
                    <li key={index}>{doc}</li>
                  ))}
                </ul>
              </div>

              <div className="modal-section">
                <h3>Application Process</h3>
                <p>{selectedScheme.applicationProcess}</p>
              </div>

              {selectedScheme.officialWebsite && (
                <div className="modal-section">
                  <h3>Official Website</h3>
                  <a href={selectedScheme.officialWebsite} target="_blank" rel="noopener noreferrer">
                    {selectedScheme.officialWebsite}
                  </a>
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button 
                className="btn-apply-modal"
                onClick={() => {
                  handleApply(selectedScheme._id);
                  setSelectedScheme(null);
                }}
              >
                Apply for this Scheme
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchemesPage;
