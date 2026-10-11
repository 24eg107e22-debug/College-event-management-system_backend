import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { eventService } from '../services/eventService';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Calendar,
  PlusCircle,
  Search,
  Edit,
  Trash2,
  Users,
  XCircle,
  CheckCircle,
  AlertTriangle,
  Eye
} from 'lucide-react';

const ManageEvents = () => {
  const { showToast } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const [deleteModalId, setDeleteModalId] = useState(null);
  const [cancelModalId, setCancelModalId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await eventService.getAllEvents({
        search,
        category: categoryFilter,
        status: statusFilter
      });
      if (res.data) {
        setEvents(res.data);
      }
    } catch (err) {
      showToast('Failed to load events list', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [categoryFilter, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEvents();
  };

  const handleDeleteEvent = async () => {
    if (!deleteModalId) return;
    try {
      setActionLoading(true);
      await eventService.deleteEvent(deleteModalId);
      showToast('Event permanently deleted', 'success');
      setDeleteModalId(null);
      fetchEvents();
    } catch (err) {
      showToast(err.message || 'Failed to delete event', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelEvent = async () => {
    if (!cancelModalId) return;
    try {
      setActionLoading(true);
      await eventService.cancelEvent(cancelModalId);
      showToast('Event status updated to CANCELLED', 'info');
      setCancelModalId(null);
      fetchEvents();
    } catch (err) {
      showToast(err.message || 'Failed to cancel event', 'error');
    } finally {
      setActionLoading(false);
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
        <div className="dashboard-header">
          <div className="dashboard-title">
            <h1>All Campus Events</h1>
            <p>Administer, modify, and monitor events organized across all college societies.</p>
          </div>
          <Link to="/organizer/create-event" className="btn btn-primary btn-sm">
            <PlusCircle size={16} /> Create Event
          </Link>
        </div>

        {/* Filter and Search Bar */}
        <div className="card" style={{ padding: '1.25rem', marginBottom: '1.75rem' }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'center' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={16} style={{ position: 'absolute', left: '0.75rem', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '2.25rem' }}
                placeholder="Search event name, venue..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div>
              <select
                className="form-control"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="All">All Categories</option>
                <option value="Technical">Technical</option>
                <option value="Cultural">Cultural</option>
                <option value="Workshop">Workshop</option>
                <option value="Seminar">Seminar</option>
                <option value="Sports">Sports</option>
                <option value="Competition">Competition</option>
                <option value="Fest">Fest</option>
              </select>
            </div>

            <div>
              <select
                className="form-control"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="UPCOMING">Upcoming</option>
                <option value="ONGOING">Ongoing</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <button type="submit" className="btn btn-secondary btn-sm" style={{ height: '42px' }}>
              Apply Filter
            </button>
          </form>
        </div>

        {/* Events Table */}
        {loading ? (
          <LoadingSpinner message="Loading events..." />
        ) : events.length > 0 ? (
          <div className="table-responsive">
            <table className="cc-table">
              <thead>
                <tr>
                  <th>Event Title</th>
                  <th>Category</th>
                  <th>Date & Venue</th>
                  <th>Organizer</th>
                  <th>Capacity</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id}>
                    <td>
                      <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{event.title}</div>
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
                      <div style={{ fontSize: '0.8125rem', fontWeight: '600' }}>
                        {event.organizerName || 'Organizer'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {event.organizerEmail}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.8125rem', fontWeight: '600' }}>
                        {event.registeredCount} / {event.maxParticipants}
                      </div>
                    </td>
                    <td>{getStatusBadge(event.status)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <Link to={`/events/${event.id}`} className="btn btn-secondary btn-sm" title="View Public Page">
                          <Eye size={14} />
                        </Link>
                        <Link to={`/organizer/participants?eventId=${event.id}`} className="btn btn-secondary btn-sm" title="View Roster">
                          <Users size={14} />
                        </Link>
                        <Link to={`/organizer/edit-event/${event.id}`} className="btn btn-secondary btn-sm" title="Edit Event">
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
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="dashboard-section" style={{ textAlign: 'center', padding: '3.5rem' }}>
            <p style={{ color: 'var(--text-muted)' }}>No events found matching your query.</p>
          </div>
        )}

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
                  Delete Event?
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  Are you sure you want to delete this event? All attendee registrations will be removed.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setDeleteModalId(null)}
                  disabled={actionLoading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDeleteEvent}
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Deleting...' : 'Delete'}
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
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                  Cancel This Event?
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  Event status will become CANCELLED.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setCancelModalId(null)}
                  disabled={actionLoading}
                >
                  Go Back
                </button>
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={handleCancelEvent}
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Cancelling...' : 'Cancel Event'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ManageEvents;
