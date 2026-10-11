import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { eventService } from '../services/eventService';
import Sidebar from '../components/Sidebar';
import { Calendar, PlusCircle, ArrowLeft, Image as ImageIcon } from 'lucide-react';

const CreateEvent = () => {
  const { user, showToast } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Technical',
    venue: '',
    eventDate: '',
    startTime: '10:00 AM',
    endTime: '04:00 PM',
    maxParticipants: 100,
    registrationDeadline: '',
    imageUrl: '',
    status: 'UPCOMING'
  });

  const categories = [
    'Technical',
    'Cultural',
    'Workshop',
    'Seminar',
    'Sports',
    'Competition',
    'Fest'
  ];

  const imagePresets = {
    Technical: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    Cultural: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80',
    Workshop: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
    Seminar: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=80',
    Sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80',
    Competition: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
    Fest: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80'
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      // Auto-update sample image preset if user switches category and hasn't manually customized image URL
      if (name === 'category' && (!prev.imageUrl || Object.values(imagePresets).includes(prev.imageUrl))) {
        next.imageUrl = imagePresets[value] || '';
      }
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.title.trim()) {
      setErrorMsg('Event title is required.');
      return;
    }
    if (!formData.venue.trim()) {
      setErrorMsg('Venue is required.');
      return;
    }
    if (!formData.eventDate) {
      setErrorMsg('Event date is required.');
      return;
    }
    if (!formData.registrationDeadline) {
      setErrorMsg('Registration deadline is required.');
      return;
    }
    if (new Date(formData.registrationDeadline) > new Date(formData.eventDate)) {
      setErrorMsg('Registration deadline cannot be after the event date.');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...formData,
        imageUrl: formData.imageUrl || imagePresets[formData.category]
      };
      await eventService.createEvent(payload);
      showToast('Event created successfully!', 'success');
      navigate(user?.role === 'ADMIN' ? '/admin/events' : '/organizer/events');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to create event.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        <div style={{ marginBottom: '1.5rem' }}>
          <Link
            to={user?.role === 'ADMIN' ? '/admin/events' : '/organizer/events'}
            className="btn btn-secondary btn-sm"
            style={{ display: 'inline-flex', gap: '0.4rem' }}
          >
            <ArrowLeft size={16} /> Back to Events
          </Link>
        </div>

        <div className="dashboard-section" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="section-header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
            <div>
              <h2>Create New Event</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                Fill out the form below to publish a new college event.
              </p>
            </div>
          </div>

          {errorMsg && (
            <div style={{
              background: 'var(--danger-light)',
              color: 'var(--danger)',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              margin: '1.25rem 0',
              fontSize: '0.875rem'
            }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Event Title *</label>
              <input
                type="text"
                name="title"
                className="form-control"
                placeholder="e.g. Annual Tech Summit 2026"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                rows="4"
                className="form-control"
                placeholder="Provide a detailed overview of the event, highlights, and rules..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  name="category"
                  className="form-control"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Venue *</label>
                <input
                  type="text"
                  name="venue"
                  className="form-control"
                  placeholder="e.g. Auditorium Hall 1"
                  value={formData.venue}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Event Date *</label>
                <input
                  type="date"
                  name="eventDate"
                  className="form-control"
                  value={formData.eventDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Registration Deadline *</label>
                <input
                  type="date"
                  name="registrationDeadline"
                  className="form-control"
                  value={formData.registrationDeadline}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Start Time</label>
                <input
                  type="text"
                  name="startTime"
                  className="form-control"
                  placeholder="09:30 AM"
                  value={formData.startTime}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">End Time</label>
                <input
                  type="text"
                  name="endTime"
                  className="form-control"
                  placeholder="04:30 PM"
                  value={formData.endTime}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Max Participants *</label>
                <input
                  type="number"
                  name="maxParticipants"
                  className="form-control"
                  min="1"
                  value={formData.maxParticipants}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Banner Image URL</label>
              <input
                type="url"
                name="imageUrl"
                className="form-control"
                placeholder="https://images.unsplash.com/..."
                value={formData.imageUrl}
                onChange={handleChange}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Tip: Leave blank to use a high-resolution stock image for the selected category.
              </span>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate(user?.role === 'ADMIN' ? '/admin/events' : '/organizer/events')}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateEvent;
