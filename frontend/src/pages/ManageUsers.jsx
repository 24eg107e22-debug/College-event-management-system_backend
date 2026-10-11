import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Search,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  UserCheck,
  Shield,
  Briefcase,
  GraduationCap
} from 'lucide-react';

const ManageUsers = () => {
  const { user: currentUser, showToast } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals state
  const [deleteModalUser, setDeleteModalUser] = useState(null);
  const [editModalUser, setEditModalUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await userService.getAllUsers();
      if (res.data) {
        setUsers(res.data);
      }
    } catch (err) {
      showToast('Failed to load user list', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (user) => {
    const nextStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await userService.updateUserStatus(user.id, nextStatus);
      showToast(`User status set to ${nextStatus}`, 'success');
      fetchUsers();
    } catch (err) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteModalUser) return;
    try {
      setActionLoading(true);
      await userService.deleteUser(deleteModalUser.id);
      showToast('User deleted successfully', 'success');
      setDeleteModalUser(null);
      fetchUsers();
    } catch (err) {
      showToast(err.message || 'Failed to delete user', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveEditUser = async (e) => {
    e.preventDefault();
    if (!editModalUser) return;
    try {
      setActionLoading(true);
      await userService.updateUser(editModalUser.id, editModalUser);
      showToast('User profile updated successfully', 'success');
      setEditModalUser(null);
      fetchUsers();
    } catch (err) {
      showToast(err.message || 'Failed to update user', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN':
        return <span className="badge badge-primary"><Shield size={12} /> Admin</span>;
      case 'ORGANIZER':
        return <span className="badge badge-info"><Briefcase size={12} /> Organizer</span>;
      default:
        return <span className="badge badge-neutral"><GraduationCap size={12} /> Student</span>;
    }
  };

  // Filter logic
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      !search.trim() ||
      (u.name && u.name.toLowerCase().includes(search.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(search.toLowerCase())) ||
      (u.collegeId && u.collegeId.toLowerCase().includes(search.toLowerCase()));

    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1;
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        <div className="dashboard-header">
          <div className="dashboard-title">
            <h1>User Management</h1>
            <p>Administer student, organizer, and administrator accounts.</p>
          </div>
          <span className="badge badge-primary" style={{ fontSize: '0.8125rem' }}>
            Total Users: {users.length}
          </span>
        </div>

        {/* Filters and Search Bar */}
        <div className="card" style={{ padding: '1.25rem', marginBottom: '1.75rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'center' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={16} style={{ position: 'absolute', left: '0.75rem', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '2.25rem' }}
                placeholder="Search name, email, college ID..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <div>
              <select
                className="form-control"
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="ALL">All Roles</option>
                <option value="STUDENT">Students</option>
                <option value="ORGANIZER">Organizers</option>
                <option value="ADMIN">Admins</option>
              </select>
            </div>

            <div>
              <select
                className="form-control"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active Accounts</option>
                <option value="INACTIVE">Deactivated Accounts</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        {loading ? (
          <LoadingSpinner message="Loading registered users..." />
        ) : filteredUsers.length > 0 ? (
          <>
            <div className="table-responsive">
              <table className="cc-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>User Details</th>
                    <th>College ID</th>
                    <th>Role</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Registered</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((u) => (
                    <tr key={u.id}>
                      <td style={{ fontWeight: '600', color: 'var(--text-muted)' }}>#{u.id}</td>
                      <td>
                        <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{u.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.email}</div>
                      </td>
                      <td>
                        <span className="badge badge-neutral">{u.collegeId || 'N/A'}</span>
                      </td>
                      <td>{getRoleBadge(u.role)}</td>
                      <td style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{u.phone || 'N/A'}</td>
                      <td>
                        {u.status === 'ACTIVE' ? (
                          <span className="badge badge-success">Active</span>
                        ) : (
                          <span className="badge badge-danger">Inactive</span>
                        )}
                      </td>
                      <td style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button
                            onClick={() => setEditModalUser({ ...u })}
                            className="btn btn-secondary btn-sm"
                            title="Edit User"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(u)}
                            className="btn btn-secondary btn-sm"
                            title={u.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                            style={{ color: u.status === 'ACTIVE' ? 'var(--warning)' : 'var(--success)' }}
                          >
                            {u.status === 'ACTIVE' ? <XCircle size={14} /> : <CheckCircle size={14} />}
                          </button>
                          {currentUser?.id !== u.id && (
                            <button
                              onClick={() => setDeleteModalUser(u)}
                              className="btn btn-secondary btn-sm"
                              title="Delete User"
                              style={{ color: 'var(--danger)' }}
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  Previous
                </button>
                <span style={{ display: 'flex', alignItems: 'center', padding: '0 0.75rem', fontSize: '0.875rem', fontWeight: '600' }}>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="btn btn-secondary btn-sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="dashboard-section" style={{ textAlign: 'center', padding: '3.5rem' }}>
            <p style={{ color: 'var(--text-muted)' }}>No users match the search and filter criteria.</p>
          </div>
        )}

        {/* Edit User Modal */}
        {editModalUser && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.25rem' }}>
                Edit User Account
              </h3>
              <form onSubmit={handleSaveEditUser}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editModalUser.name || ''}
                    onChange={(e) => setEditModalUser({ ...editModalUser, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editModalUser.phone || ''}
                    onChange={(e) => setEditModalUser({ ...editModalUser, phone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">College ID</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editModalUser.collegeId || ''}
                    onChange={(e) => setEditModalUser({ ...editModalUser, collegeId: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Role</label>
                  <select
                    className="form-control"
                    value={editModalUser.role || 'STUDENT'}
                    onChange={(e) => setEditModalUser({ ...editModalUser, role: e.target.value })}
                  >
                    <option value="STUDENT">STUDENT</option>
                    <option value="ORGANIZER">ORGANIZER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Account Status</label>
                  <select
                    className="form-control"
                    value={editModalUser.status || 'ACTIVE'}
                    onChange={(e) => setEditModalUser({ ...editModalUser, status: e.target.value })}
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1.5rem' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setEditModalUser(null)}
                    disabled={actionLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={actionLoading}
                  >
                    {actionLoading ? 'Saving...' : 'Save Updates'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModalUser && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  background: 'var(--danger-light)',
                  color: 'var(--danger)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem auto'
                }}>
                  <AlertTriangle size={28} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                  Delete User Account?
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: '1.5' }}>
                  Are you sure you want to permanently delete <strong>{deleteModalUser.name}</strong> ({deleteModalUser.email})?
                  All associated registrations and records will be deleted.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setDeleteModalUser(null)}
                  disabled={actionLoading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDeleteUser}
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Deleting...' : 'Delete User'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ManageUsers;
