import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './AdminPages.css';

const AdminApplicationDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is admin
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      navigate('/login');
      return;
    }

    fetchApplicationDetails();
  }, [id, navigate]);

  const fetchApplicationDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5002/api/applications/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplication(response.data);
    } catch (error) {
      console.error('Error fetching application details:', error);
      setError('Failed to load application details');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (status, remarks = '') => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5002/api/applications/verify/${id}`,
        { status, rejectionReason: remarks, adminRemarks: remarks },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refresh application details
      fetchApplicationDetails();
      alert(`Application ${status} successfully!`);
    } catch (error) {
      console.error('Error updating application status:', error);
      alert('Error updating application status');
    }
  };

  if (loading) {
    return (
      <div className="admin-applications-page">
        <div className="container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <h3>Loading Application Details...</h3>
            <p>Please wait while we fetch the application information.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="admin-applications-page">
        <div className="container">
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <h3>Error Loading Application</h3>
            <p>{error || 'The requested application could not be found.'}</p>
            <button
              onClick={() => navigate('/admin/applications')}
              className="btn btn-primary"
            >
              ← Back to Applications
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-applications-page">
      <div className="container">
        <div className="application-details-header">
          <h1>Application Details</h1>
          <button
            onClick={() => navigate('/admin/applications')}
            className="btn btn-secondary"
          >
            ← Back to Applications
          </button>
        </div>

        {/* Application Overview */}
        <div className="application-overview">
          <div className="overview-card">
            <h3>{application.schemeId?.name}</h3>
            <p><strong>Category:</strong> {application.schemeId?.category}</p>
            <p><strong>Status:</strong>
              <span className={`status-badge status-${application.status?.toLowerCase()}`}>
                {application.status}
              </span>
            </p>
            <p><strong>Applied:</strong> {new Date(application.createdAt).toLocaleDateString()}</p>
            {application.trackingId && (
              <p><strong>Tracking ID:</strong> {application.trackingId}</p>
            )}
          </div>
        </div>

        {/* User Information */}
        <div className="details-section">
          <h2>👤 Applicant Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <strong>Name:</strong> {application.userId?.name}
            </div>
            <div className="info-item">
              <strong>Email:</strong> {application.userId?.email}
            </div>
            <div className="info-item">
              <strong>Applied On:</strong> {new Date(application.createdAt).toLocaleDateString()}
            </div>
            {application.submittedAt && (
              <div className="info-item">
                <strong>Submitted On:</strong> {new Date(application.submittedAt).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>

        {/* Application Data */}
        <div className="details-section">
          <h2>📋 Application Data</h2>
          {application.applicationData?.personalInfo && (
            <div className="data-section">
              <h3>Personal Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <strong>Full Name:</strong> {application.applicationData.personalInfo.fullName || 'Not provided'}
                </div>
                <div className="info-item">
                  <strong>Date of Birth:</strong> {application.applicationData.personalInfo.dateOfBirth || 'Not provided'}
                </div>
                <div className="info-item">
                  <strong>Gender:</strong> {application.applicationData.personalInfo.gender || 'Not provided'}
                </div>
                <div className="info-item">
                  <strong>Phone:</strong> {application.applicationData.personalInfo.phone || 'Not provided'}
                </div>
                <div className="info-item">
                  <strong>Address:</strong> {application.applicationData.personalInfo.address || 'Not provided'}
                </div>
                <div className="info-item">
                  <strong>State:</strong> {application.applicationData.personalInfo.state || 'Not provided'}
                </div>
              </div>
            </div>
          )}

          {application.applicationData?.eligibilityInfo && (
            <div className="data-section">
              <h3>Eligibility Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <strong>Annual Income:</strong> {application.applicationData.eligibilityInfo.income || 'Not provided'}
                </div>
                <div className="info-item">
                  <strong>Caste Category:</strong> {application.applicationData.eligibilityInfo.caste || 'Not provided'}
                </div>
                <div className="info-item">
                  <strong>Education:</strong> {application.applicationData.eligibilityInfo.education || 'Not provided'}
                </div>
                <div className="info-item">
                  <strong>Employment:</strong> {application.applicationData.eligibilityInfo.employment || 'Not provided'}
                </div>
              </div>
            </div>
          )}

          {application.applicationData?.documents && application.applicationData.documents.length > 0 && (
            <div className="data-section">
              <h3>📄 Submitted Documents</h3>
              <div className="documents-list">
                {application.applicationData.documents.map((docId, index) => {
                  // In a real app, you'd fetch document details by ID
                  // For now, we'll show a placeholder
                  const mockDoc = {
                    name: `Document ${index + 1}`,
                    category: 'Identity',
                    verificationStatus: 'pending'
                  };

                  return (
                    <div key={index} className="document-item">
                      <div>
                        <strong>{mockDoc.name}</strong>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          {' '}(Category: {mockDoc.category})
                        </span>
                      </div>
                      <span className={`document-status ${mockDoc.verificationStatus}`}>
                        {mockDoc.verificationStatus}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {(!application.applicationData?.documents || application.applicationData.documents.length === 0) && (
            <div className="data-section">
              <h3>📄 Submitted Documents</h3>
              <div className="no-documents">
                <p>No documents submitted with this application.</p>
              </div>
            </div>
          )}
        </div>

        {/* Admin Actions */}
        {application.status === 'pending' && (
          <div className="admin-actions">
            <h2>⚡ Admin Actions</h2>
            <div className="action-buttons">
              <button
                className="btn btn-success"
                onClick={() => {
                  const remarks = prompt('Enter approval remarks (optional):');
                  if (remarks !== null) {
                    handleStatusUpdate('approved', remarks);
                  }
                }}
              >
                ✅ Approve Application
              </button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  const remarks = prompt('Enter rejection reason (required):');
                  if (remarks && remarks.trim()) {
                    handleStatusUpdate('rejected', remarks);
                  } else {
                    alert('Rejection reason is required');
                  }
                }}
              >
                ❌ Reject Application
              </button>
            </div>
          </div>
        )}

        {/* Application Status History */}
        <div className="details-section">
          <h2>📊 Application Status</h2>
          <div className="status-timeline">
            <div className={`status-step ${application.status === 'draft' || ['submitted', 'under_review', 'approved', 'rejected', 'requires_resubmission'].includes(application.status) ? 'completed' : ''}`}>
              <div className="status-icon">📝</div>
              <div className="status-text">Draft</div>
              <div className="status-date">{new Date(application.createdAt).toLocaleDateString()}</div>
            </div>

            <div className={`status-step ${['submitted', 'under_review', 'approved', 'rejected', 'requires_resubmission'].includes(application.status) ? 'completed' : ''}`}>
              <div className="status-icon">✅</div>
              <div className="status-text">Submitted</div>
              <div className="status-date">{application.submittedAt ? new Date(application.submittedAt).toLocaleDateString() : 'Not submitted'}</div>
            </div>

            <div className={`status-step ${['under_review', 'approved', 'rejected', 'requires_resubmission'].includes(application.status) ? 'completed' : ''}`}>
              <div className="status-icon">⏳</div>
              <div className="status-text">Under Review</div>
              <div className="status-date">{application.reviewedAt ? new Date(application.reviewedAt).toLocaleDateString() : 'Not started'}</div>
            </div>

            <div className={`status-step ${application.status === 'approved' ? 'completed' : application.status === 'rejected' ? 'rejected' : ''}`}>
              <div className="status-icon">{application.status === 'rejected' ? '❌' : application.status === 'approved' ? '✅' : '❓'}</div>
              <div className="status-text">{application.status === 'approved' ? 'Approved' : application.status === 'rejected' ? 'Rejected' : 'Pending'}</div>
              <div className="status-date">{application.completedAt ? new Date(application.completedAt).toLocaleDateString() : 'Pending'}</div>
            </div>
          </div>

          {application.rejectionReason && (
            <div className="rejection-reason">
              <strong>Rejection Reason:</strong> {application.rejectionReason}
            </div>
          )}

          {application.adminRemarks && (
            <div className="admin-remarks">
              <strong>Admin Remarks:</strong> {application.adminRemarks}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminApplicationDetailsPage;
