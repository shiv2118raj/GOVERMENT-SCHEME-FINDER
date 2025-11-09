import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import './AdminPages.css';

const AdminDocumentsPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is admin
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      navigate('/login');
      return;
    }

    fetchDocuments();
  }, [navigate]);

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5002/api/admin/documents', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyDocument = async (documentId, status, remarks = '') => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5002/api/admin/documents/${documentId}`,
        { status, adminRemarks: remarks },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refresh documents
      fetchDocuments();
      alert(`Document ${status} successfully!`);
    } catch (error) {
      console.error('Error verifying document:', error);
      alert('Error verifying document');
    }
  };

  const [showRemarksModal, setShowRemarksModal] = useState(false);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [actionType, setActionType] = useState('');

  const filteredDocuments = documents.filter(doc => {
    const matchesFilter = filter === 'all' || doc.verificationStatus === filter;
    const matchesSearch = searchTerm === '' ||
      doc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <span>Loading documents...</span>
      </div>
    );
  }

  return (
    <div className="admin-applications-page">
      <div className="container">
        <h1>📄 Documents Management</h1>
        <p>Review and verify user documents</p>

        {/* Filters and Search */}
        <div className="filters-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-buttons">
            <button
              className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('all')}
            >
              All ({documents.length})
            </button>
            <button
              className={`btn ${filter === 'pending' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('pending')}
            >
              Pending ({documents.filter(doc => doc.verificationStatus === 'pending').length})
            </button>
            <button
              className={`btn ${filter === 'verified' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('verified')}
            >
              Verified ({documents.filter(doc => doc.verificationStatus === 'verified').length})
            </button>
            <button
              className={`btn ${filter === 'rejected' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('rejected')}
            >
              Rejected ({documents.filter(doc => doc.verificationStatus === 'rejected').length})
            </button>
          </div>
        </div>

        {/* Documents List */}
        <div className="applications-list">
          {filteredDocuments.length > 0 ? (
            filteredDocuments.map(doc => (
              <div key={doc._id} className="application-item">
                <div className="application-info">
                  <h4>{doc.name}</h4>
                  <div className="application-details">
                    <p><strong>Category:</strong> {doc.category}</p>
                    <p><strong>User:</strong> {doc.userId?.name}</p>
                    <p><strong>Email:</strong> {doc.userId?.email}</p>
                    <p><strong>Uploaded:</strong> {new Date(doc.uploadDate).toLocaleDateString()}</p>
                    <p><strong>Size:</strong> {(doc.size / 1024).toFixed(2)} KB</p>
                    <p><strong>Status:</strong>
                      <span className={`status-badge status-${doc.verificationStatus}`}>
                        {doc.verificationStatus}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="application-actions">
                  {doc.verificationStatus === 'pending' && (
                    <>
                      <button
                        className="btn btn-success"
                        onClick={() => {
                          // For verification, don't show remarks modal - verify directly
                          handleVerifyDocument(doc._id, 'verified');
                        }}
                      >
                        ✅ Verify
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => {
                          setCurrentDocument(doc);
                          setActionType('rejected');
                          setRemarks('');
                          setShowRemarksModal(true);
                        }}
                      >
                        ❌ Reject
                      </button>
                    </>
                  )}
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      if (doc.fileName) {
                        window.open(`http://localhost:5002/uploads/${doc.fileName}`, '_blank');
                      } else {
                        alert('Document file not available');
                      }
                    }}
                  >
                    📄 View File
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-data">
              <h3>No documents found</h3>
              <p>
                {searchTerm || filter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No documents have been uploaded yet.'}
              </p>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="summary-stats">
          <div className="stat-card">
            <div className="stat-number">{documents.filter(doc => doc.verificationStatus === 'pending').length}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{documents.filter(doc => doc.verificationStatus === 'verified').length}</div>
            <div className="stat-label">Verified</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{documents.filter(doc => doc.verificationStatus === 'rejected').length}</div>
            <div className="stat-label">Rejected</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{documents.length}</div>
            <div className="stat-label">Total Documents</div>
          </div>
        </div>
      </div>

      {/* Remarks Modal */}
      {showRemarksModal && (
        <div className="modal-overlay" onClick={() => setShowRemarksModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {actionType === 'rejected' ? 'Reject Document' : 'Verify Document'}: {currentDocument?.name}
              </h2>
              <button
                className="modal-close"
                onClick={() => setShowRemarksModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="remarks">
                  {actionType === 'rejected' ? 'Rejection Reason *' : 'Admin Remarks'}
                </label>
                <textarea
                  id="remarks"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder={
                    actionType === 'rejected'
                      ? "Enter reason for rejection (required)"
                      : "Enter optional remarks for this document"
                  }
                  rows="4"
                  required={actionType === 'rejected'}
                />
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setShowRemarksModal(false)}
              >
                Cancel
              </button>
              <button
                className={`btn ${actionType === 'verified' ? 'btn-success' : 'btn-danger'}`}
                onClick={() => {
                  if (actionType === 'rejected' && !remarks.trim()) {
                    alert('Please enter a reason for rejection');
                    return;
                  }
                  handleVerifyDocument(currentDocument._id, actionType, remarks);
                  setShowRemarksModal(false);
                }}
              >
                {actionType === 'verified' ? '✅ Verify' : '❌ Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDocumentsPage;
