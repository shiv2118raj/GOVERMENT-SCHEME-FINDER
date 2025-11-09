import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './AdminPages.css';

const ApplicationReviewPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('under_review');
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

  const handleApplicationAction = async (applicationId, action, remarks = '') => {
    try {
      const token = localStorage.getItem('token');

      // For approval, use direct approval without remarks
      if (action === 'approved') {
        await axios.patch(`http://localhost:5002/api/applications/verify/${applicationId}`,
          { status: 'approved', adminRemarks: remarks },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else if (action === 'rejected') {
        // For rejection, require remarks
        if (!remarks.trim()) {
          alert('Please enter a reason for rejection');
          return;
        }
        await axios.patch(`http://localhost:5002/api/applications/verify/${applicationId}`,
          { status: 'rejected', rejectionReason: remarks, adminRemarks: remarks },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else if (action === 'requires_resubmission') {
        await axios.patch(`http://localhost:5002/api/applications/verify/${applicationId}`,
          { status: 'requires_resubmission', adminRemarks: remarks },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      // Refresh applications
      fetchApplications();
      alert(`Application ${action} successfully!`);
    } catch (error) {
      console.error('Error updating application:', error);
      alert('Error updating application');
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesFilter = filter === 'all' || app.status === filter;
    const matchesSearch = searchTerm === '' ||
      app.schemeId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="admin-applications-page">
        <div className="container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <h3>Loading Applications for Review...</h3>
            <p>Please wait while we fetch the applications.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-applications-page">
      <div className="container">
        <div className="application-details-header">
          <h1>📋 Application Review</h1>
          <Link to="/admin/dashboard" className="btn btn-secondary">
            ← Back to Dashboard
          </Link>
        </div>
        <p>Review and process applications that require admin attention</p>

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
              className={`btn ${filter === 'under_review' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('under_review')}
            >
              Under Review ({applications.filter(app => app.status === 'under_review').length})
            </button>
            <button
              className={`btn ${filter === 'submitted' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('submitted')}
            >
              Submitted ({applications.filter(app => app.status === 'submitted').length})
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
                  <Link to={`/admin/applications/${app._id}`} className="btn btn-secondary">
                    📋 View Details
                  </Link>

                  {app.status === 'submitted' && (
                    <>
                      <button
                        className="btn btn-warning"
                        onClick={() => {
                          const remarks = prompt('Enter review notes (optional):');
                          if (remarks !== null) {
                            handleApplicationAction(app._id, 'under_review', remarks || 'Application under review');
                          }
                        }}
                      >
                        ⏳ Start Review
                      </button>
                    </>
                  )}

                  {app.status === 'under_review' && (
                    <>
                      <button
                        className="btn btn-success"
                        onClick={() => handleApplicationAction(app._id, 'approved')}
                      >
                        ✅ Approve
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => {
                          const remarks = prompt('Enter rejection reason (required):');
                          if (remarks && remarks.trim()) {
                            handleApplicationAction(app._id, 'rejected', remarks);
                          } else {
                            alert('Rejection reason is required');
                          }
                        }}
                      >
                        ❌ Reject
                      </button>
                    </>
                  )}

                  {app.status === 'rejected' && (
                    <button
                      className="btn btn-info"
                      onClick={() => {
                        const remarks = prompt('Enter resubmission request notes:');
                        if (remarks !== null) {
                          handleApplicationAction(app._id, 'requires_resubmission', remarks || 'Please resubmit with corrections');
                        }
                      }}
                    >
                      🔄 Request Resubmission
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="no-data">
              <h3>No applications found</h3>
              <p>
                {searchTerm || filter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No applications require review at this time.'}
              </p>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="summary-stats">
          <div className="stat-card">
            <div className="stat-number">{applications.filter(app => app.status === 'submitted').length}</div>
            <div className="stat-label">Submitted</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{applications.filter(app => app.status === 'under_review').length}</div>
            <div className="stat-label">Under Review</div>
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
    </div>
  );
};

export default ApplicationReviewPage;
