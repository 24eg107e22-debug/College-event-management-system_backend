import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { eventService } from '../services/eventService';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Calendar,
  Users,
  CheckCircle,
  PlusCircle,
  Edit,
  Trash2,
  XCircle,
  ArrowRight,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

const OrganizerDashboard = () => {
  const { user, showToast } = useAuth();
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    totalRegistrations: 0,
    completedEvents: 0
  });
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalId, setDeleteModalId] = useState(null);
  const [cancelModalId, setCancelModalId] = useState(null);

  const fetchOrganizerData = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const [statsRes, eventsRes] = await Promise.all([
        eventService.getOrganizerStats(user.id),
        eventService.getOrganizerEvents(user.id)
      ]);

      if (statsRes.data) setStats(statsRes.data);
      if (eventsRes.data) setMyEvents(eventsRes.data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load organizer dashboard', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizerData();
  }, [user?.id]);

  const handleDeleteEvent = async () => {
    if (!deleteModalId) return;
    try {
      await eventService.deleteEvent(deleteModalId);
      showToast('Event deleted successfully', 'success');
      setDeleteModalId(null);
      fetchOrganizerData();
    } catch (err) {
      showToast(err.message || 'Failed to delete event', 'error');
    }
  };

  const handleCancelEvent = async () => {
    if (!cancelModalId) return;
    try {
      await eventService.cancelEvent(cancelModalId);
      showToast('Event status updated to CANCELLED', 'info');
      setCancelModalId(null);
      fetchOrganizerData();
    } catch (err) {
      showToast(err.message || 'Failed to cancel event', 'error');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CANCELLED':
        return <span className="badge badge-danger">Cancelled</span>;
      case 'COMPLETED':
        return <span className="badge badge-neutral">Completed</span>;
      case 'ONGOING':
        return <span className="badge badge-warning">Ongoing</span>;
      default:
        return <span className="badge badge-success">Upcoming</span>;
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        {/* Header */}
        <div className="dashboard-header">
          <div className="dashboard-title">
            <h1>Organizer Dashboard 🎯</h1>
            <p>Welcome back, {user?.name}! Oversee your events, schedules, and participants.</p>
          </div>
          <Link to="/organizer/create-event" className="btn btn-primary">
            <PlusCircle size={18} /> Create New Event
          </Link>
        </div>

        {/* Metric Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon primary">
              <Calendar size={26} />
            </div>
            <div className="stat-details">
              <span className="stat-value">{stats.totalEvents}</span>
              <span className="stat-label">Total Events</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon warning">
              <TrendingUp size={26} />
            </div>
            <div className="stat-details">
              <span className="stat-value">{stats.upcomingEvents}</span>
              <span className="stat-label">Upcoming Events</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon secondary">
              <Users size={26} />
            </div>
            <div className="stat-details">
              <span className="stat-value">{stats.totalRegistrations}</span>
              <span className="stat-label">Total Registrations</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon success">
              <CheckCircle size={26} />
            </div>
            <div className="stat-details">
              <span className="stat-value">{stats.completedEvents}</span>
              <span className="stat-label">Completed Events</span>
            </div>
          </div>
        </div>

        {/* Organizer's Events Table */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>My Organized Events</h2>
            <Link to="/organizer/create-event" className="btn btn-secondary btn-sm">
              <PlusCircle size={15} /> Add Event
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner message="Loading your events..." />
          ) : myEvents.length > 0 ? (
            <div className="table-responsive">
              <table className="cc-table">
                <thead>
                  <tr>
                    <th>Event Title</th>
                    <th>Category</th>
                    <th>Date & Venue</th>
                    <th>Registrations</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {myEvents.map((event) => {
                    const capacityPercent = event.maxParticipants
                      ? Math.min(100, Math.round((event.registeredCount / event.maxParticipants) * 100))
                      : 0;

                    return (
                      <tr key={event.id}>
                        <td>
                          <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>
                            {event.title}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Deadline: {event.registrationDeadline}
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-neutral">{event.category}</span>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.8125rem' }}>
                            <div>📅 {event.eventDate}</div>
                            <div style={{ color: 'var(--text-muted)' }}>📍 {event.venue}</div>
                          </div>
                        </td>
                        <td>
                          <div style={{ minWidth: '130px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                              <span>{event.registeredCount} / {event.maxParticipants}</span>
                              <span>{capacityPercent}%</span>
                            </div>
                            <div className="dist-bar-bg" style={{ height: '6px' }}>
                              <div className="dist-bar-fill" style={{ width: `${capacityPercent}%` }} />
                            </div>
                          </div>
                        </td>
                        <td>{getStatusBadge(event.status)}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Link
                              to={`/organizer/participants?eventId=${event.id}`}
                              className="btn btn-secondary btn-sm"
                              title="View Participant Roster"
                            >
                              <Users size={14} />
                            </Link>
                            <Link
                              to={`/organizer/edit-event/${event.id}`}
                              className="btn btn-secondary btn-sm"
                              title="Edit Event"
                            >
                              <Edit size={14} />
                            </Link>
                            {event.status !== 'CANCELLED' && (
                              <button
                                onClick={() => setCancelModalId(event.id)}
                                className="btn btn-secondary btn-sm"
                                title="Cancel Event"
                                style={{ color: 'var(--warning)' }}
                              >
                                <XCircle size={14} />
                              </button>
                            )}
                            <button
                              onClick={() => setDeleteModalId(event.id)}
                              className="btn btn-secondary btn-sm"
                              title="Delete Event"
                              style={{ color: 'var(--danger)' }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--text-muted)' }}>
              You haven't created any events yet. Click "Create New Event" to get started!
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {deleteModalId && (
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
                  Delete Event Permanently?
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: '1.5' }}>
                  This action cannot be undone. All participant registrations and activities associated with this event will be permanently deleted.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setDeleteModalId(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDeleteEvent}
                >
                  Yes, Delete Event
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cancel Confirmation Modal */}
        {cancelModalId && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  background: 'var(--warning-light)',
                  color: 'var(--warning)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem auto'
                }}>
                  <XCircle size={28} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                  Cancel This Event?
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: '1.5' }}>
                  Marking this event as CANCELLED will prevent any new registrations and notify students that the event is cancelled.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setCancelModalId(null)}
                >
                  Go Back
                </button>
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={handleCancelEvent}
                >
                  Cancel Event
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default OrganizerDashboard;
