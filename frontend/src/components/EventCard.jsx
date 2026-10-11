import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, CheckCircle, ArrowRight } from 'lucide-react';

const EventCard = ({ event, onRegister, isRegistering }) => {
  if (!event) return null;

  const isFull = event.availableSeats !== undefined && event.availableSeats <= 0;
  const isCancelled = event.status === 'CANCELLED';
  const isCompleted = event.status === 'COMPLETED';

  const getStatusBadge = () => {
    switch (event.status) {
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
    <div className="event-card">
      <div className="event-card-img-wrapper">
        <img
          src={event.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80'}
          alt={event.title}
          className="event-card-img"
          loading="lazy"
        />
        <div className="event-badge-category">
          {event.category}
        </div>
        <div className="event-badge-status">
          {getStatusBadge()}
        </div>
      </div>

      <div className="event-card-body">
        <h3 className="event-card-title" title={event.title}>
          {event.title}
        </h3>

        <div className="event-meta-list">
          <div className="event-meta-item">
            <Calendar size={15} color="var(--primary)" />
            <span>{event.eventDate || 'Date TBA'}</span>
          </div>
          {event.startTime && (
            <div className="event-meta-item">
              <Clock size={15} color="var(--primary)" />
              <span>{event.startTime} {event.endTime ? `– ${event.endTime}` : ''}</span>
            </div>
          )}
          <div className="event-meta-item">
            <MapPin size={15} color="var(--primary)" />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {event.venue || 'Campus Venue'}
            </span>
          </div>
        </div>

        <div className="event-card-footer">
          <div className="event-seats-info">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Users size={14} />
              <span>
                {isFull ? (
                  <strong style={{ color: 'var(--danger)' }}>Housefull</strong>
                ) : (
                  <span><strong>{event.availableSeats ?? event.maxParticipants}</strong> seats left</span>
                )}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Link to={`/events/${event.id}`} className="btn btn-secondary btn-sm">
              Details
            </Link>

            {event.isRegistered ? (
              <span className="badge badge-primary" style={{ padding: '0.45rem 0.65rem' }}>
                <CheckCircle size={13} /> Registered
              </span>
            ) : onRegister && !isCancelled && !isCompleted && !isFull ? (
              <button
                onClick={() => onRegister(event.id)}
                disabled={isRegistering}
                className="btn btn-primary btn-sm"
              >
                Register
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
