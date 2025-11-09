import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';
import './ApplicationsPage.css';

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [editingApplication, setEditingApplication] = useState(null);
  const { t } = useLanguage();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5002/api/applications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
    setLoading(false);
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: '#6c757d',
      submitted: '#ffc107',
      under_review: '#17a2b8',
      approved: '#28a745',
      rejected: '#dc3545',
      requires_resubmission: '#6f42c1'
    };
    return colors[status] || '#6c757d';
  };

  const getStatusText = (status) => {
    const statusMap = {
      draft: 'Draft',
      submitted: 'Submitted',
      under_review: 'Under Verification',
      approved: 'Approved',
      rejected: 'Rejected',
      requires_resubmission: 'Requires Resubmission'
    };
    return statusMap[status] || status;
  };

  const getStatusIcon = (status) => {
    const icons = {
      draft: '📝',
      submitted: '✅',
      under_review: '⏳',
      approved: '✅',
      rejected: '❌',
      requires_resubmission: '🔄'
    };
    return icons[status] || '❓';
  };

  const handleEdit = (application) => {
    setEditingApplication({
      ...application,
      applicationData: {
        personalInfo: {
          fullName: '',
          dateOfBirth: '',
          gender: '',
          phone: '',
          address: '',
          state: '',
          district: '',
          pincode: '',
          ...application.applicationData?.personalInfo
        },
        eligibilityInfo: {
          income: '',
          caste: '',
          education: '',
          employment: '',
          ...application.applicationData?.eligibilityInfo
        },
        documents: application.applicationData?.documents || []
      }
    });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5002/api/applications/${editingApplication._id}`,
        {
          applicationData: editingApplication.applicationData,
          status: editingApplication.status
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      alert('Application updated successfully!');
      setEditingApplication(null);
      fetchApplications();
    } catch (error) {
      console.error('Error updating application:', error);
      alert('Error updating application. Please try again.');
    }
  };

  const handleSubmit = async (applicationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5002/api/applications/${applicationId}`,
        { status: 'submitted' },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      alert('Application submitted successfully!');
      fetchApplications();
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Error submitting application. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="applications-page">
        <div className="loading">Loading your applications...</div>
      </div>
    );
  }

  return (
    <div className="applications-page">
      <div className="applications-header">
        <h1>{t('applications.title', 'My Applications')}</h1>
        <p>{t('applications.subtitle', 'Track and manage your scheme applications')}</p>
      </div>

      {applications.length === 0 ? (
        <div className="no-applications">
          <h3>{t('applications.noApplications', 'No applications found')}</h3>
          <p>{t('applications.noApplicationsMessage', 'You haven\'t applied for any schemes yet. Browse schemes to get started!')}</p>
        </div>
      ) : (
        <div className="applications-list">
          {applications.map(application => (
            <div key={application._id} className="application-card">
              <div className="application-header">
                <div className="scheme-info">
                  <h3>{application.schemeId?.name || 'Unknown Scheme'}</h3>
                  <span className="scheme-category">
                    {application.schemeId?.category || 'N/A'}
                  </span>
                </div>
                <div className="status-info">
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(application.status) }}
                  >
                    {getStatusIcon(application.status)} {getStatusText(application.status)}
                  </span>
                </div>
              </div>

              <div className="application-details">
                <div className="detail-item">
                  <strong>Applied on:</strong> {new Date(application.createdAt).toLocaleDateString()}
                </div>
                {application.submittedAt && (
                  <div className="detail-item">
                    <strong>Submitted on:</strong> {new Date(application.submittedAt).toLocaleDateString()}
                  </div>
                )}
                {application.trackingId && (
                  <div className="detail-item">
                    <strong>Tracking ID:</strong> {application.trackingId}
                  </div>
                )}
                {application.estimatedApprovalDays && (
                  <div className="detail-item">
                    <strong>Estimated Approval:</strong> {application.estimatedApprovalDays} days
                  </div>
                )}
                {application.trackingUrl && (
                  <div className="detail-item">
                    <strong>Track Application:</strong>
                    <a href={application.trackingUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', textDecoration: 'none' }}>
                      🔗 Track Status
                    </a>
                  </div>
                )}
                {application.rejectionReason && (
                  <div className="detail-item">
                    <strong>Rejection Reason:</strong> {application.rejectionReason}
                  </div>
                )}
              </div>

              <div className="application-actions">
                <button 
                  className="btn-view"
                  onClick={() => setSelectedApplication(application)}
                >
                  {t('common.viewDetails', 'View Details')}
                </button>
                
                {application.status === 'Pending' && (
                  <>
                    <button 
                      className="btn-edit"
                      onClick={() => handleEdit(application)}
                    >
                      {t('applications.actions.continue', 'Continue Application')}
                    </button>
                    <button 
                      className="btn-submit"
                      onClick={() => handleSubmit(application._id)}
                    >
                      {t('common.submit', 'Submit Application')}
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Application Modal */}
      {selectedApplication && (
        <div className="modal-overlay" onClick={() => setSelectedApplication(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Application Details</h2>
              <button className="close-btn" onClick={() => setSelectedApplication(null)}>×</button>
            </div>
            
            <div className="modal-content">
              <div className="section">
                <h3>Scheme Information</h3>
                <p><strong>Name:</strong> {selectedApplication.schemeId?.name}</p>
                <p><strong>Category:</strong> {selectedApplication.schemeId?.category}</p>
              </div>

              <div className="section">
                <h3>Personal Information</h3>
                <div className="info-grid">
                  <p><strong>Full Name:</strong> {selectedApplication.applicationData?.personalInfo?.fullName || 'Not provided'}</p>
                  <p><strong>Date of Birth:</strong> {selectedApplication.applicationData?.personalInfo?.dateOfBirth || 'Not provided'}</p>
                  <p><strong>Gender:</strong> {selectedApplication.applicationData?.personalInfo?.gender || 'Not provided'}</p>
                  <p><strong>Phone:</strong> {selectedApplication.applicationData?.personalInfo?.phone || 'Not provided'}</p>
                  <p><strong>Address:</strong> {selectedApplication.applicationData?.personalInfo?.address || 'Not provided'}</p>
                  <p><strong>State:</strong> {selectedApplication.applicationData?.personalInfo?.state || 'Not provided'}</p>
                </div>
              </div>

              <div className="section">
                <h3>Application Status</h3>
                <div className="status-timeline">
                  <div className={`status-step ${selectedApplication.status === 'draft' || ['submitted', 'under_review', 'approved', 'rejected', 'requires_resubmission'].includes(selectedApplication.status) ? 'completed' : ''}`}>
                    <div className="status-icon">📝</div>
                    <div className="status-text">Draft</div>
                    <div className="status-date">{new Date(selectedApplication.createdAt).toLocaleDateString()}</div>
                  </div>

                  <div className={`status-step ${['submitted', 'under_review', 'approved', 'rejected', 'requires_resubmission'].includes(selectedApplication.status) ? 'completed' : ''}`}>
                    <div className="status-icon">✅</div>
                    <div className="status-text">Submitted</div>
                    <div className="status-date">{selectedApplication.submittedAt ? new Date(selectedApplication.submittedAt).toLocaleDateString() : 'Not submitted'}</div>
                  </div>

                  <div className={`status-step ${['under_review', 'approved', 'rejected', 'requires_resubmission'].includes(selectedApplication.status) ? 'completed' : ''}`}>
                    <div className="status-icon">⏳</div>
                    <div className="status-text">Under Verification</div>
                    <div className="status-date">{selectedApplication.reviewedAt ? new Date(selectedApplication.reviewedAt).toLocaleDateString() : 'Not started'}</div>
                  </div>

                  <div className={`status-step ${selectedApplication.status === 'approved' ? 'completed' : selectedApplication.status === 'rejected' ? 'rejected' : ''}`}>
                    <div className="status-icon">{selectedApplication.status === 'rejected' ? '❌' : selectedApplication.status === 'approved' ? '✅' : '❓'}</div>
                    <div className="status-text">{selectedApplication.status === 'approved' ? 'Approved' : selectedApplication.status === 'rejected' ? 'Rejected' : 'Pending'}</div>
                    <div className="status-date">{selectedApplication.completedAt ? new Date(selectedApplication.completedAt).toLocaleDateString() : 'Pending'}</div>
                  </div>
                </div>

                <p><strong>Current Status:</strong>
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(selectedApplication.status), marginLeft: '10px' }}
                  >
                    {getStatusIcon(selectedApplication.status)} {getStatusText(selectedApplication.status)}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Application Modal */}
      {editingApplication && (
        <div className="modal-overlay" onClick={() => setEditingApplication(null)}>
          <div className="modal edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Application</h2>
              <button className="close-btn" onClick={() => setEditingApplication(null)}>×</button>
            </div>
            
            <div className="modal-content">
              <div className="section">
                <h3>Personal Information</h3>
                <div className="form-grid">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={editingApplication.applicationData.personalInfo.fullName}
                    onChange={(e) => setEditingApplication(prev => ({
                      ...prev,
                      applicationData: {
                        ...prev.applicationData,
                        personalInfo: {
                          ...prev.applicationData.personalInfo,
                          fullName: e.target.value
                        }
                      }
                    }))}
                  />
                  <input
                    type="date"
                    placeholder="Date of Birth"
                    value={editingApplication.applicationData.personalInfo.dateOfBirth}
                    onChange={(e) => setEditingApplication(prev => ({
                      ...prev,
                      applicationData: {
                        ...prev.applicationData,
                        personalInfo: {
                          ...prev.applicationData.personalInfo,
                          dateOfBirth: e.target.value
                        }
                      }
                    }))}
                  />
                  <input
                    type="text"
                    placeholder="Phone Number"
                    value={editingApplication.applicationData.personalInfo.phone}
                    onChange={(e) => setEditingApplication(prev => ({
                      ...prev,
                      applicationData: {
                        ...prev.applicationData,
                        personalInfo: {
                          ...prev.applicationData.personalInfo,
                          phone: e.target.value
                        }
                      }
                    }))}
                  />
                  <textarea
                    placeholder="Address"
                    value={editingApplication.applicationData.personalInfo.address}
                    onChange={(e) => setEditingApplication(prev => ({
                      ...prev,
                      applicationData: {
                        ...prev.applicationData,
                        personalInfo: {
                          ...prev.applicationData.personalInfo,
                          address: e.target.value
                        }
                      }
                    }))}
                  />
                </div>
              </div>

              <div className="section">
                <h3>Eligibility Information</h3>
                <div className="form-grid">
                  <input
                    type="text"
                    placeholder="Annual Income"
                    value={editingApplication.applicationData.eligibilityInfo.income}
                    onChange={(e) => setEditingApplication(prev => ({
                      ...prev,
                      applicationData: {
                        ...prev.applicationData,
                        eligibilityInfo: {
                          ...prev.applicationData.eligibilityInfo,
                          income: e.target.value
                        }
                      }
                    }))}
                  />
                  <input
                    type="text"
                    placeholder="Caste Category"
                    value={editingApplication.applicationData.eligibilityInfo.caste}
                    onChange={(e) => setEditingApplication(prev => ({
                      ...prev,
                      applicationData: {
                        ...prev.applicationData,
                        eligibilityInfo: {
                          ...prev.applicationData.eligibilityInfo,
                          caste: e.target.value
                        }
                      }
                    }))}
                  />
                  <input
                    type="text"
                    placeholder="Education"
                    value={editingApplication.applicationData.eligibilityInfo.education}
                    onChange={(e) => setEditingApplication(prev => ({
                      ...prev,
                      applicationData: {
                        ...prev.applicationData,
                        eligibilityInfo: {
                          ...prev.applicationData.eligibilityInfo,
                          education: e.target.value
                        }
                      }
                    }))}
                  />
                  <input
                    type="text"
                    placeholder="Employment Status"
                    value={editingApplication.applicationData.eligibilityInfo.employment}
                    onChange={(e) => setEditingApplication(prev => ({
                      ...prev,
                      applicationData: {
                        ...prev.applicationData,
                        eligibilityInfo: {
                          ...prev.applicationData.eligibilityInfo,
                          employment: e.target.value
                        }
                      }
                    }))}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button className="btn-save" onClick={handleSave}>
                  Save Changes
                </button>
                <button className="btn-cancel" onClick={() => setEditingApplication(null)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsPage;
