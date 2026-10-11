import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { eventService } from '../services/eventService';
import { registrationService } from '../services/registrationService';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  Share2,
  Mail,
  User,
  XCircle,
  Tag
} from 'lucide-react';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const { user, isAuthenticated, showToast } = useAuth();
  const navigate = useNavigate();

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const res = await eventService.getEventById(id);
      if (res.data) {
        setEvent(res.data);
      }
    } catch (err) {
      showToast('Event not found or failed to load', 'error');
      navigate('/events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const handleRegister = async () => {
    if (!isAuthenticated) {
      showToast('Please sign in to register for this event', 'info');
      navigate('/login', { state: { from: { pathname: `/events/${id}` } } });
      return;
    }

    try {
      setRegistering(true);
      await registrationService.registerForEvent(id);
      showToast('Successfully registered for ' + event.title + '!', 'success');
      fetchEvent();
    } catch (err) {
      showToast(err.message || 'Registration failed', 'error');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading event details..." />;
  }

  if (!event) return null;

  const isFull = event.availableSeats <= 0;
  const isCancelled = event.status === 'CANCELLED';
  const isCompleted = event.status === 'COMPLETED';
  const deadlinePassed = event.registrationDeadline && new Date(event.registrationDeadline) < new Date(new Date().setHours(0,0,0,0));

  return (
    <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1.5rem' }}>
      {/* Back button */}
      <div style={{ marginBottom: '1.25rem' }}>
        <Link to="/events" className="btn btn-secondary btn-sm" style={{ gap: '0.4rem' }}>
          <ArrowLeft size={16} /> Back to Events
        </Link>
      </div>

      {/* Hero Banner */}
      <div className="event-details-hero">
        <img
          src={event.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80'}
          alt={event.title}
        />
        <div className="event-details-overlay">
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span className="badge badge-primary">{event.category}</span>
            {isCancelled && <span className="badge badge-danger">Cancelled</span>}
            {isCompleted && <span className="badge badge-neutral">Completed</span>}
            {event.status === 'UPCOMING' && <span className="badge badge-success">Upcoming</span>}
          </div>
          <h1 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: '800', lineHeight: '1.2' }}>
            {event.title}
          </h1>
        </div>
      </div>

      {/* Grid Layout: Left Content & Right Action Sidebar */}
      <div className="event-details-grid">
        {/* Left Column */}
        <div>
          {/* Overview Section */}
          <div className="dashboard-section">
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1rem' }}>
              About This Event
            </h2>
            <p style={{ color: 'var(--text-main)', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
              {event.description || 'Join us for this exciting campus event! Check out the schedule and activities below.'}
            </p>
          </div>

          {/* Activities / Schedule Section */}
          {event.activities && event.activities.length > 0 && (
            <div className="dashboard-section">
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                Event Schedule & Activities
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                Key sessions and milestones planned for this event.
              </p>

              <div className="activity-timeline">
                {event.activities.map((act) => (
                  <div key={act.id} className="timeline-item">
                    <div className="timeline-dot" />
                    <div style={{ background: '#f8fafc', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)' }}>
                          {act.activityName}
                        </h4>
                        {act.activityTime && (
                          <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--primary)', background: 'var(--primary-light)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                            {act.activityTime}
                          </span>
                        )}
                      </div>
                      {act.venue && (
                        <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                          📍 {act.venue}
                        </div>
                      )}
                      {act.description && (
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                          {act.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Organizer Details */}
          <div className="dashboard-section">
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1rem' }}>
              Organized By
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700'
              }}>
                <User size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)' }}>
                  {event.organizerName || 'Campus Faculty / Student Council'}
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  <Mail size={14} /> {event.organizerEmail}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sticky Registration Sidebar */}
        <div>
          <div className="event-action-card">
            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Event Logistics
              </span>
              <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Calendar size={18} color="var(--primary)" />
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '700' }}>{event.eventDate}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Event Date</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Clock size={18} color="var(--primary)" />
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '700' }}>
                      {event.startTime || 'TBA'} {event.endTime ? `– ${event.endTime}` : ''}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Timing</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <MapPin size={18} color="var(--primary)" />
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '700' }}>{event.venue}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Location / Hall</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Users size={18} color="var(--primary)" />
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '700' }}>
                      {event.registeredCount} / {event.maxParticipants} Registered
                    </div>
                    <div style={{ fontSize: '0.75rem', color: isFull ? 'var(--danger)' : 'var(--text-muted)' }}>
                      {isFull ? 'Seats Full' : `${event.availableSeats} seats available`}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <AlertTriangle size={18} color="#f59e0b" />
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '700' }}>
                      {event.registrationDeadline}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Registration Deadline</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Registration Action Area */}
            <div>
              {event.isRegistered ? (
                <div style={{
                  background: 'var(--success-light)',
                  border: '1px solid #a7f3d0',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  textAlign: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: 'var(--success)', fontWeight: '700', marginBottom: '0.25rem' }}>
                    <CheckCircle size={18} /> You're Registered!
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: '#065f46' }}>
                    Your seat is confirmed. Check your dashboard for participation details.
                  </p>
                </div>
              ) : isCancelled ? (
                <button disabled className="btn btn-secondary btn-full btn-lg" style={{ cursor: 'not-allowed', opacity: 0.6 }}>
                  Event Cancelled
                </button>
              ) : isCompleted ? (
                <button disabled className="btn btn-secondary btn-full btn-lg" style={{ cursor: 'not-allowed', opacity: 0.6 }}>
                  Event Completed
                </button>
              ) : deadlinePassed ? (
                <button disabled className="btn btn-secondary btn-full btn-lg" style={{ cursor: 'not-allowed', opacity: 0.6 }}>
                  Registration Closed
                </button>
              ) : isFull ? (
                <button disabled className="btn btn-secondary btn-full btn-lg" style={{ cursor: 'not-allowed', opacity: 0.6 }}>
                  Capacity Reached (Full)
                </button>
              ) : (
                <button
                  onClick={handleRegister}
                  disabled={registering}
                  className="btn btn-primary btn-full btn-lg"
                >
                  {registering ? 'Processing Registration...' : 'Register Now'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
