import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ApplicationTrackingPage.css';

const ApplicationTrackingPage = () => {
  const { trackingId } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userDocuments, setUserDocuments] = useState([]);

  useEffect(() => {
    if (trackingId) {
      fetchApplicationByTrackingId();
      fetchUserDocuments();
    }
  }, [trackingId]);

  const fetchApplicationByTrackingId = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // First try to get application by tracking ID (requires authentication)
      const response = await axios.get(`http://localhost:5002/api/applications/track/${trackingId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setApplication(response.data);
    } catch (error) {
      // If not authenticated or application not found, show public tracking
      try {
        const publicResponse = await axios.get(`http://localhost:5002/api/applications/public-track/${trackingId}`);
        setApplication(publicResponse.data);
      } catch (publicError) {
        setError('Application not found or tracking ID is invalid.');
        console.error('Error fetching application:', publicError);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDocuments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5002/api/documents', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserDocuments(response.data);
    } catch (error) {
      console.error('Error fetching user documents:', error);
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'submitted': '#ffa500',
      'under_review': '#007bff',
      'approved': '#28a745',
      'rejected': '#dc3545',
      'requires_resubmission': '#ffc107',
      'draft': '#6c757d'
    };
    return statusColors[status] || '#6c757d';
  };

  const getStatusText = (status) => {
    const statusTexts = {
      'submitted': 'Submitted',
      'under_review': 'Under Review',
      'approved': 'Approved',
      'rejected': 'Rejected',
      'requires_resubmission': 'Requires Resubmission',
      'draft': 'Draft'
    };
    return statusTexts[status] || status;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await axios.get(`http://localhost:5002/api/applications/track/${trackingId}/pdf`, {
        responseType: 'blob'
      });

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `application-${application.trackingId}.pdf`);
      document.body.appendChild(link);
      link.click();

      // Clean up
      link.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <span>Loading application details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="application-tracking-page">
        <div className="container">
          <div className="error-message">
            <h2>⚠️ Application Not Found</h2>
            <p>{error}</p>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/schemes')}
            >
              Browse Available Schemes
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="application-tracking-page">
        <div className="container">
          <div className="error-message">
            <h2>⚠️ Application Not Found</h2>
            <p>The tracking ID provided is invalid or the application does not exist.</p>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/schemes')}
            >
              Browse Available Schemes
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="application-tracking-page">
      <div className="container">
        <div className="tracking-header">
          <h1>📋 Application Tracking</h1>
          <div className="tracking-id">
            <strong>Tracking ID:</strong> {application.trackingId}
          </div>
        </div>

        <div className="application-card">
          <div className="application-header">
            <h2>{application.schemeId?.name || 'Scheme Details'}</h2>
            <div className="status-badge" style={{ backgroundColor: getStatusColor(application.status) }}>
              {getStatusText(application.status)}
            </div>
          </div>

          <div className="application-details">
            <div className="detail-row">
              <div className="detail-item">
                <strong>Scheme Category:</strong>
                <span>{application.schemeId?.category || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <strong>Applied Date:</strong>
                <span>{formatDate(application.createdAt)}</span>
              </div>
            </div>

            {application.submittedAt && (
              <div className="detail-row">
                <div className="detail-item">
                  <strong>Submitted Date:</strong>
                  <span>{formatDate(application.submittedAt)}</span>
                </div>
                <div className="detail-item">
                  <strong>Estimated Approval:</strong>
                  <span>{application.estimatedApprovalDays || 30} days</span>
                </div>
              </div>
            )}

            {application.reviewedAt && (
              <div className="detail-row">
                <div className="detail-item">
                  <strong>Review Started:</strong>
                  <span>{formatDate(application.reviewedAt)}</span>
                </div>
                <div className="detail-item">
                  <strong>Reviewed By:</strong>
                  <span>Admin Team</span>
                </div>
              </div>
            )}

            {application.completedAt && (
              <div className="detail-row">
                <div className="detail-item">
                  <strong>Completed Date:</strong>
                  <span>{formatDate(application.completedAt)}</span>
                </div>
              </div>
            )}

            {application.rejectionReason && (
              <div className="rejection-reason">
                <strong>Rejection Reason:</strong>
                <p>{application.rejectionReason}</p>
              </div>
            )}

            {application.adminRemarks && (
              <div className="admin-remarks">
                <strong>Admin Remarks:</strong>
                <p>{application.adminRemarks}</p>
              </div>
            )}
          </div>

          {/* Documents Section */}
          <div className="documents-section">
            <h3>📄 Uploaded Documents</h3>
            <div className="documents-grid">
              {userDocuments.length > 0 ? (
                userDocuments.map((doc, index) => (
                  <div key={index} className="document-card">
                    <div className="document-header">
                      <h4>{doc.name}</h4>
                      <span className={`status-badge ${doc.verificationStatus}`}>
                        {doc.verificationStatus}
                      </span>
                    </div>
                    <div className="document-details">
                      <p><strong>Type:</strong> {doc.category}</p>
                      <p><strong>Uploaded:</strong> {formatDate(doc.uploadDate)}</p>
                      {doc.documentNumber && (
                        <p><strong>Document Number:</strong> {doc.documentNumber}</p>
                      )}
                      {doc.issuingAuthority && (
                        <p><strong>Issuing Authority:</strong> {doc.issuingAuthority}</p>
                      )}
                      {doc.issueDate && (
                        <p><strong>Issue Date:</strong> {formatDate(doc.issueDate)}</p>
                      )}
                      {doc.expiryDate && (
                        <p><strong>Expiry Date:</strong> {formatDate(doc.expiryDate)}</p>
                      )}
                      {doc.ocrData && doc.ocrData.isProcessed && (
                        <div className="ocr-info">
                          <p><strong>OCR Confidence:</strong> {Math.round(doc.ocrData.confidence)}%</p>
                          {doc.ocrData.extractedText && (
                            <details>
                              <summary>Extracted Text</summary>
                              <div className="extracted-text">
                                {doc.ocrData.extractedText.substring(0, 200)}
                                {doc.ocrData.extractedText.length > 200 && '...'}
                              </div>
                            </details>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-documents">
                  <p>No documents uploaded yet.</p>
                </div>
              )}
            </div>
          </div>

          <div className="tracking-timeline">
            <h3>Application Timeline</h3>
            <div className="timeline">
              <div className={`timeline-item ${application.status !== 'draft' ? 'completed' : ''}`}>
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <h4>Application Created</h4>
                  <p>{formatDate(application.createdAt)}</p>
                </div>
              </div>

              {application.submittedAt && (
                <div className={`timeline-item ${['submitted', 'under_review', 'approved', 'rejected'].includes(application.status) ? 'completed' : ''}`}>
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <h4>Application Submitted</h4>
                    <p>{formatDate(application.submittedAt)}</p>
                  </div>
                </div>
              )}

              {application.reviewedAt && (
                <div className={`timeline-item ${['under_review', 'approved', 'rejected'].includes(application.status) ? 'completed' : ''}`}>
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <h4>Under Review</h4>
                    <p>{formatDate(application.reviewedAt)}</p>
                  </div>
                </div>
              )}

              {application.completedAt && (
                <div className={`timeline-item ${['approved', 'rejected'].includes(application.status) ? 'completed' : ''}`}>
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <h4>{application.status === 'approved' ? 'Approved' : 'Completed'}</h4>
                    <p>{formatDate(application.completedAt)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="tracking-actions">
            <button
              className="btn btn-primary"
              onClick={() => handleDownloadPDF()}
            >
              📄 Download PDF
            </button>

            {application.status === 'approved' && (
              <div className="success-message">
                <h3>🎉 Congratulations!</h3>
                <p>Your application has been approved. You can now proceed with the next steps.</p>
              </div>
            )}

            {application.status === 'rejected' && (
              <div className="error-message">
                <h3>❌ Application Rejected</h3>
                <p>Your application has been rejected. Please review the rejection reason above.</p>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/schemes')}
                >
                  Apply for Other Schemes
                </button>
              </div>
            )}

            {application.status === 'requires_resubmission' && (
              <div className="warning-message">
                <h3>📝 Resubmission Required</h3>
                <p>Please review the admin remarks and resubmit your application with corrections.</p>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/applications')}
                >
                  View My Applications
                </button>
              </div>
            )}

            {['submitted', 'under_review'].includes(application.status) && (
              <div className="info-message">
                <h3>⏳ Application in Progress</h3>
                <p>Your application is being processed. We&apos;ll notify you once there&apos;s an update.</p>
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate('/dashboard')}
                >
                  Back to Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationTrackingPage;
