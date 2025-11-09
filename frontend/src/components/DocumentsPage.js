import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext';
import './DocumentsPage.css';

const DocumentsPage = () => {
  const { t } = useLanguage();
  const [availableDocuments, setAvailableDocuments] = useState([]);
  const [userDocuments, setUserDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('available');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    name: '',
    category: 'Other',
    description: ''
  });
  const [uploadFile, setUploadFile] = useState(null);

  const documentCategories = [
    { value: 'Aadhaar Card', label: 'Aadhaar Card', icon: '🆔', required: true },
    { value: 'Income Proof', label: 'Income Proof', icon: '💰', required: true },
    { value: 'Caste Certificate', label: 'Caste Certificate', icon: '🏛️', required: true },
    { value: 'PAN Card', label: 'PAN Card', icon: '💳', required: true },
    { value: 'Residence Certificate', label: 'Residence Certificate', icon: '🏠', required: true },
    { value: 'Ration Card', label: 'Ration Card', icon: '🛒', required: true },
    { value: 'Photo', label: 'Photo', icon: '📸', required: true },
    { value: 'Signature', label: 'Signature', icon: '✍️', required: true },
    { value: 'Identity', label: 'Other Identity', icon: '🆔', required: false },
    { value: 'Banking', label: 'Banking', icon: '🏦', required: false },
    { value: 'Education', label: 'Education', icon: '📚', required: false },
    { value: 'Legal', label: 'Legal', icon: '⚖️', required: false },
    { value: 'Other', label: 'Other', icon: '📄', required: false }
  ];

  // Available documents that users need for schemes
  const systemDocuments = [
    { id: 'aadhaar', name: 'Aadhaar Card', category: 'Aadhaar Card', description: 'Required for identity verification', required: true },
    { id: 'income', name: 'Income Proof', category: 'Income Proof', description: 'Proof of annual income', required: true },
    { id: 'caste', name: 'Caste Certificate', category: 'Caste Certificate', description: 'For SC/ST/OBC category benefits', required: true },
    { id: 'pan', name: 'PAN Card', category: 'PAN Card', description: 'Permanent Account Number for tax purposes', required: true },
    { id: 'residence', name: 'Residence Certificate', category: 'Residence Certificate', description: 'Proof of residence', required: true },
    { id: 'ration', name: 'Ration Card', category: 'Ration Card', description: 'Proof of residence and family details', required: true },
    { id: 'photo', name: 'Photo', category: 'Photo', description: 'Recent passport size photograph', required: true },
    { id: 'signature', name: 'Signature', category: 'Signature', description: 'Digital signature for application', required: true },
    { id: 'bank', name: 'Bank Account Details', category: 'Banking', description: 'Bank account for direct benefit transfer', required: false },
    { id: 'education', name: 'Educational Certificates', category: 'Education', description: 'For scholarship and education schemes', required: false }
  ];

  const [expiryStatus, setExpiryStatus] = useState({ expired: [], expiringSoon: [], valid: [] });
  const [showExpiryCheck, setShowExpiryCheck] = useState(false);

  useEffect(() => {
    fetchDocuments();
    checkDocumentExpiry();
  }, []);

  const checkDocumentExpiry = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5002/api/documents/expiry-status', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExpiryStatus(response.data);
      setShowExpiryCheck(true);
    } catch (error) {
      console.error('Error checking document expiry:', error);
    }
  };

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // Fetch user's uploaded documents
      const userDocsResponse = await axios.get('http://localhost:5002/api/documents', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUserDocuments(userDocsResponse.data);
      setAvailableDocuments(systemDocuments);
    } catch (error) {
      console.error('Error fetching documents:', error);
      // Still show system documents even if API fails
      setAvailableDocuments(systemDocuments);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadDocument = async (e) => {
    e.preventDefault();

    if (!uploadForm.name.trim() || !uploadForm.category) {
      alert('Please fill in all required fields');
      return;
    }

    if (!uploadFile) {
      alert('Please select a PDF file to upload');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('name', uploadForm.name);
      formData.append('category', uploadForm.category);
      formData.append('description', uploadForm.description);
      formData.append('document', uploadFile);

      // IMPORTANT: do NOT set Content-Type; the browser will add the correct boundary
      const response = await axios.post('http://localhost:5002/api/documents', formData, {
        headers: { 
          Authorization: `Bearer ${token}`
        }
      });

      setUserDocuments([response.data, ...userDocuments]);
      setShowUploadModal(false);
      setUploadForm({ name: '', category: 'Other', description: '' });
      setUploadFile(null);
      alert('Document uploaded successfully!');
    } catch (error) {
      console.error('Error uploading document:', error);
      const serverMsg = error.response?.data?.msg;
      if (serverMsg) {
        alert(`Failed to upload document: ${serverMsg}`);
      } else if (error.message?.includes('Network')) {
        alert('Cannot reach server. Please ensure backend is running.');
      } else {
        alert('Failed to upload document. Please try again.');
      }
    }
  };

  const handleDeleteDocument = async (documentId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5002/api/documents/${documentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUserDocuments(userDocuments.filter(doc => doc._id !== documentId));
      alert('Document deleted successfully!');
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Failed to delete document. Please try again.');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified': return '✅';
      case 'rejected': return '❌';
      case 'pending': return '⏳';
      case 'needs_review': return '⚠️';
      default: return '📄';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return '#4CAF50';
      case 'rejected': return '#f44336';
      case 'pending': return '#ff9800';
      case 'needs_review': return '#ff6b35';
      default: return '#2196F3';
    }
  };

  const getExpiryIcon = (document) => {
    if (document.isExpired) return '❌';
    if (expiryStatus.expiringSoon.some(doc => doc._id === document._id)) return '⚠️';
    return '✅';
  };

  const getExpiryText = (document) => {
    if (document.isExpired) return 'Expired';
    if (expiryStatus.expiringSoon.some(doc => doc._id === document._id)) return 'Expiring Soon';
    return 'Valid';
  };

  const getExpiryColor = (document) => {
    if (document.isExpired) return '#f44336';
    if (expiryStatus.expiringSoon.some(doc => doc._id === document._id)) return '#ff9800';
    return '#4CAF50';
  };

  const handleReportWrongFile = async (documentId, documentName) => {
    if (!window.confirm(`Are you sure you want to report that "${documentName}" is the wrong file? This will flag it for admin review.`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5002/api/documents/${documentId}/report-wrong`,
        { reason: 'User reported wrong file' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh documents to show updated status
      fetchDocuments();
      alert('Document has been flagged for admin review. An admin will contact you soon.');
    } catch (error) {
      console.error('Error reporting wrong file:', error);
      alert('Error reporting wrong file. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="documents-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="documents-page">
      <div className="documents-header">
        <h1>📄 {t('documents.title', 'Document Management Center')}</h1>
        <p>{t('documents.subtitle', 'Manage your documents for government schemes')}</p>
      </div>

      {/* Tab Navigation */}
      <div className="document-tabs">
        <button
          className={activeTab === 'available' ? 'active' : ''}
          onClick={() => setActiveTab('available')}
        >
          📋 Available Documents
        </button>
        <button
          className={activeTab === 'my-documents' ? 'active' : ''}
          onClick={() => setActiveTab('my-documents')}
        >
          📁 My Documents ({userDocuments.length})
        </button>
      </div>

      {/* Quick Access Button for User's Documents */}
      <div className="quick-access-section">
        <button
          className="view-my-docs-btn"
          onClick={() => setActiveTab('my-documents')}
        >
          👀 View My Uploaded Documents ({userDocuments.length})
        </button>
      </div>

      {/* Available Documents Tab */}
      {activeTab === 'available' && (
        <div className="available-documents">
          <div className="documents-grid">
            {availableDocuments.map(doc => (
              <div key={doc.id} className="document-card">
                <div className="document-icon">
                  {documentCategories.find(cat => cat.value === doc.category)?.icon || '📄'}
                </div>
                <h3>{doc.name}</h3>
                <p className="document-category">{doc.category}</p>
                <p className="document-description">{doc.description}</p>
                <div className={`document-required ${doc.required ? 'required' : 'optional'}`}>
                  {doc.required ? 'Required' : 'Optional'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* My Documents Tab */}
      {activeTab === 'my-documents' && (
        <div className="my-documents">
          <div className="documents-actions">
            <button
              className="upload-btn"
              onClick={() => setShowUploadModal(true)}
            >
              ➕ Upload New Document
            </button>
          </div>

          {userDocuments.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📄</div>
              <h3>No documents uploaded yet</h3>
              <p>Upload your important documents to keep them organized and accessible for scheme applications.</p>
              <button
                className="upload-btn"
                onClick={() => setShowUploadModal(true)}
              >
                Upload Your First Document
              </button>
            </div>
          ) : (
            <div className="documents-list">
              {userDocuments.map(doc => (
                <div key={doc._id} className="document-item">
                  <div className="document-info">
                    <div className="document-icon">
                      {documentCategories.find(cat => cat.value === doc.category)?.icon || '📄'}
                    </div>
                    <div className="document-details">
                      <h4>{doc.name}</h4>
                      <p className="document-category">{doc.category}</p>
                      <p className="document-date">
                        📅 Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}
                      </p>
                      {doc.description && (
                        <p className="document-description">{doc.description}</p>
                      )}
                      {doc.adminRemarks && (
                        <div className="admin-remarks">
                          <strong>Admin Remarks:</strong>
                          <p className="admin-remarks-text">{doc.adminRemarks}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="document-status">
                    <span
                      className="status-badge"
                      style={{
                        backgroundColor: getStatusColor(doc.verificationStatus),
                        color: 'white'
                      }}
                    >
                      {getStatusIcon(doc.verificationStatus)} {doc.verificationStatus}
                    </span>
                  </div>
                  <div className="document-expiry">
                    <span
                      className="expiry-badge"
                      style={{
                        backgroundColor: getExpiryColor(doc),
                        color: 'white'
                      }}
                    >
                      {getExpiryIcon(doc)} {getExpiryText(doc)}
                    </span>
                    {doc.expiryDate && (
                      <span className="expiry-date">
                        Expires: {new Date(doc.expiryDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <div className="document-actions">
                    <button
                      className="report-btn"
                      onClick={() => handleReportWrongFile(doc._id, doc.name)}
                      title="Report if this is the wrong file"
                    >
                      ⚠️ Report Wrong File
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteDocument(doc._id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📄 Upload Document</h2>
              <button
                className="modal-close"
                onClick={() => setShowUploadModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadDocument} className="upload-form">
              <div className="form-group">
                <label htmlFor="documentName">Document Name *</label>
                <input
                  type="text"
                  id="documentName"
                  value={uploadForm.name}
                  onChange={(e) => setUploadForm({...uploadForm, name: e.target.value})}
                  placeholder="Enter document name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="documentCategory">Category *</label>
                <select
                  id="documentCategory"
                  value={uploadForm.category}
                  onChange={(e) => setUploadForm({...uploadForm, category: e.target.value})}
                  required
                >
                  {documentCategories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="documentDescription">Description</label>
                <textarea
                  id="documentDescription"
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
                  placeholder="Optional description or notes"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label htmlFor="documentFile">PDF File *</label>
                <input
                  type="file"
                  id="documentFile"
                  accept="application/pdf"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => setShowUploadModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Upload Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document Categories Overview */}
      <div className="categories-overview">
        <h2>📋 Document Categories</h2>
        <div className="categories-grid">
          {documentCategories.map(cat => (
            <div key={cat.value} className="category-card">
              <div className="category-icon">{cat.icon}</div>
              <h3>{cat.label}</h3>
              <p>Category for organizing documents</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Tips */}
      <div className="quick-tips">
        <h2>💡 Document Management Tips</h2>
        <div className="tips-grid">
          <div className="tip-card">
            <h4>📱 Digital Storage</h4>
            <p>Keep digital copies of all important documents for quick access during scheme applications.</p>
          </div>
          <div className="tip-card">
            <h4>🔄 Regular Updates</h4>
            <p>Update expired documents like income certificates annually to maintain eligibility.</p>
          </div>
          <div className="tip-card">
            <h4>📋 Scheme-Specific</h4>
            <p>Check specific scheme requirements as some may need additional documents.</p>
          </div>
          <div className="tip-card">
            <h4>🏃‍♂️ Early Preparation</h4>
            <p>Start document collection early as some certificates take time to process.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentsPage;
