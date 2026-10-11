import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { registrationService } from '../services/registrationService';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import { Calendar, Clock, MapPin, XCircle, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

const MyRegistrations = ({ isHistoryView = false }) => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelModalId, setCancelModalId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const { showToast } = useAuth();
  const location = useLocation();

  const isHistory = isHistoryView || location.pathname.includes('/history');

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const res = await registrationService.getMyRegistrations();
      if (res.data) {
        setRegistrations(res.data);
      }
    } catch (err) {
      showToast('Failed to load your registrations', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [location.pathname]);

  const handleCancelRegistration = async () => {
    if (!cancelModalId) return;
    try {
      setActionLoading(true);
      await registrationService.cancelRegistration(cancelModalId);
      showToast('Registration cancelled successfully', 'info');
      setCancelModalId(null);
      fetchRegistrations();
    } catch (err) {
      showToast(err.message || 'Failed to cancel registration', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Filter based on view mode
  const filteredRegistrations = isHistory
    ? registrations.filter((r) => r.status === 'ATTENDED' || r.eventStatus === 'COMPLETED')
    : registrations;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ATTENDED':
        return <span className="badge badge-success">Attended</span>;
      case 'CANCELLED':
        return <span className="badge badge-danger">Cancelled</span>;
      default:
        return <span className="badge badge-primary">Registered</span>;
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        <div className="dashboard-header">
          <div className="dashboard-title">
            <h1>{isHistory ? 'Participation History' : 'My Event Registrations'}</h1>
            <p>
              {isHistory
                ? 'Review past events and workshops you have attended.'
                : 'Manage all events you have currently registered for.'}
            </p>
          </div>
          <Link to="/events" className="btn btn-primary btn-sm">
            Discover More Events
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading your event registrations..." />
        ) : filteredRegistrations.length > 0 ? (
          <div className="table-responsive">
            <table className="cc-table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Category</th>
                  <th>Date & Time</th>
                  <th>Venue</th>
                  <th>Registration Status</th>
                  <th>Registered On</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegistrations.map((reg) => (
                  <tr key={reg.id}>
                    <td>
                      <Link
                        to={`/events/${reg.eventId}`}
                        style={{ fontWeight: '700', color: 'var(--primary)', textDecoration: 'none' }}
                      >
                        {reg.eventTitle}
                      </Link>
                    </td>
                    <td>
                      <span className="badge badge-neutral">{reg.category}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', fontSize: '0.8125rem' }}>
                        <span>📅 {reg.eventDate}</span>
                        {reg.startTime && <span style={{ color: 'var(--text-muted)' }}>⏰ {reg.startTime}</span>}
                      </div>
                    </td>
                    <td>{reg.venue}</td>
                    <td>{getStatusBadge(reg.status)}</td>
                    <td style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                      {reg.registrationDate ? new Date(reg.registrationDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Link to={`/events/${reg.eventId}`} className="btn btn-secondary btn-sm">
                          View
                        </Link>
                        {reg.status === 'REGISTERED' && (
                          <button
                            onClick={() => setCancelModalId(reg.id)}
                            className="btn btn-sm"
                            style={{ color: 'var(--danger)', border: '1px solid #fecaca', background: '#fef2f2' }}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="dashboard-section" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <Calendar size={48} color="var(--primary)" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>
              {isHistory ? 'No participation history yet' : 'No event registrations found'}
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '450px', margin: '0 auto 1.5rem auto' }}>
              {isHistory
                ? 'Once you attend campus workshops and fests, they will be logged here in your history.'
                : 'Explore upcoming sports tournaments, technical hackathons, and cultural fests.'}
            </p>
            <Link to="/events" className="btn btn-primary">
              Browse Events Now <ArrowRight size={16} />
            </Link>
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
                  Cancel Registration?
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: '1.5' }}>
                  Are you sure you want to cancel your seat for this event? Your spot will be made available to other students.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setCancelModalId(null)}
                  disabled={actionLoading}
                >
                  Keep Registration
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleCancelRegistration}
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Cancelling...' : 'Confirm Cancellation'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyRegistrations;
