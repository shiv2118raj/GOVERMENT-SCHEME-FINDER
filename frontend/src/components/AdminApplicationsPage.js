import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminPages.css';

const AdminApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
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

    fetchApplications();
  }, [navigate]);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5002/api/admin/applications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyApplication = async (applicationId, status, remarks = '') => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5002/api/applications/verify/${applicationId}`,
        { status, rejectionReason: remarks, adminRemarks: remarks },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refresh applications
      fetchApplications();
      alert(`Application ${status} successfully!`);
    } catch (error) {
      console.error('Error verifying application:', error);
      alert('Error verifying application');
    }
  };

  const [showRemarksModal, setShowRemarksModal] = useState(false);
  const [currentApplication, setCurrentApplication] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [actionType, setActionType] = useState('');

  const filteredApplications = applications.filter(app => {
    const matchesFilter = filter === 'all' || app.status?.toLowerCase() === filter;
    const matchesSearch = searchTerm === '' ||
      app.schemeId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <span>Loading applications...</span>
      </div>
    );
  }

  return (
    <div className="admin-applications-page">
      <div className="container">
        <h1>📋 Applications Management</h1>
        <p>Review and manage all scheme applications</p>

        {/* Filters and Search */}
        <div className="filters-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search applications..."
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
              All ({applications.length})
            </button>
            <button
              className={`btn ${filter === 'pending' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('pending')}
            >
              Pending ({applications.filter(app => app.status === 'pending').length})
            </button>
            <button
              className={`btn ${filter === 'approved' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('approved')}
            >
              Approved ({applications.filter(app => app.status === 'approved').length})
            </button>
            <button
              className={`btn ${filter === 'rejected' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('rejected')}
            >
              Rejected ({applications.filter(app => app.status === 'rejected').length})
            </button>
          </div>
        </div>

        {/* Applications List */}
        <div className="applications-list">
          {filteredApplications.length > 0 ? (
            filteredApplications.map(app => (
              <div key={app._id} className="application-item">
                <div className="application-info">
                  <h4>{app.schemeId?.name}</h4>
                  <div className="application-details">
                    <p><strong>User:</strong> {app.userId?.name}</p>
                    <p><strong>Email:</strong> {app.userId?.email}</p>
                    <p><strong>Applied:</strong> {new Date(app.createdAt).toLocaleDateString()}</p>
                    <p><strong>Status:</strong>
                      <span className={`status-badge status-${app.status?.toLowerCase()}`}>
                        {app.status}
                      </span>
                    </p>
                    {app.trackingId && (
                      <p><strong>Tracking ID:</strong> {app.trackingId}</p>
                    )}
                  </div>
                </div>
                <div className="application-actions">
                  {app.status === 'pending' && (
                    <>
                      <button
                        className="btn btn-success"
                        onClick={() => {
                          // For approval, don't show remarks modal - approve directly
                          handleVerifyApplication(app._id, 'approved');
                        }}
                      >
                        ✅ Approve
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => {
                          setCurrentApplication(app);
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
                    onClick={() => navigate(`/admin/applications/${app._id}`)}
                  >
                    📋 View Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-data">
              <h3>No applications found</h3>
              <p>
                {searchTerm || filter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No applications have been submitted yet.'}
              </p>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="summary-stats">
          <div className="stat-card">
            <div className="stat-number">{applications.filter(app => app.status === 'pending').length}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{applications.filter(app => app.status === 'approved').length}</div>
            <div className="stat-label">Approved</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{applications.filter(app => app.status === 'rejected').length}</div>
            <div className="stat-label">Rejected</div>
          </div>
        </div>
      </div>

      {/* Remarks Modal */}
      {showRemarksModal && (
        <div className="modal-overlay" onClick={() => setShowRemarksModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {actionType === 'rejected' ? 'Reject Application' : 'Approve Application'}: {currentApplication?.schemeId?.name}
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
                      : "Enter optional remarks for this application"
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
                className={`btn ${actionType === 'approved' ? 'btn-success' : 'btn-danger'}`}
                onClick={() => {
                  if (actionType === 'rejected' && !remarks.trim()) {
                    alert('Please enter a reason for rejection');
                    return;
                  }
                  handleVerifyApplication(currentApplication._id, actionType, remarks);
                  setShowRemarksModal(false);
                }}
              >
                {actionType === 'approved' ? '✅ Approve' : '❌ Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminApplicationsPage;
