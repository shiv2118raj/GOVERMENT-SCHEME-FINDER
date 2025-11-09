import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './AdminPages.css';

const SchemeApprovalPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('approved');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is admin
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      navigate('/login');
      return;
    }

    fetchApprovedApplications();
  }, [navigate]);

  const fetchApprovedApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5002/api/admin/applications', {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Filter to only show approved applications that need final scheme approval
      const approvedApps = response.data.filter(app => app.status === 'approved');
      setApplications(approvedApps);
    } catch (error) {
      console.error('Error fetching approved applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSchemeApproval = async (applicationId, action, remarks = '') => {
    try {
      const token = localStorage.getItem('token');

      // For final scheme approval, we'll use a special status
      const finalStatus = action === 'final_approved' ? 'final_approved' : 'final_rejected';

      await axios.patch(`http://localhost:5002/api/applications/verify/${applicationId}`,
        {
          status: finalStatus,
          finalApprovalRemarks: remarks,
          finalApprovedAt: new Date(),
          finalApprovedBy: 'admin'
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh applications
      fetchApprovedApplications();
      alert(`Scheme ${action === 'final_approved' ? 'approved' : 'rejected'} successfully!`);
    } catch (error) {
      console.error('Error processing scheme approval:', error);
      alert('Error processing scheme approval');
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
            <h3>Loading Scheme Approvals...</h3>
            <p>Please wait while we fetch the approved applications.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-applications-page">
      <div className="container">
        <div className="application-details-header">
          <h1>🏆 Scheme Final Approval</h1>
          <Link to="/admin/dashboard" className="btn btn-secondary">
            ← Back to Dashboard
          </Link>
        </div>
        <p>Final approval for users to receive scheme benefits</p>

        {/* Filters and Search */}
        <div className="filters-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search approved applications..."
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
              All Approved ({applications.length})
            </button>
            <button
              className={`btn ${filter === 'approved' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('approved')}
            >
              Approved ({applications.filter(app => app.status === 'approved').length})
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
                    <p><strong>Approved:</strong> {new Date(app.reviewedAt || app.createdAt).toLocaleDateString()}</p>
                    <p><strong>Status:</strong>
                      <span className={`status-badge status-${app.status?.toLowerCase()}`}>
                        {app.status}
                      </span>
                    </p>
                    {app.trackingId && (
                      <p><strong>Tracking ID:</strong> {app.trackingId}</p>
                    )}
                    {app.adminRemarks && (
                      <p><strong>Admin Notes:</strong> {app.adminRemarks}</p>
                    )}
                  </div>
                </div>
                <div className="application-actions">
                  <Link to={`/admin/applications/${app._id}`} className="btn btn-secondary">
                    📋 View Details
                  </Link>

                  <button
                    className="btn btn-success"
                    onClick={() => {
                      const remarks = prompt('Enter final approval notes (optional):');
                      if (remarks !== null) {
                        handleSchemeApproval(app._id, 'final_approved', remarks || 'Final approval granted');
                      }
                    }}
                  >
                    ✅ Grant Scheme Benefits
                  </button>

                  <button
                    className="btn btn-warning"
                    onClick={() => {
                      const remarks = prompt('Enter reason for holding benefits (required):');
                      if (remarks && remarks.trim()) {
                        handleSchemeApproval(app._id, 'final_rejected', remarks);
                      } else {
                        alert('Reason is required for holding benefits');
                      }
                    }}
                  >
                    ⏳ Hold Benefits
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-data">
              <h3>No approved applications found</h3>
              <p>
                {searchTerm
                  ? 'Try adjusting your search criteria.'
                  : 'No applications have been approved yet for final scheme approval.'}
              </p>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="summary-stats">
          <div className="stat-card">
            <div className="stat-number">{applications.length}</div>
            <div className="stat-label">Approved Applications</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{applications.filter(app => app.status === 'final_approved').length}</div>
            <div className="stat-label">Benefits Granted</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{applications.filter(app => app.status === 'final_rejected').length}</div>
            <div className="stat-label">Benefits Held</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{applications.filter(app => app.status === 'approved').length}</div>
            <div className="stat-label">Pending Final Approval</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchemeApprovalPage;
