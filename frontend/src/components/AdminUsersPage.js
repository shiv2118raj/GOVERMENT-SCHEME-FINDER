import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminPages.css';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is admin
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      navigate('/login');
      return;
    }

    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5002/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5002/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserDetails(response.data);
      setSelectedUser(userId);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' ||
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <span>Loading users...</span>
      </div>
    );
  }

  return (
    <div className="admin-users-page">
      <div className="container">
        <h1>👥 Users Management</h1>
        <p>Manage and monitor all registered users</p>

        {/* Filters and Search */}
        <div className="filters-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-buttons">
            <button
              className={`btn ${filterRole === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterRole('all')}
            >
              All Users ({users.length})
            </button>
            <button
              className={`btn ${filterRole === 'admin' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterRole('admin')}
            >
              Admins ({users.filter(user => user.role === 'admin').length})
            </button>
            <button
              className={`btn ${filterRole === 'user' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilterRole('user')}
            >
              Users ({users.filter(user => user.role === 'user').length})
            </button>
          </div>
        </div>

        {/* Users List */}
        <div className="users-list">
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <div key={user._id} className="user-item">
                <div className="user-info">
                  <div className="user-header">
                    <h4>{user.name}</h4>
                    <span className={`role-badge ${user.role}`}>
                      {user.role}
                    </span>
                  </div>
                  <div className="user-details">
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                    <p><strong>Documents:</strong> {user.documentsCount}</p>
                    <p><strong>Applications:</strong> {user.applicationsCount}</p>
                  </div>
                </div>
                <div className="user-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => fetchUserDetails(user._id)}
                  >
                    👁️ View Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-data">
              <h3>No users found</h3>
              <p>
                {searchTerm || filterRole !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No users have registered yet.'}
              </p>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="summary-stats">
          <div className="stat-card">
            <div className="stat-number">{users.length}</div>
            <div className="stat-label">Total Users</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{users.filter(user => user.role === 'admin').length}</div>
            <div className="stat-label">Admins</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{users.filter(user => user.role === 'user').length}</div>
            <div className="stat-label">Regular Users</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {users.reduce((total, user) => total + (user.documentsCount || 0), 0)}
            </div>
            <div className="stat-label">Total Documents</div>
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      {userDetails && (
        <div className="user-details-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>👤 {userDetails.user.name}</h2>
              <button
                className="btn btn-secondary close-btn"
                onClick={() => setUserDetails(null)}
              >
                ✕
              </button>
            </div>

            <div className="user-profile">
              <div className="profile-info">
                <p><strong>Email:</strong> {userDetails.user.email}</p>
                <p><strong>Role:</strong>
                  <span className={`role-badge ${userDetails.user.role}`}>
                    {userDetails.user.role}
                  </span>
                </p>
                <p><strong>Joined:</strong> {new Date(userDetails.user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="user-sections">
              <div className="section">
                <h3>📄 Documents ({userDetails.documents.length})</h3>
                <div className="documents-list">
                  {userDetails.documents.length > 0 ? (
                    userDetails.documents.map(doc => (
                      <div key={doc._id} className="doc-item">
                        <div className="doc-info">
                          <strong>{doc.name}</strong>
                          <p>Category: {doc.category}</p>
                          <p>Status:
                            <span className={`status-badge status-${doc.verificationStatus}`}>
                              {doc.verificationStatus}
                            </span>
                          </p>
                          <p>Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="no-data-message">No documents uploaded</p>
                  )}
                </div>
              </div>

              <div className="section">
                <h3>📋 Applications ({userDetails.applications.length})</h3>
                <div className="applications-list">
                  {userDetails.applications.length > 0 ? (
                    userDetails.applications.map(app => (
                      <div key={app._id} className="app-item">
                        <div className="app-info">
                          <strong>{app.schemeId?.name}</strong>
                          <p>Status:
                            <span className={`status-badge status-${app.status?.toLowerCase()}`}>
                              {app.status}
                            </span>
                          </p>
                          <p>Applied: {new Date(app.createdAt).toLocaleDateString()}</p>
                          {app.trackingId && (
                            <p>Tracking ID: {app.trackingId}</p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="no-data-message">No applications submitted</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
