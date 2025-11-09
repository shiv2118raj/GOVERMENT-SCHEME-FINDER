import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './AdminPages.css';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [pendingApps, setPendingApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is admin
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      navigate('/login');
      return;
    }

    fetchDashboardData();
    fetchPendingApplications();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5002/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    }
  };

  const fetchPendingApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5002/api/applications/pending', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingApps(response.data);
    } catch (error) {
      console.error('Error fetching pending apps:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <span>Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="container">
        <h1>🛠️ Admin Dashboard</h1>
        <p>Comprehensive overview of your government scheme management system</p>

        {/* Stats Cards */}
        <div className="stats">
          <div className="stat-card">
            <div className="stat-number">{dashboardData?.stats?.totalUsers || 0}</div>
            <div className="stat-label">Total Users</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{dashboardData?.stats?.totalApplications || 0}</div>
            <div className="stat-label">Total Applications</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{dashboardData?.stats?.pendingApplications || 0}</div>
            <div className="stat-label">Pending Applications</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{dashboardData?.stats?.approvedApplications || 0}</div>
            <div className="stat-label">Approved Applications</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{dashboardData?.stats?.totalSchemes || 0}</div>
            <div className="stat-label">Total Schemes</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{dashboardData?.stats?.recentUsers || 0}</div>
            <div className="stat-label">New Users (30 days)</div>
          </div>
        </div>

        {/* Admin Navigation */}
        <div className="admin-navigation">
          <h2>🛠️ Admin Management</h2>
          <div className="nav-cards">
            <Link to="/admin/applications" className="nav-card">
              <div className="nav-icon">📋</div>
              <div className="nav-info">
                <h3>All Applications</h3>
                <p>View and manage all applications</p>
              </div>
            </Link>

            <Link to="/admin/application-review" className="nav-card">
              <div className="nav-icon">🔍</div>
              <div className="nav-info">
                <h3>Application Review</h3>
                <p>Review applications before approval</p>
              </div>
            </Link>

            <Link to="/admin/scheme-approval" className="nav-card">
              <div className="nav-icon">🏆</div>
              <div className="nav-info">
                <h3>Scheme Approval</h3>
                <p>Final approval for scheme benefits</p>
              </div>
            </Link>

            <Link to="/admin/users" className="nav-card">
              <div className="nav-icon">👥</div>
              <div className="nav-info">
                <h3>User Management</h3>
                <p>Manage user accounts and permissions</p>
              </div>
            </Link>

            <Link to="/admin/documents" className="nav-card">
              <div className="nav-icon">📄</div>
              <div className="nav-info">
                <h3>Document Management</h3>
                <p>Review and verify user documents</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Applications */}
        <div className="recent-applications">
          <h2>📋 Recent Applications</h2>
          <div className="applications-list">
            {dashboardData?.recentApplications?.length > 0 ? (
              dashboardData.recentApplications.map(app => (
                <div key={app._id} className="application-item">
                  <div className="application-info">
                    <h4>{app.schemeId?.name}</h4>
                    <p><strong>User:</strong> {app.userId?.name}</p>
                    <p><strong>Email:</strong> {app.userId?.email}</p>
                    <p><strong>Status:</strong>
                      <span className={`status-badge status-${app.status?.toLowerCase()}`}>
                        {app.status}
                      </span>
                    </p>
                    <p><strong>Applied:</strong> {new Date(app.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="application-actions">
                    <Link to="/admin/applications" className="btn btn-primary">
                      View All Applications
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-data">
                <p>No recent applications found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Pending Applications Alert */}
        {pendingApps.length > 0 && (
          <div className="pending-alert">
            <h3>⚠️ Pending Applications ({pendingApps.length})</h3>
            <p>You have {pendingApps.length} applications awaiting review.</p>
            <div className="pending-list">
              {pendingApps.slice(0, 5).map(app => (
                <div key={app._id} className="app-item">
                  <div className="app-info">
                    <strong>{app.schemeId?.name}</strong>
                    <p>by {app.userId?.name}</p>
                  </div>
                  <div className="app-actions">
                    <Link to="/admin/applications" className="btn btn-primary">
                      Review
                    </Link>
                  </div>
                </div>
              ))}
              {pendingApps.length > 5 && (
                <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                  <Link to="/admin/applications" className="btn btn-secondary">
                    View All Pending Applications ({pendingApps.length})
                  </Link>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
