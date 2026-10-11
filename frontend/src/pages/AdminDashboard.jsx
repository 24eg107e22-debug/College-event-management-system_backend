import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Users,
  GraduationCap,
  Briefcase,
  Calendar,
  UserCheck,
  CheckCircle,
  TrendingUp,
  Shield,
  Layers,
  ArrowRight
} from 'lucide-react';

const AdminDashboard = () => {
  const { user, showToast } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        setLoading(true);
        const res = await userService.getAdminStats();
        if (res.data) {
          setStats(res.data);
        }
      } catch (err) {
        showToast('Failed to load administrator statistics', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-main">
          <LoadingSpinner message="Loading system metrics & analytics..." />
        </main>
      </div>
    );
  }

  // Calculate percentages for category breakdown
  const categoryEntries = stats?.eventsByCategory ? Object.entries(stats.eventsByCategory) : [];
  const statusEntries = stats?.eventStatusCounts ? Object.entries(stats.eventStatusCounts) : [];
  const totalEvents = stats?.totalEvents || 1;

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        {/* Header */}
        <div className="dashboard-header">
          <div className="dashboard-title">
            <h1>Admin Control Center 🛡️</h1>
            <p>Complete system analytics, user management, and event governance.</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/admin/users" className="btn btn-secondary btn-sm">
              <Users size={15} /> Manage Users
            </Link>
            <Link to="/admin/events" className="btn btn-primary btn-sm">
              <Calendar size={15} /> Manage Events
            </Link>
          </div>
        </div>

        {/* Dashboard Stat Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon primary">
              <Users size={26} />
            </div>
            <div className="stat-details">
              <span className="stat-value">{stats?.totalUsers ?? 0}</span>
              <span className="stat-label">Total Users</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon secondary">
              <GraduationCap size={26} />
            </div>
            <div className="stat-details">
              <span className="stat-value">{stats?.totalStudents ?? 0}</span>
              <span className="stat-label">Total Students</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon warning">
              <Briefcase size={26} />
            </div>
            <div className="stat-details">
              <span className="stat-value">{stats?.totalOrganizers ?? 0}</span>
              <span className="stat-label">Total Organizers</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon info">
              <Calendar size={26} />
            </div>
            <div className="stat-details">
              <span className="stat-value">{stats?.totalEvents ?? 0}</span>
              <span className="stat-label">Total Events</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon success">
              <UserCheck size={26} />
            </div>
            <div className="stat-details">
              <span className="stat-value">{stats?.totalRegistrations ?? 0}</span>
              <span className="stat-label">Registrations</span>
            </div>
          </div>
        </div>

        {/* Visual Charts & Distribution Section */}
        <div className="charts-grid">
          {/* Events by Category */}
          <div className="chart-card">
            <div className="chart-card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Layers size={18} color="var(--primary)" />
                <h3>Events by Category</h3>
              </div>
              <span className="badge badge-primary">{categoryEntries.length} Categories</span>
            </div>

            <div className="distribution-list">
              {categoryEntries.map(([category, count]) => {
                const percent = Math.round((count / totalEvents) * 100);
                return (
                  <div key={category} className="distribution-item">
                    <div className="dist-meta">
                      <span style={{ color: 'var(--text-main)' }}>{category}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{count} ({percent}%)</span>
                    </div>
                    <div className="dist-bar-bg">
                      <div className="dist-bar-fill" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Event Status Distribution */}
          <div className="chart-card">
            <div className="chart-card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingUp size={18} color="var(--secondary)" />
                <h3>Event Status Breakdown</h3>
              </div>
              <span className="badge badge-neutral">Live Status</span>
            </div>

            <div className="distribution-list">
              {statusEntries.map(([statusName, count]) => {
                const percent = Math.round((count / totalEvents) * 100);
                return (
                  <div key={statusName} className="distribution-item">
                    <div className="dist-meta">
                      <span style={{ color: 'var(--text-main)' }}>{statusName}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{count} ({percent}%)</span>
                    </div>
                    <div className="dist-bar-bg">
                      <div
                        className="dist-bar-fill"
                        style={{
                          width: `${percent}%`,
                          background: statusName === 'CANCELLED' ? 'var(--danger)' : statusName === 'COMPLETED' ? 'var(--text-muted)' : 'var(--success)'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Management Shortcuts */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Administrative Quick Actions</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            <Link to="/admin/users" className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={22} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)' }}>User Directory</h4>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Manage student and organizer access</p>
              </div>
              <ArrowRight size={16} color="var(--text-muted)" />
            </Link>

            <Link to="/admin/events" className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#f3e8ff', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Calendar size={22} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)' }}>Event Governance</h4>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Review, edit, or cancel campus events</p>
              </div>
              <ArrowRight size={16} color="var(--text-muted)" />
            </Link>

            <Link to="/admin/registrations" className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'var(--success-light)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UserCheck size={22} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)' }}>All Registrations</h4>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Audit participant enrolments across events</p>
              </div>
              <ArrowRight size={16} color="var(--text-muted)" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
