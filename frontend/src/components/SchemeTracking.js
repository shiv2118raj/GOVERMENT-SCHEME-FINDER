import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';
import { CheckCircle, Clock, AlertCircle, TrendingUp, Eye, RefreshCw, ArrowLeft, PackageOpen, Plus } from 'lucide-react';
import './SchemeTracking.css';

const SchemeTracking = () => {
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('applied');
  const [error, setError] = useState(null);
  const { t } = useLanguage();

  useEffect(() => {
    fetchSchemeTracking();
  }, []);

  const fetchSchemeTracking = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }
      
      const response = await axios.get('http://localhost:5002/api/schemes/tracking', {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000 // 10 second timeout
      });
      
      if (!response.data) {
        throw new Error('No data received from server');
      }
      
      setTrackingData(response.data);
    } catch (error) {
      console.error('Error fetching scheme tracking data:', error);
      let errorMessage = 'Failed to load scheme tracking data';
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status === 401) {
          errorMessage = 'Session expired. Please log in again.';
          // Optionally redirect to login
          // window.location.href = '/login';
        } else if (error.response.status === 403) {
          errorMessage = 'You do not have permission to view this data.';
        } else if (error.response.status === 404) {
          errorMessage = 'Scheme tracking data not found.';
        } else if (error.response.data && error.response.data.msg) {
          errorMessage = error.response.data.msg;
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = 'Unable to connect to the server. Please check your internet connection.';
      } else if (error.message) {
        // Something happened in setting up the request that triggered an Error
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={16} className="status-icon approved" />;
      case 'submitted':
      case 'under_review':
        return <Clock size={16} className="status-icon pending" />;
      case 'rejected':
        return <AlertCircle size={16} className="status-icon rejected" />;
      default:
        return <Eye size={16} className="status-icon draft" />;
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      approved: 'Approved',
      submitted: 'Submitted',
      under_review: 'Under Review',
      rejected: 'Rejected',
      draft: 'Draft'
    };
    return statusMap[status] || status;
  };

  if (loading) {
    return (
      <div className="scheme-tracking-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading scheme tracking...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="scheme-tracking-page">
        <div className="error-container">
          <div className="error-icon">
            <AlertCircle size={48} className="error-icon-svg" />
          </div>
          <h2>Error Loading Data</h2>
          <p className="error-message">{error}</p>
          <div className="error-actions">
            <button 
              className="btn btn-primary" 
              onClick={fetchSchemeTracking}
            >
              <RefreshCw size={16} className="mr-2" />
              Retry
            </button>
            <button 
              className="btn btn-secondary ml-2"
              onClick={() => window.location.href = '/schemes'}
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Schemes
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!trackingData) {
    return (
      <div className="scheme-tracking-page">
        <div className="empty-state">
          <div className="empty-icon">
            <PackageOpen size={48} className="text-gray-400" />
          </div>
          <h3>No Scheme Data Available</h3>
          <p>You haven&apos;t applied for any schemes yet.</p>
          <button 
            className="btn btn-primary mt-4"
            onClick={() => window.location.href = '/schemes'}
          >
            <Plus size={16} className="mr-2" />
            Browse Available Schemes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="scheme-tracking-page">
      <div className="tracking-header">
        <h1>📊 {t('schemeTracking.title', 'Scheme Tracking Dashboard')}</h1>
        <p>{t('schemeTracking.subtitle', 'Track your scheme applications and discover new opportunities')}</p>
      </div>

      {/* Summary Stats */}
      <div className="tracking-stats">
        <div className="stat-card">
          <div className="stat-number">{trackingData.totalApplied}</div>
          <div className="stat-label">{t('schemeTracking.stats.applied', 'Applied')}</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{trackingData.totalApproved}</div>
          <div className="stat-label">{t('schemeTracking.stats.approved', 'Approved')}</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{trackingData.totalPending}</div>
          <div className="stat-label">{t('schemeTracking.stats.pending', 'Pending')}</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{trackingData.totalEligible}</div>
          <div className="stat-label">{t('schemeTracking.stats.eligible', 'Eligible')}</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tracking-tabs">
        <button
          className={activeTab === 'applied' ? 'active' : ''}
          onClick={() => setActiveTab('applied')}
        >
          📋 {t('schemeTracking.tabs.applied', 'Applied Schemes')} ({trackingData.totalApplied})
        </button>
        <button
          className={activeTab === 'approved' ? 'active' : ''}
          onClick={() => setActiveTab('approved')}
        >
          ✅ {t('schemeTracking.tabs.approved', 'Approved')} ({trackingData.totalApproved})
        </button>
        <button
          className={activeTab === 'pending' ? 'active' : ''}
          onClick={() => setActiveTab('pending')}
        >
          ⏳ {t('schemeTracking.tabs.pending', 'Pending')} ({trackingData.totalPending})
        </button>
        <button
          className={activeTab === 'eligible' ? 'active' : ''}
          onClick={() => setActiveTab('eligible')}
        >
          🎯 {t('schemeTracking.tabs.eligible', 'Eligible')} ({trackingData.totalEligible})
        </button>
      </div>

      {/* Applied Schemes Tab */}
      {activeTab === 'applied' && (
        <div className="schemes-section">
          <h2>Applied Schemes</h2>
          {trackingData.applied.length === 0 ? (
            <div className="empty-state">
              <p>{t('schemeTracking.empty.noApplied', "You haven't applied for any schemes yet.")}</p>
              <button onClick={() => setActiveTab('eligible')}>
                {t('schemeTracking.actions.browseEligible', 'Browse Eligible Schemes')}
              </button>
            </div>
          ) : (
            <div className="schemes-grid">
              {trackingData.applied.map(scheme => (
                <div key={scheme._id} className="scheme-card">
                  <div className="scheme-header">
                    <h3>{scheme.schemeId?.name}</h3>
                    <div className="scheme-status">
                      {getStatusIcon(scheme.status)}
                      <span className={`status-text ${scheme.status}`}>
                        {t(`schemeTracking.status.${scheme.status}`, getStatusText(scheme.status))}
                      </span>
                    </div>
                  </div>

                  <div className="scheme-details">
                    <p className="scheme-category">
                      🏷️ {scheme.schemeId?.category}
                    </p>
                    <p className="scheme-description">
                      {scheme.schemeId?.description?.substring(0, 100)}...
                    </p>

                    {scheme.status === 'approved' && (
                      <div className="approved-info">
                        <p>✅ {t('schemeTracking.approvedOn', 'Approved on')}: {new Date(scheme.completedAt).toLocaleDateString()}</p>
                        {scheme.trackingId && (
                          <p>🔗 {t('schemeTracking.trackingId', 'Tracking ID')}: {scheme.trackingId}</p>
                        )}
                      </div>
                    )}

                    {scheme.status === 'rejected' && (
                      <div className="rejected-info">
                        <p>❌ Rejected on: {new Date(scheme.completedAt).toLocaleDateString()}</p>
                        {scheme.rejectionReason && (
                          <p className="rejection-reason">
                            {t('schemeTracking.rejectionReason', 'Rejection Reason')}: {scheme.rejectionReason}
                          </p>
                        )}
                      </div>
                    )}

                    {scheme.adminRemarks && (
                      <div className="admin-remarks">
                        <strong>{t('schemeTracking.adminRemarks', 'Admin Remarks')}:</strong>
                        <p>{scheme.adminRemarks}</p>
                      </div>
                    )}
                  </div>

                  <div className="scheme-actions">
                    <button className="btn btn-primary">
                      {t('schemeTracking.actions.viewDetails', 'View Details')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Approved Schemes Tab */}
      {activeTab === 'approved' && (
        <div className="schemes-section">
          <h2>Approved Schemes</h2>
          {trackingData.approved.length === 0 ? (
            <div className="empty-state">
              <p>{t('schemeTracking.empty.noApproved', 'No approved schemes yet.')}</p>
            </div>
          ) : (
            <div className="schemes-grid">
              {trackingData.approved.map(scheme => (
                <div key={scheme._id} className="scheme-card approved">
                  <div className="scheme-header">
                    <h3>{scheme.schemeId?.name}</h3>
                    <div className="scheme-status">
                      <CheckCircle size={16} className="status-icon approved" />
                      <span className="status-text approved">{t('schemeTracking.status.approved', 'Approved')}</span>
                    </div>
                  </div>

                  <div className="scheme-details">
                    <p className="scheme-category">
                      🏷️ {scheme.schemeId?.category}
                    </p>
                    <p className="scheme-description">
                      {scheme.schemeId?.description?.substring(0, 100)}...
                    </p>

                    <div className="approved-info">
                      <p>✅ {t('schemeTracking.approvedOn', 'Approved on')}: {new Date(scheme.completedAt).toLocaleDateString()}</p>
                      {scheme.trackingId && (
                        <p>🔗 {t('schemeTracking.trackingId', 'Tracking ID')}: {scheme.trackingId}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pending Schemes Tab */}
      {activeTab === 'pending' && (
        <div className="schemes-section">
          <h2>Pending Schemes</h2>
          {trackingData.pending.length === 0 ? (
            <div className="empty-state">
              <p>{t('schemeTracking.empty.noPending', 'No pending applications.')}</p>
            </div>
          ) : (
            <div className="schemes-grid">
              {trackingData.pending.map(scheme => (
                <div key={scheme._id} className="scheme-card pending">
                  <div className="scheme-header">
                    <h3>{scheme.schemeId?.name}</h3>
                    <div className="scheme-status">
                      <Clock size={16} className="status-icon pending" />
                      <span className="status-text pending">{t('schemeTracking.status.underReview', 'Under Review')}</span>
                    </div>
                  </div>

                  <div className="scheme-details">
                    <p className="scheme-category">
                      🏷️ {scheme.schemeId?.category}
                    </p>
                    <p className="scheme-description">
                      {scheme.schemeId?.description?.substring(0, 100)}...
                    </p>

                    <div className="pending-info">
                      <p>📅 {t('schemeTracking.appliedOn', 'Applied')}: {new Date(scheme.createdAt).toLocaleDateString()}</p>
                      <p>⏱️ Est. Approval: {scheme.estimatedApprovalDays} days</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Eligible Schemes Tab */}
      {activeTab === 'eligible' && (
        <div className="schemes-section">
          <h2>Eligible Schemes</h2>
          <p className="section-subtitle">
            Schemes you&apos;re eligible for but haven&apos;t applied to yet
          </p>

          {trackingData.eligible.length === 0 ? (
            <div className="empty-state">
              <p>{t('schemeTracking.empty.noEligible', 'No eligible schemes found. Try updating your profile or uploading more documents.')}</p>
            </div>
          ) : (
            <div className="schemes-grid">
              {trackingData.eligible.map(scheme => (
                <div key={scheme._id} className="scheme-card eligible">
                  <div className="scheme-header">
                    <h3>{scheme.name}</h3>
                    <div className="eligibility-score">
                      <TrendingUp size={16} />
                      <span>{scheme.eligibilityScore}/100</span>
                    </div>
                  </div>

                  <div className="scheme-details">
                    <p className="scheme-category">
                      🏷️ {scheme.category}
                    </p>
                    <p className="scheme-description">
                      {scheme.description?.substring(0, 100)}...
                    </p>

                    {scheme.missingDocuments && scheme.missingDocuments.length > 0 && (
                      <div className="missing-documents">
                        <strong>{t('schemeTracking.missingDocuments', 'Missing Documents')}:</strong>
                        <ul>
                          {scheme.missingDocuments.map((doc, idx) => (
                            <li key={idx}>{doc}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="eligibility-info">
                      <p>📊 {t('schemeTracking.eligibilityScore', 'Eligibility Score')}: {scheme.eligibilityScore}/100</p>
                      <p>✅ Ready to apply</p>
                    </div>
                  </div>

                  <div className="scheme-actions">
                    <button className="btn btn-primary">
                      {t('schemeTracking.actions.applyNow', 'Apply Now')}
                    </button>
                    <button className="btn btn-secondary">
                      {t('schemeTracking.actions.viewDetails', 'View Details')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SchemeTracking;
